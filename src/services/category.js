// services/category.js
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const handleError = (error) => {
  // Handle errors from the API
  const message = error.response?.data?.message || 'An error occurred';
  throw new Error(message);
};

export const getCategories = async (status = null) => {
  try {
    let url = `${API_URL}/categories`;
    if (status) {
      url += `?status=${status}`;
    }
    const response = await axios.get(url);
    return response.data.data; // Mengambil data categories dari respons
  } catch (error) {
    handleError(error);
  }
};

export const getCategoryById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/categories/${id}`);
    return response.data.data; // Mengambil data category dari respons
  } catch (error) {
    handleError(error);
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/categories/${id}`);
    return response.data.data; // Mengambil data category dari respons
  } catch (error) {
    handleError(error);
  }
};

export const updateCategory = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/categories/${id}`, data);
    return response.data.message; // Mengambil pesan respon setelah update category
  } catch (error) {
    handleError(error);
  }
};

export const saveCategory = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/categories`, data);
    return response.data; // Mengambil pesan respon setelah menyimpan category
  } catch (error) {
    handleError(error);
  }
};

export const countCategory = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories/summary`);
    return response.data; 
  } catch (error) {
    handleError(error);
  }
};
