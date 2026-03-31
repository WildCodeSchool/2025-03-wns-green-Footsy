import { Link } from "react-router-dom";
import { useMode } from "../../context/modeContext";

import classes from "./CGU.module.scss";

import CGUDetails from "../../components/cguDetails/CguDetails";
import Footer from "../../layout/footer/Footer";
import FormHeader from "../../layout/form-header/FormHeader";
import FormLayout from "../../layout/form-content/FormContent";
import FormContent from '../../layout/form-content/FormContent';
import MainButton from "../../components/mainButton/MainButton";

export default function SignUp() {
    const { mode } = useMode();
    return (
        <FormLayout>
            {<FormHeader title="Conditions Générales d'Utilisation
& Politique de Confidentialité" />}
            <div className={`${classes.cgu}`}>
                <FormContent>
                    <h2 className={`${classes.cgu__title} ${classes[`cgu__title--${mode}`]
                        }`}>Conditions Générales d'Utilisation
                        & Politique de Confidentialité</h2>
                    <Link to="/" className={classes.cgu__actions__link}>
                        <MainButton
                            type="button"
                            mode={mode}
                            content="Retour"
                            accent={false}
                        />
                    </Link>
                    <CGUDetails />
                    <Link to="/" className={classes.cgu__actions__link}>
                        <MainButton
                            type="button"
                            mode={mode}
                            content="Retour"
                            accent={false}
                        />
                    </Link>
                </FormContent>
            </div>
            <Footer />
        </FormLayout>
    );
}
