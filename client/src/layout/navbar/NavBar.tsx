import { useNavigate } from "react-router-dom";
import { useMode } from "../../context/modeContext";

import classes from "./NavBar.module.scss";

import footprint from "../../assets/img/logos_icons/footprint.png";
import footprint_dark from "../../assets/img/logos_icons/footprint_dark.png";

export default function NavBar() {
  const navigate = useNavigate();
  const { mode } = useMode();

  const footprintIcon = mode === "dark" ? footprint_dark : footprint;

  return <nav className="navbar">
     <button
      type="button"
      onClick={() => {
        navigate("/dashboard");
      }}
      className={`${classes["navbar__button"]} ${classes[`navbar__button--${mode}`]
        }`}
    >
      dashboard
    </button>
    <button
      type="button"
      onClick={() => {
        navigate("/dashboard");
      }}
      className={`${classes["navbar__button"]} ${classes[`navbar__button--${mode}`]
        }`}
    >
      history
    </button>
    <button
      type="button"
      onClick={() => {
        navigate("/dashboard");
      }}
      className={`${classes["navbar__button"]} ${classes[`navbar__button--${mode}`]
        }`}
    >
      <img
        src={footprintIcon}
        alt="footprint"
        className={classes["navbar__img"]}
      />
    </button>
    <button
      type="button"
      onClick={() => {
        navigate("/dashboard");
      }}
      className={`${classes["navbar__button"]} ${classes[`navbar__button--${mode}`]
        }`}
    >
      community
    </button>
    <button
      type="button"
      onClick={() => {
        navigate("/dashboard");
      }}
      className={`${classes["navbar__button"]} ${classes[`navbar__button--${mode}`]
        }`}
    >
      informations
    </button>
  </nav>;
}