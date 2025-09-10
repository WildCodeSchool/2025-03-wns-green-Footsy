import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, saveToken, parseLoginResponse } from "../../services/authService";

// TODO: Implement styles

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const result = await login(email, password);
      console.log("Login successful:", result);
      
      const { token } = parseLoginResponse(result);
      
      saveToken(token);
      
      navigate("/dashboard");
    } catch (error) {
      setError("Login failed. Please check your credentials and try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <section className="">
      <div
        className=""
      >
        <h1 className="">
          Bienvenue !
        </h1>

        <h2 className="">
          Qu'est-ce que footsy ?
        </h2>
        <p className="">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eu turpis ut metus luctus fringilla. Integer ac elit ut nisl volutpat tempus pretium ut metus.
        </p>
        <h2 className="">
          Se connecter
        </h2>

        <form onSubmit={handleSubmit}>
          {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button type="submit" disabled={loading}>
            {loading ? "Connexion..." : "Connexion"}
          </button>
        </form>

        <div className="">
          <Link
            to="/signup"
            className=""
          >
            Vous n'avez pas de compte ? Inscrivez-vous ici !      
          </Link>
        </div>
      </div>
    </section>
  );
}
