import { Link } from "react-router-dom";

import Header from "../../layout/header/Header";

import { useMode } from "../../context/modeContext";

import classes from "./SignUp.module.scss";
import SignUpForm from "../../components/signUpForm/SignUpForm";

export default function SignUp() {
  const { mode } = useMode();

  return (
    <section className={`${classes["sign-up"]} ${classes[`sign-up--${mode}`]}`}>
      {<Header children={"Inscription"} />}
      <div
        className={`${classes["sign-up__content"]} ${
          classes[`sign-up__content--${mode}`]
        }`}
      >
        <SignUpForm />
        <Link
          to="/login"
          className={`${classes["sign-up__content__link"]} ${
            classes[`sign-up__content__link--${mode}`]
          }`}
        >
          Déjà un compte ?
        </Link>
      </div>
    </section>
  );
}
