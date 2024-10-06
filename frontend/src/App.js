// src/App.js

import React from 'react';
import WaterDashboard from './WaterDashboard'; // Import the WaterDashboard component
import './styles.css'; // Import any CSS styles if you have them
import 'leaflet/dist/leaflet.css';

const App = () => {
    return (
        <div className="app">
            <h1 className="app-title">Drought Predictor</h1> {/* Updated title */}
            <WaterDashboard /> {/* Render the WaterDashboard component */}
        </div>
    );
};

export default App;
