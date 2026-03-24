import { useQuery } from "@apollo/client/react";

import { AdminSwitch } from "../../components/adminSwitch/AdminSwitch";
import { DeleteUserButton } from "../../components/deleteUserButton/DeleteUserButton";
import { Loader } from "../../components/loader/Loader";
import { Tag } from "../../components/tag/Tag";

import { useCurrentUser } from "../../context/userContext";

import { GET_ALL_USERS } from "../../graphql/operations";

import Footer from "../../layout/footer/Footer";
import MainHeader from "../../layout/main-header/MainHeader";
import MainLayout from "../../layout/main-layout/MainLayout";
import NavBar from "../../layout/navbar/NavBar";

import { getUserStatusBadge } from "../../services/admin.services";

import { UserSchema, type User } from "../../types/User.types";

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

  const parsedUsers = UserSchema.array().safeParse(data?.getAllUsers ?? []);

  if (!parsedUsers.success) {
    console.error("Invalid getAllUsers payload", parsedUsers.error.flatten());
  }

  const allUsers = [...(parsedUsers.success ? parsedUsers.data : [])].sort((a, b) =>
    a.last_name.toLowerCase().localeCompare(b.last_name.toLowerCase())
  );

  return (
    <>
      <MainLayout>
        <MainHeader title="Admin" />
        <section className={classes.admin}>
          <h2 className={classes.admin__title}>Gestion des utilisateurs</h2>

          {loading && <Loader />}

          {!loading && (
            <div className={classes.admin__container}>
              {allUsers.length > 0 ? (
                <table className={classes["users-table"]}>
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Email</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map((user) => {
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
                          <td
                            data-label="Statut"
                            className={classes["users-table__status"]}
                          >
                            <div>
                              <AdminSwitch
                                user={user}
                                currentUserId={currentUser.id}
                                onToggleSuccess={refetch}
                              />
                              <Tag
                                text={statusBadge.label}
                                variant={statusBadge.variant}
                              />
                            </div>
                          </td>
                          <td
                            data-label="Delete"
                            className={classes["users-table__delete"]}
                          >
                            <DeleteUserButton
                              user={user}
                              currentUserId={currentUser.id}
                              onDeleteSuccess={refetch}
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
