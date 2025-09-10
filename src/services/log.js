// services/category.js
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const handleError = (error) => {
  // Handle errors from the API
  const message = error.response?.data?.message || 'An error occurred';
  throw new Error(message);
};

export const getLogByType = async (type,page,pageSize,filter,search) => {
  try {
    
    const response = await axios.get(`${API_URL}/logs/${type}?page=${page}&page_size=${pageSize}&name=${filter}&q=${search}`);
    return response.data.data; 
  } catch (error) {
    handleError(error);
  }
};

export const getFilterLogByType = async (type) => {
    try {
      
      const response = await axios.get(`${API_URL}/logs/name/${type}`);
      return response.data.data; 
    } catch (error) {
      handleError(error);
    }
  };