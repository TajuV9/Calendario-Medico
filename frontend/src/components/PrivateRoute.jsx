import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, loading } = useContext(AppContext);

  if (loading) {
    return <div style={{textAlign: "center", marginTop: "2rem"}}>Loading...</div>;
  }

  return isLoggedIn ? children : <Navigate to="/welcome" />;
};

export default PrivateRoute;