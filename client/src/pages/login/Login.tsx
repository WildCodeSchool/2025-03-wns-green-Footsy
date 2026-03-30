import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";

import MainButton from "../../components/mainButton/MainButton";

import { useMode } from "../../context/modeContext";
import { useCurrentUser } from "../../context/userContext";
import { LOGIN } from "../../graphql/operations";

import AuthLayout from "../../layout/auth-layout/AuthLayout";
import Footer from "../../layout/footer/Footer";
import FormLayout from "../../layout/form-layout/FormLayout";
import FormHeader from "../../layout/form-header/FormHeader";

import classes from "./Login.module.scss";

const loginFormSchema = z.object({
  email: z.string().trim().email("Veuillez saisir une adresse e-mail valide."),
  password: z.string().min(1, "Le mot de passe est requis."),
});

export default function Login() {
  const { mode } = useMode();
  const { refetch } = useCurrentUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [loginMutation, { loading }] = useMutation(LOGIN);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedForm = loginFormSchema.safeParse({ email, password });
    if (!parsedForm.success) {
      toast.error(parsedForm.error.issues[0]?.message ?? "Formulaire invalide.");
      return;
    }

    try {
      const result = await loginMutation({
        variables: {
          data: { email, password },
        },
      });

      if (result.data) {
        toast.success("Connexion réussie !");
        if (refetch) {
          await refetch();
        }
        navigate("/dashboard");
      }
    } catch (error: unknown) {
      console.error("Login error:", error);

      let errorMessage =
        "Échec de la connexion. Veuillez vérifier vos identifiants et réessayer.";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    }
  };

  return (
    <FormLayout>
      {<FormHeader title="Connexion" />}
      <AuthLayout showImageOnMobile={true}>
        <h2
          className={`${classes.login__title} ${
            classes[`login__title--${mode}`]
          }`}
        >
          Connexion
        </h2>

        <form onSubmit={handleSubmit} className={classes.login__form}>
          <div className={classes.login__field}>
            <label
              htmlFor="email"
              className={`${classes.login__label} ${
                classes[`login__label--${mode}`]
              }`}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${classes.login__input} ${
                classes[`login__input--${mode}`]
              }`}
              required
            />
          </div>

          <div className={classes.login__field}>
            <label
              htmlFor="password"
              className={`${classes.login__label} ${
                classes[`login__label--${mode}`]
              }`}
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${classes.login__input} ${
                classes[`login__input--${mode}`]
              }`}
              required
            />
          </div>

          <MainButton
            type="submit"
            mode={mode}
            content={loading ? "Connexion..." : "Connexion"}
          />
        </form>

        <Link
          to="/signup"
          className={`${classes.login__link} ${
            classes[`login__link--${mode}`]
          }`}
        >
          Vous n'avez pas de compte ? Inscrivez-vous ici !
        </Link>
      </AuthLayout>
      <Footer />
    </FormLayout>
  );
}
