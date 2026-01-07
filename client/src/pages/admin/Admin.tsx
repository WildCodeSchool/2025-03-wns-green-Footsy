import { useQuery } from "@apollo/client/react";

import { Loader } from "../../components/loader/Loader";
import { Tag } from "../../components/tag/Tag";
import { UserActions } from "../../components/userActions/UserActions";

import { useCurrentUser } from "../../context/userContext";

import { GET_ALL_USERS } from "../../graphql/operations";

import Footer from "../../layout/footer/Footer";
import MainHeader from "../../layout/main-header/MainHeader";
import MainLayout from "../../layout/main-layout/MainLayout";
import NavBar from "../../layout/navbar/NavBar";

import { getUserStatusBadge } from "../../services/admin.services";

import type { User } from "../../types/User.types";

import classes from "./Admin.module.scss";

type GetAllUsersData = {
  getAllUsers: User[];
};

export default function Admin() {
  const { user: currentUser } = useCurrentUser();

  const { data, loading, refetch } = useQuery<GetAllUsersData>(GET_ALL_USERS, {
    errorPolicy: "all",
    fetchPolicy: "network-only",
  });

  if (!currentUser) {
    return null;
  }

  return (
    <>
      <MainLayout>
        <MainHeader title="Admin" />
        <section className={classes.admin}>
          <h2 className={classes.admin__title}>Gestion des utilisateurs</h2>

          {loading && <Loader />}

          {!loading && (
            <div className={classes.admin__container}>
              {data?.getAllUsers && data.getAllUsers.length > 0 ? (
                <table className={classes["users-table"]}>
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Email</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.getAllUsers.map((user) => {
                      const statusBadge = getUserStatusBadge(user);
                      const userName = `${user.first_name} ${user.last_name}`;

                      return (
                        <tr key={user.id}>
                          <td
                            className={classes["users-table__name"]}
                            data-label="Nom"
                          >
                            {userName}
                          </td>
                          <td data-label="Email">{user.email}</td>
                          <td data-label="Statut">
                            <Tag
                              text={statusBadge.label}
                              variant={statusBadge.variant}
                            />
                          </td>
                          <td
                            data-label="Actions"
                            className={classes["users-table__actions"]}
                          >
                            <UserActions
                              user={user}
                              currentUserId={currentUser.id}
                              onActionComplete={refetch}
                              userName={userName}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className={classes.admin__empty}>
                  Aucun utilisateur trouvé.
                </div>
              )}
            </div>
          )}
        </section>
      </MainLayout>
      <NavBar />
      <Footer />
    </>
  );
}
