import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import Loading from "../components/Loading";
import PropTypes from 'prop-types';

function PrivateRoute({ children }) {
  const { authToken, isAdmin, isLoading } = useAuth();

  useEffect(() => {
    console.log("PrivateRoute", { authToken, isAdmin });
  }, [authToken, isAdmin]);

  if (isLoading) {
    return <Loading />; 
  }

  if (!authToken || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,  
};

export default PrivateRoute;
