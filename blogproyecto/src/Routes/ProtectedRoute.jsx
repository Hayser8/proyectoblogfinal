import { Route, Redirect } from 'react-router-dom';
import { isAuthenticated } from '../auth'; 
import PropTypes from 'prop-types';

const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

ProtectedRoute.propTypes = {
  component: PropTypes.elementType.isRequired,  
};

export default ProtectedRoute;
