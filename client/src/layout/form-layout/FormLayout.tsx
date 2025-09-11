import type { ReactNode } from 'react';
import { useMode } from "../../context/modeContext";
import classes from "./FormLayout.module.scss";

interface FormLayoutProps {
  children: ReactNode;
}

export default function FormLayout({ children }: FormLayoutProps) {
  const { mode } = useMode();

  return (
    <section className={`${classes["form-layout"]} ${classes[`form-layout--${mode}`]}`}>
        {children}
    </section>
  );
}