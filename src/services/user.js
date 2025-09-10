// services/store.js
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;




const handleError = (error) => {
    const message = error.response?.data?.message || "An error occurred";
    throw new Error(message);
  };
  
  export const registerUser = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`,data);
      return response.data.data; // Mengambil data store dari respons
    } catch (error) {
      handleError(error);
    }
  };


  export const loginUser = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`,data);
      console.log(response.data);
      return response.data.data; // Mengambil data store dari respons
    } catch (error) {
      handleError(error);
    }
  };