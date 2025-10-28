import { Link } from "react-router-dom";

import CarbonCalculator from "../../components/CarbonCalculator/CarbonCalculator";
import SignUpForm from "../../components/signUpForm/SignUpForm";

import { useMode } from "../../context/modeContext";

import Footer from "../../layout/footer/Footer";
import FormContent from "../../layout/form-content/FormContent";
import FormLayout from "../../layout/form-layout/FormLayout";
import Header from "../../layout/header/Header";

import classes from "./SignUp.module.scss";

export default function SignUp() {
  const { mode } = useMode();

  return (
    <FormLayout>
      <Header title="Inscription" />
      <div className={classes["sign-up__container"]}>
        <CarbonCalculator />

        <FormContent>
          <h2
            className={`${classes["sign-up__title"]} ${
              classes[`sign-up__title--${mode}`]
            }`}
          >
            Inscription
          </h2>
          <SignUpForm />

          <Link
            to="/login"
            className={`${classes["sign-up__link"]} ${
              classes[`sign-up__link--${mode}`]
            }`}
          >
            Déjà un compte ?
          </Link>
        </FormContent>
      </div>

      <Footer />
    </FormLayout>
  );
}
