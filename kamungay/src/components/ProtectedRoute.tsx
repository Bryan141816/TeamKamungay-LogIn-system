import { Navigate } from "react-router-dom";
import { auth } from "../firebase";
import React from "react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = auth.currentUser;
  const otpVerified = localStorage.getItem("otpVerified") === "true";

  if (!user) return <Navigate to="/" replace />;
  if (!otpVerified) return <Navigate to="/" replace />;

  return <>{children}</>;
};
