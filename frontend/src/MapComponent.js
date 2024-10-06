import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-control-geocoder'; // Import the geocoder plugin
import 'leaflet-control-geocoder/dist/Control.Geocoder.css'; // Import CSS for the geocoder

// Set default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapComponent = ({ setLatitude, setLongitude }) => {
    const [position, setPosition] = useState([20.5937, 78.9629]); // Default to India
    const map = useMap();

    useEffect(() => {
        const geocoder = L.Control.Geocoder.nominatim();

        // Create a geocoder control
        const control = L.Control.geocoder({
            defaultMarkGeocode: false,
            placeholder: 'Search for a location',
        })
            .on('markgeocode', (e) => {
                const { center } = e.geocode; // Get the coordinates from the selected location
                setPosition(center);
                setLatitude(center.lat);
                setLongitude(center.lng);
                map.setView(center, 13); // Set map view to the new position
            })
            .addTo(map); // Add geocoder control to the map

        // Set map to the initial position
        map.setView(position, 5);

        return () => {
            map.removeControl(control); // Clean up on unmount
        };
    }, [map, position, setLatitude, setLongitude]);

    // Handle map click events
    const handleMapClick = useCallback((e) => {
        const { lat, lng } = e.latlng;
        console.log(`Clicked coordinates: ${lat}, ${lng}`); // Debugging line
        setPosition([lat, lng]);
        setLatitude(lat);
        setLongitude(lng);
        map.setView([lat, lng], map.getZoom()); // Reset view on click
    }, [map, setLatitude, setLongitude]);

    // Attach click event to the map
    useEffect(() => {
        map.on('click', handleMapClick);
        return () => {
            map.off('click', handleMapClick); // Cleanup on unmount
        };
    }, [map, handleMapClick]);

    return (
        <MapContainer center={position} zoom={5} style={{ height: "100%", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position} />
        </MapContainer>
    );
};

export default MapComponent;
