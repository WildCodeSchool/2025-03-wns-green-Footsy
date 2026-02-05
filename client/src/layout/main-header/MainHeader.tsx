import { useMode } from "../../context/modeContext";

import icon from "../../assets/img/logos_icons/icon.png";
import iconDark from "../../assets/img/logos_icons/icon_dark.png";
import logo from "../../assets/img/logos_icons/logo.png";
import logoDark from "../../assets/img/logos_icons/logo_dark.png";

import classes from "./MainHeader.module.scss";
import { Link } from "react-router-dom";
import { useCurrentUser } from "../../context/userContext";
import AvatarMenu from "../../components/avatar/AvatarMenu";

interface HeaderProps {
  title: string;
}

export default function MainHeader({ title }: HeaderProps) {
  const { mode } = useMode();
  const iconSrc = mode === "dark" ? iconDark : icon;
  const logoSrc = mode === "dark" ? logoDark : logo;
  const { user } = useCurrentUser();

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
        className={`${classes.header__title} ${
          classes[`header__title--${mode}`]
        }`}
      >
        {title}
      </h2>

      {<div className={classes.header__avatar}>{user && <AvatarMenu user={user} />}</div>}
    </header>
  );
}
