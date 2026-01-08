import { useMutation } from "@apollo/client/react";
import { toast } from "react-toastify";

import { TOGGLE_USER_ADMIN_STATUS } from "../../graphql/operations";

import type { User } from "../../types/User.types";

import classes from "./AdminSwitch.module.scss";

interface AdminSwitchProps {
  user: User;
  currentUserId: number;
  onToggleSuccess: () => void;
  disabled?: boolean;
}

export function AdminSwitch({
  user,
  currentUserId,
  onToggleSuccess,
  disabled = false,
}: AdminSwitchProps) {
  const isSelf = user.id === currentUserId;
  const isDisabled = disabled || isSelf;

  const [toggleUserAdminStatus] = useMutation(TOGGLE_USER_ADMIN_STATUS, {
    // biome-ignore lint/suspicious/noExplicitAny: Apollo mutation callback
    onCompleted: (data: any) => {
      const newStatus = data.toggleUserAdminStatus.isAdmin;
      toast.success(
        newStatus
          ? "Utilisateur promu admin avec succès"
          : "Utilisateur retiré des admins avec succès"
      );
      onToggleSuccess();
    },
    onError: () => {
      toast.error("Erreur lors de la modification du statut admin");
    },
  });

  const handleToggle = async () => {
    await toggleUserAdminStatus({
      variables: { userId: user.id },
    });
  };

  return (
    <label className={classes["admin-switch"]}>
      <input
        type="checkbox"
        className={classes["admin-switch__input"]}
        checked={user.isAdmin}
        onChange={handleToggle}
        disabled={isDisabled}
        title={
          isSelf
            ? "Vous ne pouvez pas modifier votre propre statut admin."
            : undefined
        }
      />
      <span className={classes["admin-switch__slider"]} />
    </label>
  );
}
