
import axios from "axios";

export const getRandomBackgroungImage = async () => {
  try {
    const res = await axios.get(
      "https://bing-wallpaper-api.jcolladosp.workers.dev/?resolution=UHD&index=random&width=1000&format=json"
    );

    return res.data.url; // return the URL to the caller

  } catch (err) {
    console.error("Error getting data:", err);
    return false;
  }
};

