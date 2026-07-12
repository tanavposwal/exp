import { createChatGPTHandler } from "@opencoredev/loginwithchatgpt-server";

export const auth = createChatGPTHandler({
  secret: process.env.LWC_SECRET,
  responsesProxy: {
    allowedModels: ["gpt-5.5", "gpt-5.4", "gpt-5.4-mini"],
  },
  cookie: { sameSite: "None", secure: true },
});

export const GET = (request: Request) => auth.handler(request);
export const POST = (request: Request) => auth.handler(request);
