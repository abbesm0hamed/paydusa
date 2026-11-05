import LoginTemplate from "@modules/account/templates/login-template";
import type { Metadata } from "next";

export const metadata: Metadata = {
  description: "Sign in to your Medusa Store account.",
  title: "Sign in",
};

export default function Login() {
  return <LoginTemplate />;
}
