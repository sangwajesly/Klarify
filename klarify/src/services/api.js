import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const getRecommendations = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/recommend/al-student`, data);
    return response.data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};
