import { useMode } from "../../context/modeContext";

import icon from "../../assets/img/logos_icons/icon.png";
import iconDark from "../../assets/img/logos_icons/icon_dark.png";
import logo from "../../assets/img/logos_icons/logo.png";
import logoDark from "../../assets/img/logos_icons/logo_dark.png";

import type { Avatar } from "../../types/Avatar.types";

import classes from "./MainHeader.module.scss";
import { Link } from "react-router-dom";

interface HeaderProps {
  title: string;
  avatar?: Avatar;
}

export default function MainHeader({ title, avatar }: HeaderProps) {
  const { mode } = useMode();
  const iconSrc = mode === "dark" ? iconDark : icon;
  const logoSrc = mode === "dark" ? logoDark : logo;

  return (
    <header className={classes.header}>
      <Link to="/dashboard" className={classes.header__mobile_logo_link}>
      <img
        src={iconSrc}
        alt="Footsy Icon"
        className={classes.header__mobile_logo}
      />
      </Link>
      <Link to="/dashboard" className={classes.header__desktop_logo_link}>
      <img
        src={logoSrc}
        alt="Footsy Icon"
        className={classes.header__desktop_logo}
      />
      </Link>
      <h2
        className={`${classes.header__title} ${classes[`header__title--${mode}`]
          }`}
      >
        {title}
      </h2>
      {/* TO DO: mise en page de l'avatar */}
      {avatar && (
        <img
          src={avatar?.image}
          alt={avatar?.title}
          className={classes.header__avatar}
        />
      )}
    </header>
  );
}
