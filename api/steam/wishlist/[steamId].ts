import { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const { steamId } = request.query;
  const key = request.query.key as string;

  if (!key) {
    return response.status(400).json({ error: "API key is required" });
  }

  try {
    const steamResponse = await axios.get(
      "https://api.steampowered.com/IWishlistService/GetWishlist/v1/",
      {
        params: {
          key,
          steamid: steamId,
          count: 2000,
        },
      }
    );

    return response.status(200).json(steamResponse.data);
  } catch (error) {
    console.error("Steam API error:", error);
    return response.status(500).json({ error: "Failed to fetch wishlist" });
  }
}
