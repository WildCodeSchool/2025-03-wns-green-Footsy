import MainHeader from "../../layout/main-header/MainHeader";
import MainLayout from "../../layout/main-layout/MainLayout";
import NavBar from "../../layout/navbar/NavBar";
import Footer from "../../layout/footer/Footer";

import styles from "./Dashboard.module.scss";

export default function Dashboard() {

  return (
    <MainLayout>
      <MainHeader title={""} />
      <NavBar />

      <main className={styles.dbPage}>
        <header className={styles.dbTop}>
          <div className={styles.dbTitle}>
            <h1>Tableau de bord</h1>
            <span className={styles.dbTitleUnderline} />
          </div>

          <div className={styles.dbControls}>
            <div className={styles.dbControlsButtons}>
              <button
                className={styles.dbArrowPrevious}
                type="button"
                aria-label="Mois précédent"
              >
                ‹
              </button>

              <div className={styles.dbMonth}>Juin 2025</div>

              <button
                className={styles.dbArrowNext}
                type="button"
                aria-label="Mois suivant"
              >
                ›
              </button>
            </div>
            <div
              className={styles.dbSegmented}
              role="tablist"
              aria-label="Période"
            >
              <button className={styles.dbSegmentedBtnWeek} type="button">
                Semaine
              </button>
              <button className={`${styles.dbSegmentedBtnMonth}`} type="button">
                Mois
              </button>
              <button className={styles.dbSegmentedBtnYear} type="button">
                Année
              </button>
            </div>
          </div>
        </header>

        <section className={styles.dbTotalWrap}>
          <div className={styles.dbTotal}>Total : 514 kg CO2</div>
        </section>

        <section className={styles.dbGrid}>
          <article className={`${styles.dbCard} ${styles.dbCardLarge}`}>
            <div className={styles.dbCardHeader}>
              <h2>Emissions dans le temps</h2>
            </div>

            <div className={styles.dbCardBody}>
              <div className={styles.dbChartPlaceholder}>
                <div className={styles.dbMarker}>
                  <div className={styles.dbMarkerTooltip}>
                    <div className={styles.dbMarkerTitle}>27 Juin</div>
                    <div className={styles.dbMarkerValue}>210 kg CO2</div>
                  </div>
                  <div className={styles.dbMarkerLine} />
                </div>

                <div className={styles.dbFakeAxis}>
                  <span>01</span>
                  <span>08</span>
                  <span>15</span>
                  <span>22</span>
                  <span>29</span>
                </div>
              </div>
            </div>
          </article>

          <article className={styles.dbCard}>
            <div className={styles.dbCardHeader}>
              <h2>Répartition par catégorie</h2>
            </div>

            <div className={`${styles.dbCardBody} ${styles.dbPieRow}`}>
              <div className={styles.dbPiePlaceholder} />

              <aside className={styles.dbCategoryPill}>
                <div className={styles.dbCategoryPillTitle}>Transports</div>
                <div className={styles.dbCategoryPillValue}>500 kg CO2</div>
              </aside>
            </div>
          </article>

          <article className={styles.dbCard}>
            <div className={styles.dbCardHeader}>
              <h2>Classement des amis</h2>
            </div>

            <div className={`${styles.dbCardBody} ${styles.dbFriends}`}>
              <div className={styles.dbFriendsPodium}>
                <div className={styles.dbPodiumItem2}>
                  <div className={styles.dbRank}>2e</div>
                  <div className={styles.dbAvatar} />
                  <div className={styles.dbName}>Ipsum</div>
                  <div className={styles.dbSub}>315 kg CO2</div>
                </div>

                <div className={styles.dbPodiumItem1}>
                  <div className={styles.dbCrown}>👑</div>
                  <div className={styles.dbRank}>1er</div>
                  <div className={`${styles.dbAvatar} ${styles.isBig}`} />
                  <div className={styles.dbName}>Lorem</div>
                  <div className={styles.dbSub}>305 kg CO2</div>
                </div>

                <div className={styles.dbPodiumItem3}>
                  <div className={styles.dbRank}>3e</div>
                  <div className={styles.dbAvatar} />
                  <div className={styles.dbName}>Dolor</div>
                  <div className={styles.dbSub}>335 kg CO2</div>
                </div>
              </div>

              <div className={styles.dbYou}>
                <div className={styles.dbYouLine} />
                <div className={styles.dbYouCard}>
                  <div className={styles.dbAvatar} />
                  <div className={styles.dbYouLabel}>Votre classement</div>
                  <div className={styles.dbYouRank}>7e</div>
                  <div className={styles.dbYouKg}>514 kg CO2</div>
                </div>
              </div>
            </div>
          </article>
        </section>
      </main>

      <Footer />
    </MainLayout>
  );
}
