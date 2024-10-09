import axios from "axios";

export const extractText = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await axios.post("http://localhost:3000/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        console.log("File uploaded successfully", response.data);
        return response.data;
    } catch (error) {
        console.error("Error uploading the file", error);
    }
};