import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";

const uploadImage = async (imgeFile) => {
    const formData = new FormData();
    // Append image file to form data
    formData.append('image', imgeFile);

    try {
        const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
            headers: {
                "Content-Type": "multipart/form-data", // Set header for file upload
            },
        });

        return response.data;

    } catch (error) {
        console.error("Error upload the image: ", error);
        throw error; // Rethrow error for handling
    }
};

export default uploadImage;