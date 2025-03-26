import SendBirdCall from "sendbird-calls";

const APP_ID = "9DE63BF5-A5A0-4423-9C5D-1C3EBB6FF232";

export const initializeSendbird = () => {
  if (typeof window !== "undefined") {
    SendBirdCall.init(APP_ID);
    console.log("Sendbird initialized");
  }
};

export const authenticateUser = async (userId, accessToken = null) => {
  try {
    await SendBirdCall.authenticate({ userId, accessToken });
    console.log("User authenticated");

    await SendBirdCall.connectWebSocket();
    console.log("WebSocket connected");
  } catch (error) {
    console.error("Authentication failed:", error);
  }
};
