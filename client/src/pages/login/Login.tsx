import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { LOGIN } from "../../graphql/operations";
import { saveToken, parseLoginResponse } from "../../services/authService";

import Header from "../../layout/header/Header";
import { useMode } from "../../context/modeContext";
import classes from "./Login.module.scss";
import FormLayout from "../../layout/form-layout/FormLayout";
import FormContent from "../../layout/form-content/FormContent";
import CarbonCalculator from "../../components/CarbonCalculator/CarbonCalculator";
import Footer from "../../layout/footer/Footer";

type LoginResponse = {
  login: string;
};

export default function Login() {
  const { mode } = useMode();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  const [loginMutation, { loading }] = useMutation(LOGIN);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      const result = await loginMutation({
        variables: {
          data: { email, password }
        }
      });
      
      console.log("Login successful:", result.data);
      
      const { token } = parseLoginResponse((result.data as LoginResponse).login);
      
      saveToken(token);
      
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Extract more specific error message
      let errorMessage = "Login failed. Please check your credentials and try again.";
      
      if (error?.graphQLErrors?.length > 0) {
        errorMessage = error.graphQLErrors[0].message;
      } else if (error?.networkError) {
        errorMessage = "Network error. Please check your connection.";
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
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
            {error && <div className={`${classes["login__error"]} ${classes[`login__error--${mode}`]}`}>{error}</div>}
            
            <div className={classes["login__field"]}>
              <label className={`${classes["login__label"]} ${classes[`login__label--${mode}`]}`}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${classes["login__input"]} ${classes[`login__input--${mode}`]}`}
                required
              />
            </div>
            
            <div className={classes["login__field"]}>
              <label className={`${classes["login__label"]} ${classes[`login__label--${mode}`]}`}>
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${classes["login__input"]} ${classes[`login__input--${mode}`]}`}
                required
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className={`${classes["login__button"]} ${classes[`login__button--${mode}`]}`}
            >
              {loading ? "Connexion..." : "Connexion"}
            </button>
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
