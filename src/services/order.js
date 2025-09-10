// services/store.js
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getOrders = async (params) => {
  try {
    const response = await axios.get(`${API_URL}/orders?store_code=${params.store_code}&date=${params.date}&page=${params.page}`);
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to fetch orders");
  }
};


export const saveOrder = async (body) => {
    try {
      const response = await axios.post(`${API_URL}/orders/submit-manual`,
        body
      );
      return response.data.data; 
    } catch (error) {
      throw new Error("Failed to fetch orders");
    }
  };




export const finishOrder = async (id, body) => {
    try {
      const response = await axios.put(`${API_URL}/orders/state-manual/${id}`,
        body
      );
      return response.data.data; 
    } catch (error) {
      throw new Error("Failed to fetch orders");
    }
  };


export const fetchSummaryOrders= async(params)=>{
  try {
    const response = await axios.get(`${API_URL}/orders/summary?start_date=${params.start_date}&end_date=${params.end_date}`,
    );
    return response.data; 
  } catch (error) {
    throw new Error("Failed to fetch orders");
  }
}
  

