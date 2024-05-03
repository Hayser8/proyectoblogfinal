import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://18.220.89.49:3000/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        throw new Error("Inicio de sesión fallido");
      }
      const data = await response.json();
      if (data.token) {
        login(data.token);
        navigate("/admin/dashboard");
      } else {
        alert("Error al iniciar sesión: Token no recibido");
      }
    } catch (error) {
      alert("Error al iniciar sesión: " + error.message);
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

  const inputStyle = {
    padding: "0.8rem",
    marginBottom: "1rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  return (
    <div style={formStyle}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label style={labelStyle}>Username:  </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          style={inputStyle}
        />
        <br></br>
        <label style={labelStyle}>Password:   </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={inputStyle}
        />
        <br></br>
        <button type="submit" style={buttonStyle}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
