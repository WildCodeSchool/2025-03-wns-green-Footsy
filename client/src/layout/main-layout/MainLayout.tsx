import type { ReactNode } from 'react';
import { useMode } from "../../context/modeContext";
import classes from "./MainLayout.module.scss";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { mode } = useMode();

  return (
    <section className={`${classes["main-layout"]} ${classes[`main-layout--${mode}`]}`}>
        {children}
    </section>
  );
}