import ActivityForm from '../../components/activityForm/ActivityForm';
import { useMode } from '../../context/modeContext';
import Footer from '../../layout/footer/Footer';
import FormContent from '../../layout/form-content/FormContent';
import FormHeader from '../../layout/form-header/FormHeader';
import FormLayout from '../../layout/form-layout/FormLayout';
import NavBar from '../../layout/navbar/NavBar';
import classes from './Activity.module.scss';

export default function Activity() {
    const { mode } = useMode();
    return (
        <FormLayout>
            {<FormHeader title="Ajouter une activité" />}
            <div className={`${classes.activity}`}>
            <FormContent>
                <h2 className={`${classes.activity__title} ${classes[`activity__title--${mode}`]
                    }`}>Ajouter une activité</h2>
                <ActivityForm />
            </FormContent>
            </div>
            <NavBar />
            <Footer />
        </FormLayout>
    );
}