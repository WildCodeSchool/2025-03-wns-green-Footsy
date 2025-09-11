import { Link } from "react-router-dom";
import { useMode } from "../../context/modeContext";
import classes from "./NavBar.module.scss";

export default function NavBar() {
  const { mode } = useMode();
  return <nav className="nav-bar">
    <h1 className={`${classes["nav-bar__title"]} ${classes[`nav-bar__title--${mode}`]}`}>This is the navbar</h1>

    <Link
      to="/credits"
      className={`${classes["nav-bar__Link"]} ${classes[`nav-bar__Link--${mode}`]
        }`}
    >
      dashboard
    </Link>
    <Link
      to="/credits"
      className={`${classes["nav-bar__Link"]} ${classes[`nav-bar__Link--${mode}`]
        }`}
    >
      history
    </Link>
    <Link
      to="/credits"
      className={`${classes["nav-bar__Link"]} ${classes[`nav-bar__Link--${mode}`]
        }`}
    >
      add
    </Link>
    <Link
      to="/credits"
      className={`${classes["nav-bar__Link"]} ${classes[`nav-bar__Link--${mode}`]
        }`}
    >
      community
    </Link>
    <Link
      to="/credits"
      className={`${classes["nav-bar__Link"]} ${classes[`nav-bar__Link--${mode}`]
        }`}
    >
      informations
    </Link>
  </nav>;
}