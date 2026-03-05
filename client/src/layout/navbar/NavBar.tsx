import { useMode } from "../../context/modeContext";

import classes from "./NavBar.module.scss";
import NavBarDesktop from "./navbardesktop/NavBarDesktop";
import NavBarMobile from "./navbarmobile/NavBarMobile";

export default function NavBar() {
  const { mode } = useMode();

  return (
    <section className={`${classes.navbar} ${classes[`navbar--${mode}`]}`}>
      <div className={classes.mobile}>
        <NavBarMobile mode={mode} />
      </div>
      <div className={classes.desktop}>
        <NavBarDesktop mode={mode} />
      </div>
    </section>
  );
}
