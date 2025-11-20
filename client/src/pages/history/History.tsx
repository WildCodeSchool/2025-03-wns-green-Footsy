import { useQuery } from "@apollo/client/react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { HistoryCard } from "../../components/historyCard/HistoryCard";
import {
  HistoryFilters,
  type SortOption,
} from "../../components/historyFilters/HistoryFilters";
import { Loader } from "../../components/loader/Loader";

import {
  GET_ACTIVITIES_BY_USER_ID,
  GET_ALL_CATEGORIES,
  type GetActivitiesByUserIdData,
  type GetAllCategoriesData,
} from "../../graphql/operations";

import Footer from "../../layout/footer/Footer";
import MainHeader from "../../layout/main-header/MainHeader";
import MainLayout from "../../layout/main-layout/MainLayout";
import NavBar from "../../layout/navbar/NavBar";

import { processActivities } from "../../services/activity.services";

import classes from "./History.module.scss";

export default function History() {
  const navigate = useNavigate();
  const user = useCurrentUser();

  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    undefined
  );
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");

  if (!user) {
    navigate("/login");
  }

  const {
    data: activitiesData,
    loading: activitiesLoading,
    error: activitiesError,
  } = useQuery<GetActivitiesByUserIdData>(GET_ACTIVITIES_BY_USER_ID, {
    variables: { userId: user?.id },
    skip: !user,
  });

  const { data: categoriesData, loading: categoriesLoading } =
    useQuery<GetAllCategoriesData>(GET_ALL_CATEGORIES);

  const { filteredAndSortedActivities, groupedActivities } = useMemo(() => {
    const activities = activitiesData?.getActivitiesByUserId || [];
    const { filtered, grouped } = processActivities(
      activities,
      selectedCategory,
      sortBy
    );

    return {
      filteredAndSortedActivities: filtered,
      groupedActivities: grouped,
    };
  }, [activitiesData, selectedCategory, sortBy]);

  const loading = activitiesLoading || categoriesLoading;

  const categories = categoriesData?.getAllCategories || [];

  return (
    <>
      <MainLayout>
        <MainHeader title="Historique" />
        <section className={classes.history}>
          <h2 className={classes.history__title}>Historique</h2>
          {loading && <Loader />}
          {activitiesError && (
            <div className={classes.history__empty}>
              Erreur de chargement des activités.
            </div>
          )}

          {!loading && !activitiesError && (
            <div className={classes.history__container}>
              <HistoryFilters
                categories={categories}
                selectedCategory={selectedCategory}
                sortBy={sortBy}
                onCategoryChange={setSelectedCategory}
                onSortChange={setSortBy}
              />

              <div className={classes.history__content}>
                {filteredAndSortedActivities.length === 0 ? (
                  <div className={classes.history__empty}>
                    {!selectedCategory
                      ? "Aucune activité trouvée"
                      : "Aucune activité trouvée pour cette catégorie"}
                  </div>
                ) : (
                  <div className={classes.history__activities}>
                    {sortBy === "category" || sortBy.startsWith("date")
                      ? Object.entries(groupedActivities).map(
                          ([groupName, activities]) => (
                            <div
                              key={groupName}
                              className={classes.history__activities}
                            >
                              <h4 className={classes["history__group--title"]}>
                                {groupName}
                              </h4>
                              <div className={classes.history__activities}>
                                {activities.map((activity) => (
                                  <HistoryCard
                                    key={activity.id}
                                    activity={activity}
                                  />
                                ))}
                              </div>
                            </div>
                          )
                        )
                      : filteredAndSortedActivities.map((activity) => (
                          <HistoryCard key={activity.id} activity={activity} />
                        ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </MainLayout>
      <NavBar />
      <Footer />
    </>
  );
}
