import classes from "./MainButton.module.scss";

interface MainButtonProps {
  mode: "light" | "dark";
  accent?: boolean;
  content: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  width?: string;
  height?: string;
  fontSize?: string;
}

export default function MainButton({
  mode,
  accent = false,
  content,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  width,
  height,
  fontSize,
}: MainButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`${classes.button} ${
        classes[`button-${mode}${accent === true ? "-accent" : ""}`]
      } ${className}`}
      onClick={onClick}
      style={{ width, height, fontSize }}
    >
      {content}
    </button>
  );
}
