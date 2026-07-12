"use client";

import { LoginWithChatGPT } from "@opencoredev/loginwithchatgpt-react";

export function SignIn() {
  return (
    <LoginWithChatGPT
      consent={{ appName: "EXP" }}
      onAuthenticated={() => window.location.reload()}
    />
  );
}
