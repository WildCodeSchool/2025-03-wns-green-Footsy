import classes from "./ConfirmModal.module.scss";

interface ConfirmModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className={classes.modal__overlay}>
      <div className={classes.modal__content}>
        <p className={classes.modal__message}>{message}</p>

        <div className={classes.modal__buttons}>
          <button
            type="button"
            className={classes.modal__btn}
            onClick={onCancel}
          >
            Non
          </button>
          <button
            type="button"
            className={classes.modal__btn}
            onClick={onConfirm}
          >
            Oui
          </button>
        </div>
      </div>
    </div>
  );
}
