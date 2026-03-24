import { useMutation } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";
import { toISODateString, formatDateForDisplay } from "../../utils/dateUtils";

import { useMode } from "../../context/modeContext";
import { useCurrentUser } from "../../context/userContext";
import {
  CHANGE_PASSWORD,
  DELETE_ACCOUNT,
  LOGOUT,
  UPDATE_AVATAR,
  UPDATE_PERSONAL_INFO,
} from "../../graphql/operations";
import type { Avatar } from "../../types/Avatar.types";

import AvatarSelector from "../avatarSelector/AvatarSelector";
import FormField from "../formField/FormField";
import { Loader } from "../loader/Loader";
import MainButton from "../mainButton/MainButton";
import { Modal } from "../modal/Modal";
import { ConfirmContent } from "../modal/ConfirmContent";
import SupportSection from "../supportSection/SupportSection";

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

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

const settingsPersonalInfoSchema = z.object({
  firstName: z.string().trim().min(1, "Le prénom est requis."),
  lastName: z.string().trim().min(1, "Le nom est requis."),
  birthdate: z
    .string()
    .trim()
    .min(1, "La date de naissance est requise.")
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
      message: "La date de naissance est invalide.",
    }),
});

const settingsPasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Le mot de passe actuel est requis."),
    newPassword: z
      .string()
      .regex(
        passwordRegex,
        "Le mot de passe doit faire au moins 8 caractères et contenir une majuscule, une minuscule, un chiffre et un caractère spécial.",
      ),
    confirmPassword: z.string(),
  })
  .superRefine((data, context) => {
    if (data.newPassword !== data.confirmPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Les mots de passe ne correspondent pas",
      });
    }
  });

export default function SettingsForm() {
  const { mode } = useMode();
  const navigate = useNavigate();
  const { user, loading, error, refetch } = useCurrentUser();

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
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] =
    useState(false);

  const [logoutMutation] = useMutation(LOGOUT);
  const [deleteAccountMutation] = useMutation(DELETE_ACCOUNT, {
    onCompleted: async () => {
      try {
        await logoutMutation();
      } finally {
        window.location.href = "/login";
      }
    },
    onError: () => {
      toast.error("Erreur lors de la suppression du compte");
      setIsDeleteAccountModalOpen(false);
    },
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        birthdate: toISODateString(user.birthdate),
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setSelectedAvatar(user.avatar);
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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
          if (refetch) refetch();
        })
        .catch((err) => {
          toast.error("Erreur lors de la mise à jour de l'avatar");
          console.error(err);
        });
    }
  };

  const savePersonalInfo = async (
    overrides?: Partial<
      Pick<SettingsFormData, "firstName" | "lastName" | "birthdate">
    >,
  ) => {
    if (!user) return false;

    try {
      const personalInfoToValidate = {
        firstName: overrides?.firstName ?? formData.firstName,
        lastName: overrides?.lastName ?? formData.lastName,
        birthdate: overrides?.birthdate ?? formData.birthdate,
      };

      const parsedPersonalInfo = settingsPersonalInfoSchema.safeParse(
        personalInfoToValidate,
      );
      if (!parsedPersonalInfo.success) {
        toast.error(
          parsedPersonalInfo.error.issues[0]?.message ?? "Formulaire invalide.",
        );
        return false;
      }

      const birthdateISO = new Date(
        parsedPersonalInfo.data.birthdate,
      ).toISOString();

      await updatePersonalInfo({
        variables: {
          userId: user.id,
          data: {
            first_name: parsedPersonalInfo.data.firstName,
            last_name: parsedPersonalInfo.data.lastName,
            birthdate: birthdateISO,
          },
        },
      });

      toast.success("Informations mises à jour");
      if (refetch) await refetch();
      return true;
    } catch (err) {
      console.error("Error updating personal info:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors de la mise à jour";
      toast.error(errorMessage);
      return false;
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    const parsedPasswordForm = settingsPasswordSchema.safeParse({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
    });

    if (!parsedPasswordForm.success) {
      toast.error(
        parsedPasswordForm.error.issues[0]?.message ?? "Formulaire invalide.",
      );
      return;
    }

    try {
      await changePassword({
        variables: {
          userId: user.id,
          data: {
            current_password: parsedPasswordForm.data.currentPassword,
            new_password: parsedPasswordForm.data.newPassword,
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
    } catch (err: unknown) {
      const errorMessage =
        (typeof err === "object" &&
          err !== null &&
          "graphQLErrors" in err &&
          Array.isArray(
            (err as { graphQLErrors?: Array<{ message?: string }> })
              .graphQLErrors,
          ) &&
          (err as { graphQLErrors: Array<{ message?: string }> })
            .graphQLErrors[0]?.message) ||
        (err instanceof Error
          ? err.message
          : "Erreur lors du changement de mot de passe");
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
          onClick={() => refetch?.()}
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
  const formattedBirthdate = formatDateForDisplay(user.birthdate, "fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const actionButtonClass = classes["settings-form__action-button"];
  const editActionButtonClass = `${actionButtonClass} ${classes["settings-form__action-button--edit"]}`;
  const primaryActionButtonClass = `${actionButtonClass} ${classes["settings-form__action-button--primary"]}`;
  const profileRowClass =
    `${classes["settings-form__profile-row"]} ${classes["settings-form__profile-row--inline-mobile"]}`.trim();
  const nameInfoItemClass = `${classes["settings-form__info-item"]} ${classes["settings-form__info-item--name"]}`;
  const nameEditItemClass = `${classes["settings-form__info-item"]} ${classes["settings-form__info-item--name-editing"]}`;
  const nameEditActionsClass =
    `${classes["settings-form__actions"]} ${classes["settings-form__actions--editing"]} ${classes["settings-form__actions--name-editing"]}`.trim();
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
      birthdate: toISODateString(user.birthdate),
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
            <div
              className={`${classes["settings-form__info-content"]} ${classes["settings-form__info-content--name-display"]}`}
            >
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
            <p className={classes["settings-form__info-title"]}>
              Date de naissance
            </p>
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
                  <button type="submit" className={primaryActionButtonClass}>
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

      <SupportSection
        amountRaised={300}
        onDonateClick={() =>
          toast.info("Fonctionnalité en cours de développement")
        }
      />

      <div className={classes["settings-form__delete-section"]}>
        <p className={classes["settings-form__delete-text"]}>
          Tu veux quitter Wild Carbon ?{" "}
          <button
            type="button"
            onClick={() => setIsDeleteAccountModalOpen(true)}
            className={classes["settings-form__delete-link"]}
            disabled={!user}
          >
            Supprimer mon compte.
          </button>
        </p>
      </div>

      <Modal
        isOpen={isDeleteAccountModalOpen}
        onClose={() => setIsDeleteAccountModalOpen(false)}
        title="Supprimer mon compte"
      >
        <ConfirmContent
          message="Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible."
          onConfirm={async () => {
            if (user) {
              await deleteAccountMutation({
                variables: { userId: user.id },
              });
              setIsDeleteAccountModalOpen(false);
            }
          }}
          onCancel={() => setIsDeleteAccountModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
