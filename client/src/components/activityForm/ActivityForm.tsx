import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from "@apollo/client/react";
import type { ActivityFormData } from '../../services/activityForm.services';
import { activityFormFields, handleActivityChange, handleActivitySubmit } from '../../services/activityForm.services';
import FormField from '../formField/FormField';
import classes from './ActivityForm.module.scss';
import { useMode } from '../../context/modeContext';
import MainButton from '../mainButton/MainButton';
import { Loader } from '../loader/Loader';
import { CREATE_ACTIVITY, GET_ALL_CATEGORIES, GET_ALL_TYPES, type GetAllTypes, type GetAllCategoriesData } from '../../graphql/operations';
import { useCurrentUser } from '../../context/userContext';
import type { Type } from '../../types/Activity.types';

export default function ActivityForm() {
    const navigate = useNavigate();
    const { mode } = useMode();
    const { user } = useCurrentUser();

    const [formData, setFormData] = useState<ActivityFormData>({
        title: '',
        date: '',
        category_id: 0,
        type_id: 0,
        quantity: 0,
        co2_equivalent: 0,
        user_id: user?.id ?? 0,
    });

    const [typesByCategorySelected, setTypesByCategorySelected] = useState<Array<Type>>([]);

    const { data: categoriesData } = useQuery<GetAllCategoriesData>(GET_ALL_CATEGORIES);

    const { data: typesData, loading: typesLoading, error: typesError } = useQuery<GetAllTypes>(
        GET_ALL_TYPES,
    );

    const [createActivity, { loading: submitLoading, error }] = useMutation(CREATE_ACTIVITY);

    const categories = categoriesData?.getAllCategories;

    const types = typesData?.getAllTypes;

    const selectedType = types?.find((t) => t.id === formData.type_id) ?? typesByCategorySelected.find((t) => t.id === formData.type_id);

    useEffect(() => {
        setTypesByCategorySelected(types?.filter((type) => type.category_id === formData.category_id) ?? []);
    }, [types, formData.category_id])

    if (typesError) {
        return (
            <div className={classes.activity__error}>
                <p>Impossible de charger les types d'activités. Veuillez rafraîchir la page.</p>
            </div>
        );
    }

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
                        options={
                            field.type === 'select' && field.id === 'category_id'
                                ? categories
                                : field.type === 'select' && field.id === 'type_id'
                                    ? typesByCategorySelected
                                    : undefined
                        }
                    />
                    {field.id === 'quantity' && (
                        <p className={classes.activity__unit}>{selectedType?.quantity_unit ?? ''}</p>
                    )}
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