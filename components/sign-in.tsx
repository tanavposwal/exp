"use client";

import { LoginWithChatGPT } from "@opencoredev/loginwithchatgpt-react";

export function SignIn() {
  return (
    <LoginWithChatGPT
      consent={{ appName: "EXP" }}
      onAuthenticated={() => console.log("ChatGPT session connected")}
    />
  );
}
