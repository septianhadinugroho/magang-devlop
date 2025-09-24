// src/services/grabmart_log.js

import axios from "axios";

const API_URL_BE = process.env.NEXT_PUBLIC_API_URL_BE;

export const getGrabMartLogs = async (page = 1, pageSize = 10, q = "", partnerMerchantId = "") => {
  try {
    const response = await axios.get(`${API_URL_BE}/grabmart-logs`, {
      params: { page, pageSize, q, partnerMerchantId }, // Tambahkan partnerMerchantId
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching GrabMart logs:", error);
    throw error;
  }
};

// Fungsi baru untuk mengambil daftar partner merchant
export const getPartnerMerchants = async () => {
  try {
    const response = await axios.get(`${API_URL_BE}/grabmart-logs/partner-merchants`);
    return response.data;
  } catch (error) {
    console.error("Error fetching partner merchants:", error);
    throw error;
  }
};

export const updateGrabMartLog = async (id, data) => {
  try {
    const response = await axios.put(
      `${API_URL_BE}/grabmart-logs/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating GrabMart log:", error);
    throw error;
  }
};