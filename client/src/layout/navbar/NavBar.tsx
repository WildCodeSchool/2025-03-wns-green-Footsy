import { useMode } from "../../context/modeContext";
import NavBarDesktop from "./navbardesktop/NavBarDesktop";
import NavBarMobile from "./navbarmobile/NavBarMobile";
import classes from "./NavBar.module.scss";

export default function NavBar() {
  const { mode } = useMode();

  return (
    <nav className={`${classes.navbar} ${classes[`navbar--${mode}`]}`}>
      <NavBarMobile mode={mode}/>
      <NavBarDesktop />
    </nav>
  );
}