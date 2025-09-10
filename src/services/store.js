// services/store.js
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const handleError = (error) => {
  // Handle errors from the API

  const message = error.response?.data?.message || "An error occurred";
  throw new Error(message);
};

export const getStores = async (page,pageSize =1000) => {
  try {
    const response = await axios.get(`${API_URL}/stores?page=${page}&page_size=${pageSize}`);
    return response.data; // Mengambil data store dari respons
  } catch (error) {
    handleError(error);
  }
};

export const getStoreById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/stores/${id}`);
    return response.data.data; // Mengambil data store dari respons
  } catch (error) {
    handleError(error);
  }
};

export const updateStore = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/stores/${id}`, data);
    return response.data.message; // Mengambil pesan respon setelah update store
  } catch (error) {
    handleError(error);
  }
};

export const saveStore = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/stores`, data);
    return response.data.message; // Mengambil pesan respon setelah menyimpan store
  } catch (error) {
    handleError(error);
  }
};

export const deleteStore = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/stores/${id}`);
    return response.data.message; // Mengambil pesan respon setelah menghapus store
  } catch (error) {
    handleError(error);
  }
};

export const updateStatusSync = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/stores/resync/${id}`, data);
    return response.data.data; // Mengambil data store dari respons
  } catch (error) {
    handleError(error);
  }
};

export const getMenu = async (grabStoreCode) => {
  try {
    const response = await axios.get(
      `${API_URL}/items/menu?merchantID=${grabStoreCode}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const countStore = async () => {
  try {
    const response = await axios.get(`${API_URL}/stores/summary`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
