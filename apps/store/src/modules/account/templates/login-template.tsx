"use client";

import Login from "@modules/account/components/login";
import Register from "@modules/account/components/register";
import { LOGIN_VIEW } from "@modules/account/lib/login-view";
import { useState } from "react";

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState(LOGIN_VIEW.SIGN_IN);

  return (
    <div className="flex w-full justify-start px-8 py-8">
      {currentView === LOGIN_VIEW.SIGN_IN ? (
        <Login setCurrentView={setCurrentView} />
      ) : (
        <Register setCurrentView={setCurrentView} />
      )}
    </div>
  );
};

export default LoginTemplate;
