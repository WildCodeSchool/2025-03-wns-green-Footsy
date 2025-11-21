import styles from "./Tag.module.scss";

export type TagProps = {
  text: string;
  variant?: "primary" | "secondary";
};

export const Tag = ({ text, variant = "primary" }: TagProps) => (
  <span className={`${styles.tag} ${styles[`tag--${variant}`]}`}>{text}</span>
);
