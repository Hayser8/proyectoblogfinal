import { useNavigate } from 'react-router-dom';

const AdminEntry = () => {
  const navigate = useNavigate();

  const handleLogin = () => navigate('/admin/login');
  const handleSignIn = () => navigate('/admin/signin');

  const buttonStyle = {
    padding: "1rem",
    color: "#fff",
    backgroundColor: "#3aafa9",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.2s",
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

  return (
    <div style={formStyle}>
      <h2>Inicia sesión o Registrate!</h2>
      <button style={{...buttonStyle, margin: "2px"}} onClick={handleLogin}>Iniciar Sesión</button>
      <button style={{...buttonStyle, margin: "2px", backgroundColor: "#2b7a78"}} onClick={handleSignIn}>Registrarse</button>
    </div>
  );
};

export default AdminEntry;
