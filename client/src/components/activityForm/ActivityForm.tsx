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
import { CREATE_ACTIVITY, GET_ALL_CATEGORIES, GET_TYPES_BY_CATEGORY, type GetAllTypesData, type GetAllCategoriesData } from '../../graphql/operations';
import { useCurrentUser } from '../../context/userContext';

export default function ActivityForm() {
    const navigate = useNavigate();
    const { mode } = useMode();
    const { user } = useCurrentUser();

    const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);

    const [formData, setFormData] = useState<ActivityFormData>({
        title: '',
        date: '',
        category_id: 0,
        type_id: 0,
        quantity: 0,
        co2_equivalent: 0,
        user_id: user?.id ?? 0,
    });

    const { data: categoriesData } = useQuery<GetAllCategoriesData>(GET_ALL_CATEGORIES);

    const { data: typesData, loading: typesLoading, error: typesError } = useQuery<GetAllTypesData>(
        GET_TYPES_BY_CATEGORY,
        {
            variables: { categoryId: selectedCategoryId },
            skip: selectedCategoryId === 0
        }
    );

    const [createActivity, { loading: submitLoading, error }] = useMutation(CREATE_ACTIVITY);

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
                        onChange={(event) => handleActivityChange(event, formData, setFormData, field.id === 'category_id' ? setSelectedCategoryId : undefined)}
                        placeholder={field.placeholder}
                        options={
                            field.type === 'select' && field.id === 'category_id'
                                ? categoriesData?.getAllCategories
                                : field.type === 'select' && field.id === 'type_id'
                                    ? typesData?.getTypesByCategoryId
                                    : undefined
                        }
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