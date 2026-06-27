"use client";

import Login from "@modules/account/components/login";
import Register from "@modules/account/components/register";
import { useState } from "react";

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState("sign-in");

  return (
    <div className="w-full flex justify-start px-8 py-8">
      {currentView === "sign-in" ? (
        <Login setCurrentView={setCurrentView} />
      ) : (
        <Register setCurrentView={setCurrentView} />
      )}
    </div>
  );
};

export default LoginTemplate;
