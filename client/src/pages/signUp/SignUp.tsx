import { Link } from "react-router-dom";

import Header from "../../layout/header/Header";

import { useMode } from "../../context/modeContext";

import classes from "./SignUp.module.scss";
import FormLayout from "../../layout/form-layout/FormLayout";
import FormContent from "../../layout/form-content/FormContent";

export default function SignUp() {
  const { mode } = useMode();

  return (
    <FormLayout>
      {<Header title={"Inscription"} />}
      <FormContent>
        <h2
          className={`${classes["sign-up__title"]} ${classes[`sign-up__title--${mode}`]
            }`}
        >
          Inscription
        </h2>
        {/* <SignUpForm /> */}

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
