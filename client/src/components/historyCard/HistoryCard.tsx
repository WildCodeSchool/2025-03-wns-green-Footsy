import { Pencil, Trash2 } from "lucide-react";
import type { Activity } from "../../types/Activity.types";
import { Tag } from "../tag/Tag";
import classes from "./HistoryCard.module.scss";

export function HistoryCard({ activity }: { activity: Activity }) {
  return (
    <article className={classes.card}>
      <div className={classes.card__categoryTab}>
        {activity.type.category.title}
      </div>

      <div className={classes.card__content}>
        <div className={classes.card__date}>{activity.date}</div>
        <div className={classes.card__header}>
          <div className={classes.card__titleContainer}>
            <h3 className={classes.card__title}>{activity.title}</h3>
            <Tag text={activity.type.title} variant="secondary" />
          </div>
        </div>

        <div className={classes.card__body}>
          <div className={classes.card__infoGrid}>
            <div className={classes.card__infoItem}>
              <span className={classes.card__infoValue}>
                {activity.quantity ?? "-"} {activity.type.quantity_unit}
              </span>
            </div>

            <div className={classes.card__infoItem}>
              <span className={classes.card__infoLabel}>CO₂ émis</span>
              <span className={classes.card__infoValue}>
                {activity.co2_equivalent} kg
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={classes.card__actions}>
        <button
          className={classes.card__actionBtn}
          title="Modifier"
          aria-label="Modifier"
          type="button"
        >
          <Pencil size={18} />
        </button>
        <button
          className={classes.card__actionBtn}
          title="Supprimer"
          aria-label="Supprimer"
          type="button"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </article>
  );
}
