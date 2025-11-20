import { useMutation } from "@apollo/client/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useMode } from "../../context/modeContext";
import { useCurrentUser } from "../../context/userContext";
import {
  UPDATE_PERSONAL_INFO,
  UPDATE_AVATAR,
  CHANGE_PASSWORD,
} from "../../graphql/operations";
import type { Avatar } from "../../types/Avatar.types";

import AvatarSelector from "../avatarSelector/AvatarSelector";
import FormField from "../formField/FormField";
import MainButton from "../mainButton/MainButton";
import { Loader } from "../loader/Loader";

import classes from "./SettingsForm.module.scss";

type SettingsFormData = {
  firstName: string;
  lastName: string;
  email: string;
  birthdate: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function SettingsForm() {
  const { mode } = useMode();
  const navigate = useNavigate();
  const { user, loading, error, refreshUser } = useCurrentUser();

  const [updatePersonalInfo] = useMutation(UPDATE_PERSONAL_INFO);
  const [updateAvatar] = useMutation(UPDATE_AVATAR);
  const [changePassword] = useMutation(CHANGE_PASSWORD);

  const [formData, setFormData] = useState<SettingsFormData>({
    firstName: "",
    lastName: "",
    email: "",
    birthdate: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBirthdate, setIsEditingBirthdate] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      const birthdate = user.birthdateString || "";

      setFormData({
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        birthdate,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setSelectedAvatar(user.avatar);
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarSelect = (avatar: Avatar) => {
    setSelectedAvatar(avatar);
    if (user) {
      updateAvatar({
        variables: {
          userId: user.id,
          data: { avatar_id: avatar.id },
        },
      })
        .then(() => {
          toast.success("Avatar mis à jour");
          refreshUser();
        })
        .catch((err) => {
          toast.error("Erreur lors de la mise à jour de l'avatar");
          console.error(err);
        });
    }
  };

  const savePersonalInfo = async (
    overrides?: Partial<Pick<SettingsFormData, "firstName" | "lastName" | "birthdate">>
  ) => {
    if (!user) return false;

    try {
      await updatePersonalInfo({
        variables: {
          userId: user.id,
          data: {
            first_name: overrides?.firstName ?? formData.firstName,
            last_name: overrides?.lastName ?? formData.lastName,
            birthdate: overrides?.birthdate ?? formData.birthdate,
          },
        },
      });

      toast.success("Informations mises à jour");
      await refreshUser();
      return true;
    } catch (err) {
      toast.error("Erreur lors de la mise à jour");
      console.error(err);
      return false;
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    try {
      await changePassword({
        variables: {
          userId: user.id,
          data: {
            current_password: formData.currentPassword,
            new_password: formData.newPassword,
          },
        },
      });

      toast.success("Mot de passe modifié");
      setIsChangingPassword(false);
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err: any) {
      const errorMessage =
        err?.graphQLErrors?.[0]?.message || "Erreur lors du changement de mot de passe";
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    console.error("Error loading user data:", error);
    return (
      <div className={classes["settings-form__error"]}>
        <p>Erreur lors du chargement des données</p>
        <p style={{ fontSize: "0.9rem", color: "red" }}>
          {error.message || "Une erreur est survenue"}
        </p>
        <MainButton
          type="button"
          mode={mode}
          content="Réessayer"
          onClick={() => refreshUser()}
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className={classes["settings-form__error"]}>
        <p>Aucun utilisateur connecté</p>
        <MainButton
          type="button"
          mode={mode}
          content="Se connecter"
          onClick={() => navigate("/login")}
        />
      </div>
    );
  }

  const fullName = `${user.first_name} ${user.last_name}`;
  const formattedBirthdate = user.birthdateString
    ? new Date(user.birthdateString).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "";
  const actionButtonClass = classes["settings-form__action-button"];
  const editActionButtonClass = `${actionButtonClass} ${classes["settings-form__action-button--edit"]}`;
  const primaryActionButtonClass = `${actionButtonClass} ${classes["settings-form__action-button--primary"]}`;
  const profileRowClass = `${classes["settings-form__profile-row"]} ${classes["settings-form__profile-row--inline-mobile"]}`.trim();
  const nameInfoItemClass = `${classes["settings-form__info-item"]} ${classes["settings-form__info-item--name"]}`;
  const nameEditItemClass = `${classes["settings-form__info-item"]} ${classes["settings-form__info-item--name-editing"]}`;
  const nameEditActionsClass = `${classes["settings-form__actions"]} ${classes["settings-form__actions--editing"]} ${classes["settings-form__actions--name-editing"]}`.trim();
  const birthdateInfoItemClass = `${classes["settings-form__info-item"]} ${
    isEditingBirthdate
      ? classes["settings-form__info-item--birthdate-editing"]
      : ""
  }`;
  const birthdateActionsClass = `${classes["settings-form__actions"]} ${
    isEditingBirthdate ? classes["settings-form__actions--editing"] : ""
  } ${
    isEditingBirthdate
      ? classes["settings-form__actions--birthdate-editing"]
      : ""
  }`.trim();

  const handleSaveName = async () => {
    const success = await savePersonalInfo({
      firstName: formData.firstName,
      lastName: formData.lastName,
    });
    if (success) {
      setIsEditingName(false);
    }
  };

  const handleCancelName = () => {
    setFormData((prev) => ({
      ...prev,
      firstName: user.first_name,
      lastName: user.last_name,
    }));
    setIsEditingName(false);
  };

  const handleSaveBirthdate = async () => {
    const success = await savePersonalInfo({
      birthdate: formData.birthdate,
    });
    if (success) {
      setIsEditingBirthdate(false);
    }
  };

  const handleCancelBirthdate = () => {
    setFormData((prev) => ({
      ...prev,
      birthdate: user.birthdateString || "",
    }));
    setIsEditingBirthdate(false);
  };

  const handleCancelPassword = () => {
    setIsChangingPassword(false);
    setFormData((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
  };

  return (
    <div className={classes["settings-form"]}>
    <h2 className={classes["settings-form__title"]}>Mon profil</h2>
      <section className={classes["settings-form__section"]}>
        <div className={profileRowClass}>
          <div
            className={`${classes["settings-form__info-item"]} ${classes["settings-form__info-item--avatar"]}`}
          >
            <div
              className={`${classes["settings-form__info-content"]} ${classes["settings-form__info-content--avatar"]}`}
            >
              
              <div className={classes["settings-form__avatar-selector"]}>
                <AvatarSelector
                  selectedAvatar={selectedAvatar || user.avatar}
                  onAvatarSelect={handleAvatarSelect}
                />
              </div>
            </div>
          </div>
        
          <div className={nameInfoItemClass}>
            <div className={`${classes["settings-form__info-content"]} ${classes["settings-form__info-content--name-display"]}`}>
              <p
                className={`${classes["settings-form__info-value"]} ${classes["settings-form__info-value--name"]}`}
              >
                {fullName}
              </p>
              {!isEditingName && (
                <button
                  type="button"
                  className={editActionButtonClass}
                  onClick={() => setIsEditingName(true)}
                >
                  Modifier
                </button>
              )}
            </div>
          </div>
        </div>

        {isEditingName && (
          <div className={nameEditItemClass}>
            <div className={classes["settings-form__info-content"]}>
              <div className={classes["settings-form__name-grid"]}>
                <FormField
                  label="Prénom"
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
                <FormField
                  label="Nom"
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className={nameEditActionsClass}>
              <button
                type="button"
                className={primaryActionButtonClass}
                onClick={handleSaveName}
              >
                Enregistrer
              </button>
              <button
                type="button"
                className={actionButtonClass}
                onClick={handleCancelName}
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        <div className={classes["settings-form__divider"]} />


        <div className={birthdateInfoItemClass}>
          <div className={classes["settings-form__info-content"]}>
            <p className={classes["settings-form__info-title"]}>Date de naissance</p>
            {isEditingBirthdate ? (
              <div className={classes["settings-form__inline-form"]}>
                <FormField
                  label="Date de naissance"
                  type="date"
                  id="birthdate"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            ) : (
              <p className={classes["settings-form__info-value"]}>
                {formattedBirthdate || "Ajoute ta date de naissance"}
              </p>
            )}
          </div>
          <div className={birthdateActionsClass}>
            {isEditingBirthdate ? (
              <>
                <button
                  type="button"
                  className={primaryActionButtonClass}
                  onClick={handleSaveBirthdate}
                >
                  Enregistrer
                </button>
                <button
                  type="button"
                  className={actionButtonClass}
                  onClick={handleCancelBirthdate}
                >
                  Annuler
                </button>
              </>
            ) : (
              <button
                type="button"
                className={editActionButtonClass}
                onClick={() => setIsEditingBirthdate(true)}
              >
                Modifier
              </button>
            )}
          </div>
        </div>

        <div className={classes["settings-form__divider"]} />

        <div className={classes["settings-form__info-item"]}>
          <div className={classes["settings-form__info-content"]}>
            <p className={classes["settings-form__info-title"]}>Mot de passe</p>
            {isChangingPassword ? (
              <form
                onSubmit={handlePasswordChange}
                className={classes["settings-form__inline-form"]}
              >
                <FormField
                  label="Mot de passe actuel"
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  required
                />
                <FormField
                  label="Nouveau mot de passe"
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  required
                />
                <FormField
                  label="Confirmer le nouveau mot de passe"
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                <div className={classes["settings-form__form-actions"]}>
                  <button
                    type="submit"
                    className={primaryActionButtonClass}
                  >
                    Enregistrer
                  </button>
                  <button
                    type="button"
                    className={actionButtonClass}
                    onClick={handleCancelPassword}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            ) : (
              <p className={classes["settings-form__info-value"]}>********</p>
            )}
          </div>
          {!isChangingPassword && (
            <div className={classes["settings-form__actions"]}>
              <button
                type="button"
                className={editActionButtonClass}
                onClick={() => setIsChangingPassword(true)}
              >
                Modifier
              </button>
            </div>
          )}
        </div>
      </section>

      <div className={classes["settings-form__support-section"]}>
        <h3 className={classes["settings-form__support-title"]}>
          Envie de soutenir l'app ?
        </h3>
        <div className={classes["settings-form__support-content"]}>
          <MainButton
            type="button"
            mode={mode}
            content="Participer au pot commun"
          />
          <div className={classes["settings-form__support-amount"]}>
            <span className={classes["settings-form__amount"]}>300€</span>
            <span className={classes["settings-form__amount-label"]}>
              récoltés à ce jour
            </span>
          </div>
        </div>
      </div>

      <div className={classes["settings-form__delete-section"]}>
        <p className={classes["settings-form__delete-text"]}>
          Tu veux quitter Wild Carbon ?{" "}
          <button
            type="button"
            onClick={() =>
              toast.info("Fonctionnalité en cours de développement")
            }
            className={classes["settings-form__delete-link"]}
          >
            Supprimer mon compte.
          </button>
        </p>
      </div>
    </div>
  );
}
