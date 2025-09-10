import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_JOB_URL;

const handleError = (error) => {
  const message = error.response?.data?.message || 'An error occurred';
  throw new Error(message);
};

export const fetchListJob = async () => {
  try {
    
    const response = await axios.get(`${API_URL}/job-status`);
    return response.data.data; 
  } catch (error) {
    handleError(error);
  }
};

