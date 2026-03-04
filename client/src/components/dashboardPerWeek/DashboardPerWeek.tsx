import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react";
import type { AgChartOptions } from "ag-charts-community";
import { AgCharts } from "ag-charts-react";
import { AG_CHARTS_LOCALE_FR_FR } from "ag-charts-locale";

import {
  GET_ACTIVITIES_BY_USER_ID,
  type GetActivitiesByUserIdData,
} from "../../graphql/operations";
import type { Activity } from "../../types/Activity.types";
import styles from "../../pages/dashboard/Dashboard.module.scss";
import { formatCo2 } from "../../utils/dashboardUtils";

type DailyDatum = {
  date: Date;
  co2Kg: number;
  count: number;
};

type CategoryDatum = {
  categoryId: number;
  category: string;
  co2Kg: number;
  count: number;
};

const isIsoDateOnly = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

const parseActivityDate = (value: string) => {
  if (isIsoDateOnly(value)) return new Date(`${value}T12:00:00`);
  return new Date(value);
};

const addDays = (date: Date, days: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

// Start of week: Monday 00:00 (FR)
const startOfWeek = (d: Date) => {
  const base = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = base.getDay();
  const diffToMonday = (day + 6) % 7; // Mon=0, Tue=1, ... Sun=6
  return addDays(base, -diffToMonday);
};

const computeDailySeriesForWeek = (activities: Activity[], weekStart: Date) => {
  const dailyKg = Array.from({ length: 7 }, () => 0);
  const dailyCount = Array.from({ length: 7 }, () => 0);
  const weekEndExclusive = addDays(weekStart, 7).getTime();

  for (const activity of activities) {
    const date = parseActivityDate(activity.date);
    if (Number.isNaN(date.getTime())) continue;

    const ts = date.getTime();
    if (ts < weekStart.getTime() || ts >= weekEndExclusive) continue;

    const dayIndex = Math.floor((ts - weekStart.getTime()) / (24 * 60 * 60 * 1000));
    if (dayIndex < 0 || dayIndex > 6) continue;

    dailyKg[dayIndex] += Number(activity.co2_equivalent) || 0;
    dailyCount[dayIndex] += 1;
  }

  const data: DailyDatum[] = dailyKg.map((co2Kg, dayIndex) => ({
    date: addDays(weekStart, dayIndex),
    co2Kg,
    count: dailyCount[dayIndex],
  }));

  const weekTotalKg = dailyKg.reduce((sum, value) => sum + value, 0);
  return { data, weekTotalKg };
};

const computeCategoryDistributionForWeek = (activities: Activity[], weekStart: Date) => {
  const byCategory = new Map<number, CategoryDatum>();
  const weekEndExclusive = addDays(weekStart, 7).getTime();

  for (const activity of activities) {
    const date = parseActivityDate(activity.date);
    if (Number.isNaN(date.getTime())) continue;

    const ts = date.getTime();
    if (ts < weekStart.getTime() || ts >= weekEndExclusive) continue;

    const category = activity.type?.category;
    if (!category) continue;

    const categoryId = Number(category.id);
    const existing = byCategory.get(categoryId);
    const co2 = Number(activity.co2_equivalent) || 0;

    if (!existing) {
      byCategory.set(categoryId, {
        categoryId,
        category: category.title,
        co2Kg: co2,
        count: 1,
      });
      continue;
    }

    existing.co2Kg += co2;
    existing.count += 1;
  }

  return Array.from(byCategory.values()).sort((a, b) => b.co2Kg - a.co2Kg);
};

export default function DashboardPerWeek({
  userId,
  userLoading,
}: {
  userId: number | undefined;
  userLoading: boolean;
}) {
  const [selectedWeekStart, setSelectedWeekStart] = useState(() =>
    startOfWeek(new Date())
  );

  const { data, loading, error } = useQuery<GetActivitiesByUserIdData>(
    GET_ACTIVITIES_BY_USER_ID,
    {
      variables: {
        userId: userId ?? 0,
      },
      skip: !userId,
      fetchPolicy: "cache-and-network",
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
    }
  );

  const activities = data?.getActivitiesByUserId ?? [];

  const weekLabel = useMemo(() => {
    const weekEnd = addDays(selectedWeekStart, 6);
    const startLabel = new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
    }).format(selectedWeekStart);

    const endLabel = new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(weekEnd);

    return `${startLabel} – ${endLabel}`;
  }, [selectedWeekStart]);

  const { seriesData, weekTotalKg } = useMemo(() => {
    const result = computeDailySeriesForWeek(activities, selectedWeekStart);
    return { seriesData: result.data, weekTotalKg: result.weekTotalKg };
  }, [activities, selectedWeekStart]);

  const { categoryData, totalCategoryCo2Kg } = useMemo(() => {
    const sorted = computeCategoryDistributionForWeek(activities, selectedWeekStart);
    const total = sorted.reduce((sum, d) => sum + d.co2Kg, 0);
    return { categoryData: sorted, totalCategoryCo2Kg: total };
  }, [activities, selectedWeekStart]);

  const chartOptions = useMemo<AgChartOptions>(() => {
    return {
      locale: AG_CHARTS_LOCALE_FR_FR,
      autoSize: true,
      background: {
        fill: "transparent",
      },
      data: seriesData,
      theme: {
        overrides: {
          area: {
            series: {
              interpolation: { type: "smooth" },
              strokeWidth: 2,
              fillOpacity: 0.7,
            },
          },
        },
      },
      title: {
        text: `Émissions CO2 par jour — ${weekLabel}`,
      },
      footnote: {
        text: "Somme des activités (kg CO2e) sur 7 jours",
      },
      series: [
        {
          type: "area",
          xKey: "date",
          yKey: "co2Kg",
          yName: "kg CO2e",
          stacked: false,
          tooltip: {
            renderer: ({ datum }) => {
              const dayLabel = new Intl.DateTimeFormat("fr-FR", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              }).format(datum.date);

              return {
                title: dayLabel,
                data: [
                  {
                    label: "Émissions",
                    value: formatCo2(datum.co2Kg),
                  },
                  {
                    label: "Activités",
                    value: String(datum.count),
                  },
                ],
              };
            },
          },
        },
      ],
      axes: {
        x: {
          type: "unit-time",
          position: "bottom",
          label: {
            format: "%a %d",
          },
          gridLine: {
            style: [
              {
                strokeWidth: 1,
                lineDash: [2, 2],
              },
              {
                strokeWidth: 0,
              },
            ],
          },
        },
        y: {
          type: "number",
          position: "left",
          label: {
            formatter: (params) => {
              const value = Number(params.value);
              if (!Number.isFinite(value)) return "";
              if (value >= 1000) return `${Math.round(value / 1000)}k`;
              return String(Math.round(value));
            },
          },
          gridLine: {
            style: [
              {
                strokeWidth: 1,
                lineDash: [2, 2],
              },
              {
                strokeWidth: 0,
              },
            ],
          },
        },
      },
      legend: {
        enabled: false,
      },
      tooltip: {
        position: {
          placement: ["right", "left", "top", "bottom"],
        },
      },
    };
  }, [seriesData, weekLabel]);

  const categoryChartOptions = useMemo<AgChartOptions>(() => {
    const numFormatter = new Intl.NumberFormat("fr-FR");

    return {
      locale: AG_CHARTS_LOCALE_FR_FR,
      autoSize: true,
      background: {
        fill: "transparent",
      },
      data: categoryData,
      theme: {
        overrides: {
          donut: {
            series: {
              strokeWidth: 1,
              sectorSpacing: 2,
              innerRadiusRatio: 0.62,
              outerRadiusRatio: 0.92,
            },
          },
        },
      },
      series: [
        {
          type: "donut",
          angleKey: "co2Kg",
          calloutLabelKey: "category",
          sectorLabelKey: "co2Kg",
          calloutLabel: {
            enabled: true,
            minAngle: 10,
            fontSize: 11,
            formatter: ({ datum }) => `${formatCo2(datum.co2Kg)}\n${datum.category}`,
          },
          sectorLabel: {
            enabled: true,
            minAngle: 0,
            fontSize: 11,
            color: "#ffffff",
            fontWeight: "bold",
            formatter: (params) => {
              if (!totalCategoryCo2Kg) return "";

              const anyParams = params as unknown as {
                datum?: { co2Kg?: number };
                sectorLabelValue?: unknown;
                value?: unknown;
              };

              const value = Number(
                anyParams.sectorLabelValue ?? anyParams.value ?? anyParams.datum?.co2Kg
              );
              if (!Number.isFinite(value) || value <= 0) return "";

              const percentage = (value / totalCategoryCo2Kg) * 100;
              return `${percentage.toFixed(1)}%`;
            },
          },
          innerLabels: [
            {
              text: totalCategoryCo2Kg
                ? numFormatter.format(Math.round(totalCategoryCo2Kg))
                : "0",
              fontSize: 20,
            },
            {
              text: "kg CO2e",
              spacing: 6,
            },
          ],
          tooltip: {
            renderer: ({ datum }) => {
              const percentage = totalCategoryCo2Kg
                ? ((datum.co2Kg / totalCategoryCo2Kg) * 100).toFixed(1)
                : "0.0";

              const rank =
                categoryData.findIndex((d) => d.categoryId === datum.categoryId) + 1;

              return {
                title: datum.category,
                data: [
                  { label: "CO2", value: formatCo2(datum.co2Kg) },
                  { label: "Activités", value: String(datum.count) },
                  { label: "Part", value: `${percentage}%` },
                  {
                    label: "Rang",
                    value: categoryData.length
                      ? `#${rank} / ${categoryData.length}`
                      : "-",
                  },
                ],
              };
            },
          },
        },
      ],
      legend: {
        enabled: false,
      },
      animation: {
        enabled: true,
        duration: 800,
      },
    };
  }, [categoryData, totalCategoryCo2Kg]);

  const goToPreviousWeek = () => {
    setSelectedWeekStart((prev) => addDays(prev, -7));
  };

  const goToNextWeek = () => {
    setSelectedWeekStart((prev) => addDays(prev, 7));
  };

  return (
    <>
      <article className={`${styles.dbCard} ${styles.dbCardLarge}`}>
        <div className={styles.dbCardHeader}>
          <h2>Emissions dans le temps</h2>
        </div>

        <div className={styles.dbCardBody}>
          <div className={styles.dbPeriodHeader}>
            <div className={styles.dbControlsButtons}>
              <button
                className={styles.dbArrowPrevious}
                type="button"
                aria-label="Semaine précédente"
                onClick={goToPreviousWeek}
              >
                ‹
              </button>

              <div className={styles.dbMonth}>{weekLabel}</div>

              <button
                className={styles.dbArrowNext}
                type="button"
                aria-label="Semaine suivante"
                onClick={goToNextWeek}
              >
                ›
              </button>
            </div>

            <div className={styles.dbTotalInline}>Total : {formatCo2(weekTotalKg)}</div>
          </div>

          <div className={styles.dbChart}>
            {userLoading || loading ? (
              <div className={styles.dbChartStatus}>Chargement…</div>
            ) : error ? (
              <div className={styles.dbChartStatus}>
                Erreur lors du chargement des activités.
              </div>
            ) : !userId ? (
              <div className={styles.dbChartStatus}>
                Connectez-vous pour afficher le graphique.
              </div>
            ) : (
              <AgCharts options={chartOptions} />
            )}
          </div>
        </div>
      </article>

      <article className={styles.dbCard}>
        <div className={styles.dbCardHeader}>
          <h2>Répartition par catégorie</h2>
        </div>

        <div className={`${styles.dbCardBody} ${styles.dbPieRow}`}>
          <div className={styles.dbPieChart}>
            {userLoading || loading ? (
              <div className={styles.dbPieStatus}>Chargement…</div>
            ) : error ? (
              <div className={styles.dbPieStatus}>
                Erreur lors du chargement des activités.
              </div>
            ) : !userId ? (
              <div className={styles.dbPieStatus}>
                Connectez-vous pour afficher le graphique.
              </div>
            ) : categoryData.length === 0 ? (
              <div className={styles.dbPieStatus}>Aucune activité enregistrée.</div>
            ) : (
              <AgCharts options={categoryChartOptions} />
            )}
          </div>
        </div>
      </article>
    </>
  );
}
