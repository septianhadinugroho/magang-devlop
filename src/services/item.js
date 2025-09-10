// services/store.js
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getItems = async (page,key) => {
  try {
    const response = await axios.get(`${API_URL}/items?page=${page}&q=${key}`);
    return response.data; 
  } catch (error) {
    throw new Error("Failed to fetch stores");
  }
};


export const getItemById = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/items/${id}`);
      return response.data.data; // Mengambil data store dari respons
    } catch (error) {
      throw new Error("Failed to fetch stores");
    }
  };


  export const updateItem = async (id,data) => {
    try {
      const response = await axios.put(`${API_URL}/items/${id}`,data);
     
      return response.data.message; // Mengambil data store dari respon
    } catch (error) {
        throw new Error(error.response.data.message);
    }
  };


  export const deleteItem = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/items/${id}`);
     
      return response.data.message; // Mengambil data store dari respon
    } catch (error) {
        throw new Error(error.response.data.message);
    }
  };

  export const deleteItemInStore = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/items/store/${id}`);
     
      return response.data.message; // Mengambil data store dari respon
    } catch (error) {
        throw new Error(error.response.data.message);
    }
  };


  export const updateItemInStore = async (id,data) => {
    try {
      const response = await axios.put(`${API_URL}/items/store/${id}`,data);
     
      return response.data.message; // Mengambil data store dari respon
    } catch (error) {
        throw new Error(error.response.data.message);
    }
  };


  export const saveItem = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/items`,data);
    
      return response.data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
  };


  export const syncItemProfit = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/items/store`,data);
    
      return response.data.message; // Mengambil data store dari respon
    } catch (error) {
        throw new Error(error.response.data.message);
    }
  };

  export const countItem = async () => {
    try {
      const response = await axios.get(`${API_URL}/items/summary`);
      return response.data; 
    } catch (error) {
      handleError(error);
    }
  };


  