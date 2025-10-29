import { Link } from "react-router-dom";
import { useMode } from "../../context/modeContext";
import classes from "./Footer.module.scss";

export default function Footer() {
    const { mode } = useMode();
     return (
    <section className={classes["footer"]}>
      <Link
        to="/credits"
        className={`${classes["footer__link"]} ${
          classes[`footer__link--${mode}`]
        }`}
      >
        Crédits
      </Link>
      <Link
        to="/CGU"
        className={`${classes["footer__link"]} ${
          classes[`footer__link--${mode}`]
        }`}
      >
        CGU
      </Link>
    </section>
  ); 
}
