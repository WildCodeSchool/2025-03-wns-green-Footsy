import classes from "./MainButton.module.scss";

interface MainButtonProps {
  mode: "light" | "dark";
  accent?: boolean;
  content: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function MainButton({
  mode,
  accent = false,
  content,
  onClick,
}: MainButtonProps) {
  return (
    <button
      type="button"
      className={`${classes.button} ${
        classes[`button-${mode}${accent === true ? "-accent" : ""}`]
      }`}
      onClick={onClick}
    >
      {content}
    </button>
  );
}
