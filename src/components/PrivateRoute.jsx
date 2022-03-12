import { Navigate } from "react-router-dom";
// custom hooks
import { useAuthStatus } from "../hooks/useAuthStatus";
//components
import Spinner from "../components/Spinner";

const PrivateRoute = ({ children }) => {
  const { loading, loggedIn } = useAuthStatus();

  if (loading) {
    return <Spinner />;
  }

  return loggedIn ? children : <Navigate to="/sign-in" />;
};

export default PrivateRoute;
