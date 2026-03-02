import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react";
import MainHeader from "../../layout/main-header/MainHeader";
import MainLayout from "../../layout/main-layout/MainLayout";
import NavBar from "../../layout/navbar/NavBar";
import Footer from "../../layout/footer/Footer";

import { useCurrentUser } from "../../context/userContext";
import {
  GET_FRIENDS_CO2_RANKING,
  type GetFriendsCo2RankingData,
} from "../../graphql/operations";
import DashboardPerYear from "../../components/dahsboardPerYear/DashboardPerYear";
import DashboardPerMonth from "../../components/dashboardPerMonth/DashboardPerMonth";
import DashboardPerWeek from "../../components/dashboardPerWeek/DashboardPerWeek";
import { getAvatarImageUrl } from "../../components/avatarSelector/AvatarSelector";

import styles from "./Dashboard.module.scss";
import { formatCo2 } from "./dashboardUtils";

type Period = "week" | "month" | "year";

export default function Dashboard() {
  const { user, loading: userLoading } = useCurrentUser();
  const [period, setPeriod] = useState<Period>("year");

  const userId = user?.id;

  const {
    data: friendsRankingData,
    loading: friendsRankingLoading,
    error: friendsRankingError,
  } = useQuery<GetFriendsCo2RankingData>(GET_FRIENDS_CO2_RANKING, {
    variables: { userId: userId ?? 0 },
    skip: !userId,
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
    errorPolicy: "all",
  });

  const top3 = friendsRankingData?.getFriendsCo2Ranking.top3 ?? [];
  const me = friendsRankingData?.getFriendsCo2Ranking.me ?? null;
  const total = friendsRankingData?.getFriendsCo2Ranking.total ?? 0;

  const formatAvg = (avg: number | null) => (avg == null ? "—" : formatCo2(avg));

  const podium = useMemo(() => {
    return {
      first: top3[0] ?? null,
      second: top3[1] ?? null,
      third: top3[2] ?? null,
    };
  }, [top3]);

  const getUserAvatarUrl = (entry: typeof me) => {
    const imageName = entry?.user.avatar?.image;
    return imageName ? getAvatarImageUrl(imageName) : "";
  };

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
            <div className={styles.dbSegmented} role="tablist" aria-label="Période">
              <button
                className={`${styles.dbSegmentedBtnWeek} ${period === "week" ? "isActive" : ""}`}
                type="button"
                onClick={() => setPeriod("week")}
              >
                Semaine
              </button>
              <button
                className={`${styles.dbSegmentedBtnMonth} ${period === "month" ? "isActive" : ""}`}
                type="button"
                onClick={() => setPeriod("month")}
              >
                Mois
              </button>
              <button
                className={`${styles.dbSegmentedBtnYear} ${period === "year" ? "isActive" : ""}`}
                type="button"
                onClick={() => setPeriod("year")}
              >
                Année
              </button>
            </div>
          </div>
        </header>

        <section className={styles.dbGrid}>
          {period === "year" ? (
            <DashboardPerYear userId={userId} userLoading={userLoading} />
          ) : period === "month" ? (
            <DashboardPerMonth userId={userId} userLoading={userLoading} />
          ) : (
            <DashboardPerWeek userId={userId} userLoading={userLoading} />
          )}

          <article className={styles.dbCard}>
            <div className={styles.dbCardHeader}>
              <h2>Classement des amis</h2>
            </div>

            <div className={`${styles.dbCardBody} ${styles.dbFriends}`}>
              {friendsRankingLoading || userLoading ? (
                <div className={styles.dbChartStatus}>Chargement…</div>
              ) : friendsRankingError ? (
                <div className={styles.dbChartStatus}>
                  Erreur lors du chargement du classement.
                </div>
              ) : !userId ? (
                <div className={styles.dbChartStatus}>
                  Connectez-vous pour afficher le classement.
                </div>
              ) : total === 0 ? (
                <div className={styles.dbChartStatus}>
                  Aucun ami trouvé.
                </div>
              ) : (
                <>
                  <div className={styles.dbFriendsPodium}>
                    <div className={styles.dbPodiumItem2}>
                      <div className={styles.dbRank}>2e</div>
                      <div className={styles.dbAvatar}>
                        {podium.second ? (
                          <img
                            src={getUserAvatarUrl(podium.second)}
                            alt={`Avatar de ${podium.second.user.first_name}`}
                          />
                        ) : null}
                      </div>
                      <div className={styles.dbName}>
                        {podium.second ? `${podium.second.user.first_name}` : "—"}
                      </div>
                      <div className={styles.dbSub}>
                        {podium.second ? formatAvg(podium.second.averageCo2Kg) : "—"}
                      </div>
                    </div>

                    <div className={styles.dbPodiumItem1}>
                      <div className={styles.dbCrown}>👑</div>
                      <div className={styles.dbRank}>1er</div>
                      <div className={`${styles.dbAvatar} ${styles.isBig}`}>
                        {podium.first ? (
                          <img
                            src={getUserAvatarUrl(podium.first)}
                            alt={`Avatar de ${podium.first.user.first_name}`}
                          />
                        ) : null}
                      </div>
                      <div className={styles.dbName}>
                        {podium.first ? `${podium.first.user.first_name}` : "—"}
                      </div>
                      <div className={styles.dbSub}>
                        {podium.first ? formatAvg(podium.first.averageCo2Kg) : "—"}
                      </div>
                    </div>

                    <div className={styles.dbPodiumItem3}>
                      <div className={styles.dbRank}>3e</div>
                      <div className={styles.dbAvatar}>
                        {podium.third ? (
                          <img
                            src={getUserAvatarUrl(podium.third)}
                            alt={`Avatar de ${podium.third.user.first_name}`}
                          />
                        ) : null}
                      </div>
                      <div className={styles.dbName}>
                        {podium.third ? `${podium.third.user.first_name}` : "—"}
                      </div>
                      <div className={styles.dbSub}>
                        {podium.third ? formatAvg(podium.third.averageCo2Kg) : "—"}
                      </div>
                    </div>
                  </div>

                  <div className={styles.dbYou}>
                    <div className={styles.dbYouLine} />
                    <div className={styles.dbYouCard}>
                      <div className={styles.dbAvatar}>
                        {me ? (
                          <img
                            src={getUserAvatarUrl(me)}
                            alt={`Avatar de ${me.user.first_name}`}
                          />
                        ) : null}
                      </div>
                      <div className={styles.dbYouLabel}>Votre classement</div>
                      <div className={styles.dbYouRank}>{me ? `${me.rank}e` : "—"}</div>
                      <div className={styles.dbYouKg}>{me ? formatAvg(me.averageCo2Kg) : "—"}</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </article>
        </section>
      </main>

      <Footer />
    </MainLayout>
  );
}
