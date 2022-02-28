import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectAuth } from "../../slices/authSlice";

const RequireAuth = ({ children }) => {
  const auth = useSelector(selectAuth);

  if (!auth) return <Navigate to="/login" />;

  return children;
};

export default RequireAuth;
