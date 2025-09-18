import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { LOGIN } from "../../graphql/operations";
import { saveToken, parseLoginResponse } from "../../services/authService";

import Header from "../../layout/header/Header";
import { useMode } from "../../context/modeContext";
import classes from "./Login.module.scss";
import FormLayout from "../../layout/form-layout/FormLayout";
import FormContent from "../../layout/form-content/FormContent";
import CarbonCalculator from "../../components/CarbonCalculator/CarbonCalculator";

type LoginResponse = {
  login: string;
};

export default function Login() {
  const { mode } = useMode();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const apolloClient = new ApolloClient({
    link: new HttpLink({
      uri: import.meta.env.VITE_URL_GRAPHQL || "http://localhost:5050/graphql",
    }),
    cache: new InMemoryCache(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const result = await apolloClient.mutate({
        mutation: LOGIN,
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
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <FormLayout>
      <Header children={"Connexion"} />
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
            
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${classes["login__input"]} ${classes[`login__input--${mode}`]}`}
              required
            />
            
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${classes["login__input"]} ${classes[`login__input--${mode}`]}`}
              required
            />
            
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
    </FormLayout>
  );
}
