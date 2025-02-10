import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

const handler = async (request: VercelRequest, response: VercelResponse) => {
  const key = request.query.key as string;
  const input_json = request.query.input_json as string;

  if (!key || !input_json) {
    return response.status(400).json({ error: "Missing required parameters" });
  }

  try {
    const steamResponse = await axios.get(
      "https://api.steampowered.com/IStoreBrowseService/GetItems/v1/",
      {
        params: {
          key,
          input_json,
        },
        headers: {
          Accept: "application/json",
          "Accept-Language": "en-US,en;q=0.7",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        },
      }
    );

    return response.status(200).json(steamResponse.data);
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
            headers: error.config?.headers,
          }
        : undefined,
    });

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || error.message;
      return response.status(status).json({
        error: "Steam API request failed",
        details: message,
        statusCode: status,
      });
    }

    return response.status(500).json({
      error: "Failed to fetch store items",
      details:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

export default handler;
