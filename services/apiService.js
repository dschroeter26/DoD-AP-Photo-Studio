import axios from 'axios';

const API_BASE_URL = 'http://localhost:5002/api/images'; // Update with your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const uploadImage = async (imageData) => {
  try {
    console.log(`Calling ${API_BASE_URL} with request body`, imageData);
    const response = await api.post('/upload', imageData);
    console.log("Response", response);
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
