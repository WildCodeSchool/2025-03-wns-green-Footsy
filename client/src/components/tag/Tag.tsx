import styles from "./Tag.module.scss";

export type TagVariant =
  | "light" // sea-green
  | "dark" // dark-green
  | "warning" // yellow
  | "info"; // lawn-green

export type TagProps = {
  text: string;
  variant?: TagVariant;
};

export const Tag = ({ text, variant = "info" }: TagProps) => (
  <span className={`${styles.tag} ${styles[`tag--${variant}`]}`}>{text}</span>
);
