import SendBirdCall from "sendbird-calls";

const APP_ID = "580166CB-70E8-4538-B4A6-B99F3762D5FA";

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
