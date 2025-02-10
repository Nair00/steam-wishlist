import type {
  VercelRequest,
  VercelResponse,
  VercelApiHandler,
} from "@vercel/node";
import axios from "axios";

const handler: VercelApiHandler = async (request, response) => {
  console.log("API endpoint called with steamId:", request.query.steamId);
  console.log("steamIdaaa");
  const { steamId } = request.query;
  const key = request.query.key as string;
  console.log("steamId", steamId);

  if (!key) {
    response.status(400).json({ error: "API key is required" });
    return;
  }
  console.log("key", "TEST");

  try {
    const steamResponse = await axios.get(
      "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/",
      {
        params: {
          key,
          steamids: steamId,
        },
      }
    );

    response.status(200).json(steamResponse.data);
    return;
  } catch (error) {
    console.error("Steam API error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      status: axios.isAxiosError(error) ? error.response?.status : undefined,
      data: axios.isAxiosError(error) ? error.response?.data : undefined,
      config: axios.isAxiosError(error)
        ? {
            url: error.config?.url,
            params: error.config?.params,
            method: error.config?.method,
          }
        : undefined,
    });

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || error.message;
      response.status(status).json({
        error: "Steam API request failed",
        details: message,
        statusCode: status,
      });
      return;
    }

    response.status(500).json({
      error: "Failed to fetch user data",
      details:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
    return;
  }
};

export default handler;
