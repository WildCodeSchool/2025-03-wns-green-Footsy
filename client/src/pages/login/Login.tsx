import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { toast } from "react-toastify";

import CarbonCalculator from "../../components/CarbonCalculator/CarbonCalculator";
import { useMode } from "../../context/modeContext";
import { LOGIN } from "../../graphql/operations";
import Header from "../../layout/header/Header";
import Footer from "../../layout/footer/Footer";
import FormContent from "../../layout/form-content/FormContent";
import FormLayout from "../../layout/form-layout/FormLayout";
import { saveToken, parseLoginResponse } from "../../services/authService";
import classes from "./Login.module.scss";
import MainButton from "../../components/mainButton/MainButton";

type LoginResponse = {
  login: string;
};

export default function Login() {
  const { mode } = useMode();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  
  const [loginMutation, { loading }] = useMutation(LOGIN);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await loginMutation({
        variables: {
          data: { email, password }
        }
      });
      
      const { token } = parseLoginResponse((result.data as LoginResponse).login);
      
      saveToken(token);
      
      toast.success("Connexion réussie !");
      
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Extract more specific error message
      let errorMessage = "Échec de la connexion. Veuillez vérifier vos identifiants et réessayer.";
      
      if (error?.graphQLErrors?.length > 0) {
        errorMessage = error.graphQLErrors[0].message;
      } else if (error?.networkError) {
        errorMessage = "Erreur réseau. Veuillez vérifier votre connexion.";
      }
      
      toast.error(errorMessage);
    }
  };
  

  return (
    <FormLayout>
      <Header>Connexion</Header>
      <div className={classes["login__container"]}>
        <CarbonCalculator />
        
        <FormContent>
          <h2
            className={`${classes["login__title"]} ${classes[`login__title--${mode}`]}`}
          >
            Connexion
          </h2>

          <form onSubmit={handleSubmit} className={classes["login__form"]}>
            <div className={classes["login__field"]}>
              <label 
                htmlFor="email"
                className={`${classes["login__label"]} ${classes[`login__label--${mode}`]}`}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${classes["login__input"]} ${classes[`login__input--${mode}`]}`}
                required
              />
            </div>
            
            <div className={classes["login__field"]}>
              <label 
                htmlFor="password"
                className={`${classes["login__label"]} ${classes[`login__label--${mode}`]}`}
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${classes["login__input"]} ${classes[`login__input--${mode}`]}`}
                required
              />
            </div>
            
            <MainButton
              type="submit"
              mode={mode}
              content={loading ? "Connexion..." : "Connexion"}
              disabled={loading}
            />
          </form>

          <Link
            to="/signup"
            className={`${classes["login__link"]} ${classes[`login__link--${mode}`]}`}
          >
            Vous n'avez pas de compte ? Inscrivez-vous ici !
          </Link>
        </FormContent>
      </div>
      
      <Footer />
    </FormLayout>
  );
}
