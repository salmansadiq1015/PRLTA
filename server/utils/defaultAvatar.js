import axios from "axios";

let defaultAvatar = { data: null, contentType: "image/png" };

const fetchDefaultAvatar = async () => {
  try {
    const url = "https://cdn-icons-png.flaticon.com/512/6596/6596121.png";
    const response = await axios.get(url, { responseType: "arraybuffer" });

    defaultAvatar = {
      data: Buffer.from(response.data),
      contentType: "image/png",
    };
  } catch (error) {
    console.error("Error fetching default avatar:", error);
  }
};

export { defaultAvatar, fetchDefaultAvatar };
