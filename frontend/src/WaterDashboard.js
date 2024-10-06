// WaterDashboard.js
import React, { useState } from 'react';
import { getWaterData } from './api';
import MapComponent from './MapComponent';
import { MapContainer } from 'react-leaflet';

const WaterDashboard = () => {
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await getWaterData(latitude, longitude);
            setWeatherData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="water-dashboard">
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Latitude"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Longitude"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Loading...' : 'Get Weather Data'}
                    </button>
                </form>

                {error && <div className="error">{error}</div>}

                {weatherData && (
                    <div className="weather-data">
                        <h3>Weather Data for ({latitude}, {longitude})</h3>
                        <p>Temperature: {weatherData.temperature.current}°C</p>
                        <p>Min Temperature: {weatherData.temperature.min}°C</p>
                        <p>Max Temperature: {weatherData.temperature.max}°C</p>
                        <p>Humidity: {weatherData.humidity.current}%</p>
                        <p>Current Precipitation: {weatherData.precipitation.current} mm</p>
                        <p className="drought-prediction">
                            <strong>Drought Prediction: {weatherData.drought_prediction}</strong>
                        </p>
                        <p>Weather Condition: {weatherData.weather.description}</p>
                    </div>
                )}
            </div>
            <div className="map-container">
                <MapContainer center={[20.5937, 78.9629]} zoom={5} className="map-square">
                    <MapComponent setLatitude={setLatitude} setLongitude={setLongitude} />
                </MapContainer>
            </div>
        </div>
    );
};

export default WaterDashboard;
