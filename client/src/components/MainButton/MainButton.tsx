interface MainButtonProps {
  mode: "light" | "dark" | "accent";
  content: string;
}

export default function MainButton({ mode, content }: MainButtonProps) {
  return (
    <button type="button" className={`button-${mode}`}>
      {content}
    </button>
  );
}
