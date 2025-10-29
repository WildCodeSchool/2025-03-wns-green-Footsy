import { Link } from "react-router-dom";

import logo from "../../assets/img/logos_icons/logo.png";

import MainButton from "../../components/mainButton/MainButton";

import { useMode } from "../../context/modeContext";

import classes from "./Home.module.scss";

export default function Home() {
  const { mode } = useMode();

  return (
    <section className={`${classes.home} ${classes[`home--${mode}`]}`}>
      {/* Header with Logo */}
      <header className={classes.home__header}>
        <div className={classes.home__header__content}>
          <img src={logo} alt="Footsy" className={classes.home__header__logo} />
          <p
            className={`${classes.home__header__tagline} ${
              classes[`home__header__tagline--${mode}`]
            }`}
          >
            Green It Yourself
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className={classes.home__content}>
        <div className={classes.home__actions}>
          <Link to="/signup" className={classes.home__actions__link}>
            <MainButton
              type="button"
              mode={mode}
              content="Commencer"
              accent={false}
              className={classes["home__button-custom"]}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
