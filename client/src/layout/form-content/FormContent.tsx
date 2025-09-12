import type { ReactNode } from 'react';
import { useMode } from "../../context/modeContext";
import classes from "./FormContent.module.scss";

interface FormLayoutProps {
  children: ReactNode;
}

export default function FormLayout({ children }: FormLayoutProps) {
  const { mode } = useMode();

  return (
    <section className={`${classes["form-content"]} ${classes[`form-content--${mode}`]}`}>
        {children}
    </section>
  );
}