import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";
import type { ActivityFormData } from "../../services/activityForm.services";
import {
  activityFormFields,
  handleActivityChange,
  handleActivitySubmit,
} from "../../services/activityForm.services";
import FormField from "../formField/FormField";
import classes from "./ActivityForm.module.scss";
import { useMode } from "../../context/modeContext";
import MainButton from "../mainButton/MainButton";
import { Loader } from "../loader/Loader";
import {
  CREATE_ACTIVITY,
  UPDATE_ACTIVITY,
  GET_ALL_CATEGORIES,
  GET_ALL_TYPES,
  GET_ACTIVITIES_BY_USER_ID,
  type GetAllTypes,
  type GetAllCategoriesData,
} from "../../graphql/operations";
import { useCurrentUser } from "../../context/userContext";
import type { Activity, Type } from "../../types/Activity.types";
import { toISODateString } from "../../utils/dateUtils";
import editIcon from "../../assets/img/logos_icons/edit.png";

interface ActivityFormProps {
  activityToEdit?: Activity;
  onSuccess?: () => void;
}

export default function ActivityForm({
  activityToEdit,
  onSuccess,
}: ActivityFormProps) {
  const navigate = useNavigate();
  const { mode } = useMode();
  const { user } = useCurrentUser();

  const isEditMode = !!activityToEdit;

  const [formData, setFormData] = useState<ActivityFormData>({
    id: activityToEdit?.id,
    title: activityToEdit?.title || "",
    date: toISODateString(activityToEdit?.date) || "",
    category_id: activityToEdit?.type.category.id || 0,
    type_id: activityToEdit?.type.id || 0,
    quantity: activityToEdit?.quantity || 0,
    co2_equivalent: activityToEdit?.co2_equivalent || 0,
    user_id: user?.id ?? 0,
  });

  const [typesByCategorySelected, setTypesByCategorySelected] = useState<
    Array<Type>
  >([]);

  const [quantityDisplay, setQuantityDisplay] = useState(
    activityToEdit
      ? `${activityToEdit.quantity} ${activityToEdit.type.category.quantity_unit}`
      : "",
  );

  const [isEditingCO2, setIsEditingCO2] = useState(false);

  const [manualCO2, setManualCO2] = useState<number | null>(null);

  const { data: categoriesData } =
    useQuery<GetAllCategoriesData>(GET_ALL_CATEGORIES);

  const {
    data: typesData,
    loading: typesLoading,
    error: typesError,
  } = useQuery<GetAllTypes>(GET_ALL_TYPES);

  const refetchQueries = user
    ? [{ query: GET_ACTIVITIES_BY_USER_ID, variables: { userId: user.id } }]
    : [];

  const [createActivity, { loading: createLoading, error: createError }] =
    useMutation(CREATE_ACTIVITY, { refetchQueries });
  const [updateActivity, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_ACTIVITY, { refetchQueries });

  const submitLoading = createLoading || updateLoading;
  const error = createError || updateError;

  const categories = categoriesData?.getAllCategories;

  const types = typesData?.getAllTypes;

  const selectedType =
    types?.find((t) => t.id === formData.type_id) ??
    typesByCategorySelected.find((t) => t.id === formData.type_id);

  useEffect(() => {
    setTypesByCategorySelected(
      types?.filter((type) => type.category.id === formData.category_id) ?? [],
    );
  }, [types, formData.category_id]);

  useEffect(() => {
    if (selectedType) {
      const newQuantityDisplay = `${formData.quantity} ${selectedType.category.quantity_unit}`;
      setQuantityDisplay(newQuantityDisplay);
      setManualCO2(null);
    }
  }, [selectedType, formData.quantity]);

  // Calcul automatique du CO2
  useEffect(() => {
    if (selectedType && formData.quantity > 0) {
      const calculatedCO2 = selectedType.ecv * formData.quantity;
      setFormData((prev) => ({
        ...prev,
        co2_equivalent: parseFloat(calculatedCO2.toFixed(2)),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        co2_equivalent: 0,
      }));
    }

    if (isEditingCO2) return;
  }, [selectedType, formData.quantity, isEditingCO2]);

  if (typesError) {
    return (
      <div className={classes.activity__error}>
        <p>
          Impossible de charger les types d'activités. Veuillez rafraîchir la
          page.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={async (event) => {
        const mutation = isEditMode ? updateActivity : createActivity;
        const result = await handleActivitySubmit(
          event,
          formData,
          user,
          mutation,
          isEditMode,
        );
        if (result === "success") {
          if (onSuccess) {
            onSuccess();
          } else {
            navigate("/history");
          }
        }
      }}
      className={classes.activity__form}
    >
      {activityFormFields.map((field) => (
        <div key={field.id} className={classes.activity__field}>
          {field.id === "quantity" ? (
            <FormField
              label={field.label}
              type="text"
              id={field.id}
              name={field.id}
              value={quantityDisplay}
              onChange={(event) => {
                const raw = event.target.value.replace(/[^0-9.]/g, "");
                const unit = selectedType?.category.quantity_unit ?? "";
                setQuantityDisplay(raw ? `${raw} ${unit}` : "");
                setFormData((prev) => ({ ...prev, quantity: Number(raw) }));
              }}
              placeholder={
                selectedType
                  ? `0 ${selectedType.category.quantity_unit}`
                  : field.placeholder
              }
            />
          ) : (
            <FormField
              label={field.label}
              type={field.type}
              id={field.id}
              name={field.id}
              value={String(formData[field.id as keyof ActivityFormData] ?? "")}
              onChange={(event) =>
                handleActivityChange(event, formData, setFormData)
              }
              placeholder={field.placeholder}
              options={
                field.type === "select" && field.id === "category_id"
                  ? categories
                  : field.type === "select" && field.id === "type_id"
                    ? typesByCategorySelected
                    : undefined
              }
            />
          )}
          {field.id === "quantity" && formData.co2_equivalent > 0 && (
            <div className={classes.activity__co2}>
              <h3>
                Émissions :
                {isEditingCO2 ? (
                  <>
                    <input
                      type="number"
                      value={
                        manualCO2 !== null ? manualCO2 : formData.co2_equivalent
                      }
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setManualCO2(val);
                        setFormData((prev) => ({
                          ...prev,
                          co2_equivalent: val,
                        }));
                      }}
                      step="0.01"
                      min="0"
                    />
                    <button
                      type="button"
                      className={classes.activity__co2Button}
                      onClick={() => setIsEditingCO2((prev) => !prev)}
                    >
                      ✓
                    </button>
                  </>
                ) : (
                  <>
                    <strong>
                      {manualCO2 !== null && !isEditingCO2
                        ? `${manualCO2} kg CO₂`
                        : `${formData.co2_equivalent} kg CO₂`}
                    </strong>
                    <button
                      type="button"
                      className={classes.activity__co2Button}
                      onClick={() => setIsEditingCO2((prev) => !prev)}
                    >
                      <img
                        src={editIcon}
                        alt="Modifier l'équivalent CO₂"
                        className={classes["avatar-selector__edit-icon-image"]}
                      />
                    </button>
                  </>
                )}
              </h3>
            </div>
          )}
        </div>
      ))}

      {error && (
        <p className={classes.activity__error}>
          Une erreur est survenue lors de l'ajout de l'activité. Veuillez
          réessayer.
        </p>
      )}

      <div className={classes.activity__submit}>
        <MainButton
          type="submit"
          content={
            submitLoading || typesLoading ? (
              <Loader />
            ) : isEditMode ? (
              "Modifier"
            ) : (
              "Ajouter"
            )
          }
          mode={mode}
          disabled={submitLoading || typesLoading}
        />
      </div>
    </form>
  );
}
