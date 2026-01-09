import { useMutation } from "@apollo/client/react";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

import { useCurrentUser } from "../../context/userContext";
import {
  DELETE_ACTIVITY,
  GET_ACTIVITIES_BY_USER_ID,
} from "../../graphql/operations";
import type { Activity } from "../../types/Activity.types";
import { formatDateForDisplay } from "../../utils/dateUtils";

import ActivityForm from "../activityForm/ActivityForm";
import { ConfirmContent } from "../modal/ConfirmContent";
import { Modal } from "../modal/Modal";
import { Tag } from "../tag/Tag";

import classes from "./HistoryCard.module.scss";

export function HistoryCard({ activity }: { activity: Activity }) {
  const { user } = useCurrentUser();
  const [deleteActivity] = useMutation(DELETE_ACTIVITY, {
    refetchQueries: user
      ? [{ query: GET_ACTIVITIES_BY_USER_ID, variables: { userId: user.id } }]
      : [],
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteActivity({ variables: { id: activity.id } });
      toast.success("Activité supprimée avec succès !");
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error(
        "Une erreur est survenue lors de la suppression de l'activité."
      );
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };

  return (
    <>
      <article className={classes.card}>
        <div className={classes.card__categoryTab}>
          {activity.type.category.title}
        </div>

        <div className={classes.card__content}>
          <div className={classes.card__date}>
            {formatDateForDisplay(activity.date)}
          </div>
          <div className={classes.card__header}>
            <div className={classes.card__titleContainer}>
              <h3 className={classes.card__title}>{activity.title}</h3>
              <Tag text={activity.type.title} variant="dark" />
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
            onClick={handleEdit}
            onKeyUp={(e) => {
              if (e.key === " " || e.key === "Enter") {
                handleEdit();
              }
            }}
          >
            <Pencil size={18} />
          </button>
          <button
            className={classes.card__actionBtn}
            title="Supprimer"
            aria-label="Supprimer"
            type="button"
            onClick={handleDeleteClick}
            onKeyUp={(e) => {
              if (e.key === " " || e.key === "Enter") {
                handleDeleteClick();
              }
            }}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </article>
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        title="Modifier l'activité"
      >
        <ActivityForm activityToEdit={activity} onSuccess={handleCloseModal} />
      </Modal>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        title="Confirmer la suppression"
      >
        <ConfirmContent
          message={`Êtes-vous sûr de vouloir supprimer l'activité "${activity.title}" ? Cette action est irréversible.`}
          onConfirm={handleDelete}
          onCancel={handleCloseDeleteModal}
        />
      </Modal>
    </>
  );
}
