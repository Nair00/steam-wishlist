import { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
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
    console.error("Steam API error:", error);
    return response.status(500).json({ error: "Failed to fetch store items" });
  }
}
