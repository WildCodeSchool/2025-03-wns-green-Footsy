import classes from "./ConfirmContent.module.scss";

interface ConfirmContentProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmContent({
  message,
  onConfirm,
  onCancel,
}: ConfirmContentProps) {
  return (
    <div className={classes.confirm}>
      <p className={classes.confirm__message}>{message}</p>

      <div className={classes.confirm__buttons}>
        <button
          type="button"
          className={`${classes.confirm__btn} ${classes["confirm__btn--cancel"]}`}
          onClick={onCancel}
        >
          Annuler
        </button>
        <button
          type="button"
          className={`${classes.confirm__btn} ${classes["confirm__btn--confirm"]}`}
          onClick={onConfirm}
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}
