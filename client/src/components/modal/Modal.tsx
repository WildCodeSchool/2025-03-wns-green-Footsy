import { X } from "lucide-react";
import classes from "./Modal.module.scss";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className={classes.modal__overlay}>
      <button
        type="button"
        className={classes.modal__backdrop}
        onClick={onClose}
        aria-label="Fermer la modale"
      />
      <div className={classes.modal__content}>
        <div className={classes.modal__header}>
          <h2 id="modal-title" className={classes.modal__title}>
            {title}
          </h2>
          <button
            className={classes.modal__closeBtn}
            onClick={onClose}
            aria-label="Fermer"
            type="button"
          >
            <X size={24} />
          </button>
        </div>
        <div className={classes.modal__body}>{children}</div>
      </div>
    </div>
  );
}
