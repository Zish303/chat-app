import React from "react";
import { Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const ProtectedRoute = ({ children }) => {
  const [cookies] = useCookies(["accessToken"]);

  // Check for authentication
  const isAuthenticated = cookies.accessToken;

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
