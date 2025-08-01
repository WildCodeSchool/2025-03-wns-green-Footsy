import { useMode } from "../../context/modeContext";

import classes from "./SignUpHeader.module.scss";

import logoIcon from "../../assets/img/logos_icons/icon.png";
import logoIconDark from "../../assets/img/logos_icons/icon_dark.png";

export default function SignUpHeader() {
  const { mode } = useMode();
  const logoIconSrc = mode === "dark" ? logoIconDark : logoIcon;

  return (
    <header className={classes["sign-up-header"]}>
      <img
        src={logoIconSrc}
        alt="Footsy"
        className={classes["sign-up-header__icon"]}
      />
      <h2
        className={`${classes["sign-up-header__title"]} ${
          classes[`sign-up-header__title--${mode}`]
        }`}
      >
        Inscription
      </h2>
    </header>
  );
}
