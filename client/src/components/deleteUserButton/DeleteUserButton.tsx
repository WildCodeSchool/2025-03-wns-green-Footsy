import { useMutation } from "@apollo/client/react";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

import { Modal } from "../modal/Modal";
import { ConfirmContent } from "../modal/ConfirmContent";

import { DELETE_USER_BY_ADMIN } from "../../graphql/operations";

import type { User } from "../../types/User.types";

import classes from "./DeleteUserButton.module.scss";

interface DeleteUserButtonProps {
  user: User;
  currentUserId: number;
  onDeleteSuccess: () => void;
  disabled?: boolean;
}

export function DeleteUserButton({
  user,
  currentUserId,
  onDeleteSuccess,
  disabled = false,
}: DeleteUserButtonProps) {
  const isSelf = user.id === currentUserId;
  const isDisabled = disabled || isSelf;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [deleteUserByAdmin] = useMutation(DELETE_USER_BY_ADMIN, {
    onCompleted: () => {
      toast.success("Utilisateur supprimé avec succès");
      onDeleteSuccess();
    },
    onError: () => {
      toast.error("Erreur lors de la suppression de l'utilisateur");
    },
  });

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUserByAdmin({
        variables: { userId: user.id },
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
  };

  const userName = `${user.first_name} ${user.last_name}`;

  return (
    <>
      <button
        type="button"
        className={classes["delete-user-btn"]}
        onClick={handleDeleteClick}
        disabled={isDisabled}
        title={
          isSelf
            ? "Vous ne pouvez pas vous supprimer vous-même."
            : "Supprimer l'utilisateur"
        }
      >
        <Trash2 size={20} />
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCancelDelete}
        title="Confirmation de suppression"
      >
        <ConfirmContent
          message={`Êtes-vous sûr de vouloir supprimer ${userName} ?`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </Modal>
    </>
  );
}
