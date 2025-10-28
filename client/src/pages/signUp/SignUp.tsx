import { Link } from "react-router-dom";

import FormHeader from "../../layout/form-header/FormHeader";

import { useMode } from "../../context/modeContext";

import classes from "./SignUp.module.scss";
import FormLayout from "../../layout/form-layout/FormLayout";
import FormContent from "../../layout/form-content/FormContent";
import SignUpForm from "../../components/signUpForm/SignUpForm";

export default function SignUp() {
  const { mode } = useMode();

  return (
    <FormLayout>
      {<FormHeader title="Inscription" />}
      <FormContent>
        <h2
          className={`${classes["sign-up__title"]} ${classes[`sign-up__title--${mode}`]
            }`}
        >
          Inscription
        </h2>
        <SignUpForm />

        <Link
          to="/login"
          className={`${classes["sign-up__link"]} ${classes[`sign-up__link--${mode}`]
            }`}
        >
          Déjà un compte ?
        </Link>
      </FormContent>
    </FormLayout>
  );
}
