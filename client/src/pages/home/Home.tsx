import { Link } from "react-router-dom";

import classes from "./Home.module.scss";

import logo from "../../assets/img/logos_icons/logo.png";

export default function Home() {
  return (
    <section className={`${classes["home"]} ${classes["home--light"]}`}>
      {/* Header with Logo */}
      <header className={classes["home__header"]}>
        <div className={classes["home__header__content"]}>
          <img
            src={logo}
            alt="Footsy"
            className={classes["home__header__logo"]}
          />
          <p className={`${classes["home__header__tagline"]} ${classes["home__header__tagline--light"]}`}>
            Green It Yourself
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className={classes["home__content"]}>
        <div className={classes["home__actions"]}>
          <Link to="/signup" className={classes["home__actions__link"]}>
            <button className={`${classes["home__button"]} ${classes["home__button--light"]}`}>
              Commencer
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
