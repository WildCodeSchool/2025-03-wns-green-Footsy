import classes from "./MainButton.module.scss";

interface MainButtonProps {
  mode: "light" | "dark";
  accent?: boolean;
  content: string | React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit";
}

export default function MainButton({
  mode,
  accent = false,
  content,
  onClick,
  type = "button",
}: MainButtonProps) {
  return (
    <button
      type={type}
      className={`${classes.button} ${
        classes[`button-${mode}${accent === true ? "-accent" : ""}`]
      }`}
      onClick={onClick}
    >
      {content}
    </button>
  );
}
