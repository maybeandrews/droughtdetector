import axios from 'axios';

const API_URL = 'http://localhost:8000/api/get_water_data/'; // Django API endpoint

export const getWaterData = async (latitude, longitude) => {
    try {
        const response = await axios.post(API_URL, { location: `${latitude},${longitude}` });
        return response.data;
    } catch (error) {
        console.error('Error fetching water data:', error);
        if (error.response) {
            throw new Error(error.response.data.error || 'Failed to fetch water data');
        } else if (error.request) {
            throw new Error('No response received from server');
        } else {
            throw new Error('Error setting up the request');
        }
    }
};