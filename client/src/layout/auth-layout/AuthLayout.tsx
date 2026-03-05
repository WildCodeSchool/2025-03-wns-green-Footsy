import type { ReactNode } from "react";
import CarbonCalculator from "../../components/CarbonCalculator/CarbonCalculator";
import FormContent from "../form-content/FormContent";
import classes from "./AuthLayout.module.scss";

interface AuthLayoutProps {
  children: ReactNode;
  showImageOnMobile?: boolean;
}

export default function AuthLayout({
  children,
  showImageOnMobile = false,
}: AuthLayoutProps) {
  return (
    <div className={classes["auth-layout"]}>
      <div
        className={`${classes["auth-layout__image"]} ${
          showImageOnMobile ? classes["auth-layout__image--mobile-visible"] : ""
        }`}
      >
        <CarbonCalculator />
      </div>
      <div className={classes["auth-layout__form"]}>
        <FormContent>{children}</FormContent>
      </div>
    </div>
  );
}
