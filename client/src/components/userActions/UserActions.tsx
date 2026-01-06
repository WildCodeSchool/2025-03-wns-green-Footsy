import { useMutation } from "@apollo/client/react";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

import { ConfirmModal } from "../confirmModal/ConfirmModal";

import {
  DELETE_USER_BY_ADMIN,
  PROMOTE_USER_TO_ADMIN,
} from "../../graphql/operations";

import type { User } from "../../types/User.types";

import classes from "./UserActions.module.scss";

interface UserActionsProps {
  user: User;
  currentUserId: number;
  onActionComplete: () => void;
  userName: string;
}

type ModalState = {
  isOpen: boolean;
  message: string;
  action: (() => Promise<void>) | null;
};

export function UserActions({
  user,
  currentUserId,
  onActionComplete,
  userName,
}: UserActionsProps) {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    message: "",
    action: null,
  });

  const [deleteUserByAdmin] = useMutation(DELETE_USER_BY_ADMIN, {
    onCompleted: () => {
      toast.success("Utilisateur supprimé avec succès");
      onActionComplete();
    },
    onError: () => {
      toast.error("Erreur lors de la suppression de l'utilisateur");
    },
  });

  const [promoteUserToAdmin] = useMutation(PROMOTE_USER_TO_ADMIN, {
    onCompleted: () => {
      toast.success("Utilisateur promu admin avec succès");
      onActionComplete();
    },
    onError: () => {
      toast.error("Erreur lors de la promotion de l'utilisateur");
    },
  });

  const openModal = (message: string, action: () => Promise<void>) => {
    setModalState({
      isOpen: true,
      message,
      action,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      message: "",
      action: null,
    });
  };

  const handleConfirmAction = async () => {
    if (modalState.action) {
      try {
        await modalState.action();
        closeModal();
      } catch (err) {
        console.error("Error performing action:", err);
      }
    }
  };

  const showPromoteButton = !user.isAdmin;
  const isSelf = user.id === currentUserId;

  return (
    <>
      <div className={classes["user-actions"]}>
        {showPromoteButton && (
          <button
            type="button"
            className={`${classes["user-actions__btn"]} ${classes["user-actions__btn--promote"]}`}
            onClick={() =>
              openModal(
                `Êtes-vous sûr de vouloir promouvoir ${userName} en admin ?`,
                async () => {
                  await promoteUserToAdmin({
                    variables: { userId: user.id },
                  });
                }
              )
            }
            disabled={isSelf}
            title={
              isSelf
                ? "Vous ne pouvez pas vous promouvoir vous-même."
                : undefined
            }
          >
            Promouvoir admin
          </button>
        )}
        <button
          type="button"
          className={`${classes["user-actions__btn"]} ${classes["user-actions__btn--delete"]}`}
          onClick={() =>
            openModal(
              `Êtes-vous sûr de vouloir supprimer ${userName} ?`,
              async () => {
                await deleteUserByAdmin({
                  variables: { userId: user.id },
                });
              }
            )
          }
          disabled={isSelf}
          title={
            isSelf
              ? "Vous ne pouvez pas vous supprimer vous-même."
              : "Supprimer l'utilisateur"
          }
        >
          <Trash2 size={20} />
        </button>
      </div>

      <ConfirmModal
        isOpen={modalState.isOpen}
        message={modalState.message}
        onConfirm={handleConfirmAction}
        onCancel={closeModal}
      />
    </>
  );
}
