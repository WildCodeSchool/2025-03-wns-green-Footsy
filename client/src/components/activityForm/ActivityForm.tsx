import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from "@apollo/client/react";
import type { ActivityFormData } from '../../services/activityForm.services';
import { activityFormFields, handleActivityChange, handleActivitySubmit } from '../../services/activityForm.services';
import FormField from '../formField/FormField';
import classes from './ActivityForm.module.scss';
import { useMode } from '../../context/modeContext';
import MainButton from '../mainButton/MainButton';
import { Loader } from '../loader/Loader';
import { CREATE_ACTIVITY, GET_ACTIVITY_TYPES } from '../../graphql/operations';
import type { GetActivityTypesData } from '../../types/ActivityType';
import { mockCarbonActivities } from '../../__tests__/mockCarbonActivities';
import { useCurrentUser } from '../../context/userContext';


// Flag pour activer/désactiver le mock
const USE_MOCK_DATA = true; // Mettre à false quand l'API sera prête

export default function ActivityForm() {
    const navigate = useNavigate();
    const { mode } = useMode();

    // Query GraphQL (seulement si on n'utilise pas le mock)
     const { data: apiTypesData, loading: apiTypesLoading }  = useQuery<GetActivityTypesData>(
        GET_ACTIVITY_TYPES,
        { skip : USE_MOCK_DATA} // Skip la query si on utilise le mock
    );

    // Données à utiliser (mock ou API)
    const typesData = USE_MOCK_DATA 
        ? { getActivityTypes: mockCarbonActivities }
        : apiTypesData;
    
    const typesLoading = USE_MOCK_DATA ? false : apiTypesLoading;


    const [formData, setFormData] = useState<ActivityFormData>({
        title: '',
        date: '',
        type_id: 0,
        quantity: 0,
        co2_equivalent: 0,
        user_id: 0,
    });

    const [createActivity, { loading: submitLoading, error }] = useMutation(CREATE_ACTIVITY);

    const {user} = useCurrentUser();

    return (
        <form
            onSubmit={async (event) => {
                const result = await handleActivitySubmit(event, formData, user, createActivity);
                if (result === "success") {
                    navigate("/history");
                }
            }}
            className={classes.activity__form}
        >
            {activityFormFields.map((field) => (
                <div key={field.id} className={classes.activity__field}>
                    <FormField
                        label={field.label}
                        type={field.type}
                        id={field.id}
                        name={field.id}
                        value={String(formData[field.id as keyof ActivityFormData] ?? '')}
                        onChange={(event) => handleActivityChange(event, formData, setFormData)}
                        placeholder={field.placeholder}
                        options={field.type === 'select' ? typesData?.getActivityTypes : undefined}
                    />
                </div>
            ))}

            {error && (
                <p className={classes.activity__error}>
                    Une erreur est survenue lors de l'ajout de l'activité. Veuillez réessayer.
                </p>
            )}

            <div className={classes.activity__submit}>
                <MainButton
                    type="submit"
                    content={submitLoading || typesLoading ? <Loader /> : "Ajouter"}
                    mode={mode}
                    disabled={submitLoading || typesLoading}
                />
            </div>
        </form>
    )
}