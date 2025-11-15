import { SignUpForm } from "../components/AuthForm";
import React from "react";
export const SignupPage: React.FC<{ background: string }> = ({
  background,
}) => {
  return (
    <div className="flex w-full h-full justify-center items-center">
      {background && (
        <img
          src={background}
          className="w-full h-full absolute top-0 left-0 z-[-1]"
        />
      )}
      <SignUpForm></SignUpForm>
    </div>
  );
};
