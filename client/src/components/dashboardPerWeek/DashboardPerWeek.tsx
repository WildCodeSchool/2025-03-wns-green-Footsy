import styles from "../../pages/dashboard/Dashboard.module.scss";

export default function DashboardPerWeek() {
  return (
    <>
      <article className={`${styles.dbCard} ${styles.dbCardLarge}`}>
        <div className={styles.dbCardHeader}>
          <h2>Emissions dans le temps</h2>
        </div>

        <div className={styles.dbCardBody}>
          <div className={styles.dbChartStatus}>Vue “Semaine” à implémenter.</div>
        </div>
      </article>

      <article className={styles.dbCard}>
        <div className={styles.dbCardHeader}>
          <h2>Répartition par catégorie</h2>
        </div>

        <div className={`${styles.dbCardBody} ${styles.dbPieRow}`}>
          <div className={styles.dbPieChart}>
            <div className={styles.dbPieStatus}>Vue “Semaine” à implémenter.</div>
          </div>
        </div>
      </article>
    </>
  );
}
