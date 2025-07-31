import classes from "./MainButton.module.scss";

interface MainButtonProps {
  mode: "light" | "dark";
  accent?: boolean;
  content: string;
}

export default function MainButton({
  mode,
  accent = false,
  content,
}: MainButtonProps) {
  return (
    <button
      type="button"
      className={`${classes.button} ${
        classes[`button-${mode}${accent === true ? "-accent" : ""}`]
      }`}
    >
      {content}
    </button>
  );
}
