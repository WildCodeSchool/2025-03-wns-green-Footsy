import { Link } from "react-router-dom";

import FormHeader from "../../layout/form-header/FormHeader";
import SignUpForm from "../../components/signUpForm/SignUpForm";

import { useMode } from "../../context/modeContext";

import AuthLayout from "../../layout/auth-layout/AuthLayout";
import Footer from "../../layout/footer/Footer";
import FormHeader from "../../layout/form-header/FormHeader";
import FormLayout from "../../layout/form-layout/FormLayout";

import classes from "./SignUp.module.scss";

export default function SignUp() {
  const { mode } = useMode();

  return (
    <FormLayout>
      {<FormHeader title="Inscription" />}
      <AuthLayout showImageOnMobile={true}>
        <div className={classes["sign-up__container"]}>
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
        </div>
      </AuthLayout>
      <Footer />
    </FormLayout>
  );
}
