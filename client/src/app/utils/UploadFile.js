import axios from "axios";

export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/auth/upload/files`,
      formData
    );

    return data.fileUrls;
  } catch (error) {
    console.log(error);
  }
};
