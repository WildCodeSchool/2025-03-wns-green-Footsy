import { Link } from "react-router-dom";

import SignUpForm from "../../components/signUpForm/SignUpForm";

import { useMode } from "../../context/modeContext";

import AuthLayout from "../../layout/auth-layout/AuthLayout";
import Footer from "../../layout/footer/Footer";
import FormLayout from "../../layout/form-layout/FormLayout";
import Header from "../../layout/header/Header";

import classes from "./SignUp.module.scss";

export default function SignUp() {
  const { mode } = useMode();

  return (
    <FormLayout>
      <Header title="Inscription" />
      <AuthLayout>
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
      </AuthLayout>

      <Footer />
    </FormLayout>
  );
}
