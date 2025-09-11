import { Link } from "react-router-dom";

import { useMode } from "../../context/modeContext";

import classes from "./Home.module.scss";

import logo from "../../assets/img/logos_icons/logo.png";
import logoDark from "../../assets/img/logos_icons/logo_dark.png";

export default function Home() {
  const { mode } = useMode();
  const logoSrc = mode === "dark" ? logoDark : logo;

  return (
    <section className={`${classes["home"]} ${classes[`home--${mode}`]}`}>
      {/* Header with Logo */}
      <header className={classes["home__header"]}>
        <div className={classes["home__header__content"]}>
          <img
            src={logoSrc}
            alt="Footsy"
            className={classes["home__header__logo"]}
          />
          <p className={`${classes["home__header__tagline"]} ${classes[`home__header__tagline--${mode}`]}`}>
            Green It Yourself
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className={classes["home__content"]}>
        <div className={classes["home__actions"]}>
          <Link to="/signup" className={classes["home__actions__link"]}>
            <button className={`${classes["home__button"]} ${classes[`home__button--${mode}`]}`}>
              Commencer
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
