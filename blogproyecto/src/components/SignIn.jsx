import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

const SignIn = ({ onSignInSuccess }) => {
  const [step, setStep] = useState("SECRET");
  const [secretPassword, setSecretPassword] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const ADMIN_SECRET = "LaContraseñaSecreta";

  const handleSecretSubmit = (e) => {
    e.preventDefault();
    if (secretPassword === ADMIN_SECRET) {
      setStep("REGISTER");
    } else {
      alert("Contraseña secreta incorrecta.");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://18.220.89.49:3000/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        throw new Error("Error en el registro");
      }
      const data = await response.json();
      localStorage.setItem("auth-token", data.token); 
      onSignInSuccess(data.token);
      navigate("/admin/dashboard");
    } catch (error) {
      console.error(error);
      alert("Error en el registro: " + error.message);
    }
  };

  const formStyle = {
    padding: "2rem",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
    maxWidth: "400px",
    margin: "2rem auto",
    display: "flex",
    flexDirection: "column",
  };
  
  const inputStyle = {
    padding: "0.8rem",
    marginBottom: "1rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };
  
  const buttonStyle = {
    padding: "1rem",
    color: "#fff",
    backgroundColor: "#3aafa9",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  };
  
  const labelStyle = {
    marginBottom: "0.5rem",
    fontWeight: "bold",
  };

  return (
    <div>
      {step === "SECRET" && (
        <div style={formStyle}>
          <h2>Acceso de Administrador</h2>
          <form onSubmit={handleSecretSubmit}>
            <input
              type="password"
              value={secretPassword}
              onChange={(e) => setSecretPassword(e.target.value)}
              placeholder="Ingrese contraseña secreta"
              required
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>Verificar</button>
          </form>
        </div>
      )}

      {step === "REGISTER" && (
        <div style={formStyle}>
          <h2>Registro de Administrador</h2>
          <form onSubmit={handleRegisterSubmit}>
            <label style={labelStyle}>Nombre de usuario:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nombre de usuario"
              required
              style={inputStyle}
            />
            <label style={labelStyle}>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
              style={inputStyle}
            />
            <br></br>
            <button type="submit" style={buttonStyle}>Registrarse</button>
          </form>
        </div>
      )}
    </div>
  );
};

SignIn.propTypes = {
  onSignInSuccess: PropTypes.func.isRequired,  
};

export default SignIn;
