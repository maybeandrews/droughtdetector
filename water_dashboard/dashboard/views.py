import requests
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response

class WaterResourceAPIView(APIView):
    def post(self, request):
        location = request.data.get('location')
        if not location:
            return Response({"error": "Location is required"}, status=400)

        try:
            lat, lon = map(float, location.split(','))
        except ValueError:
            return Response({"error": "Invalid location format. Use 'latitude,longitude'"}, status=400)

        api_key = settings.OPENWEATHERMAP_API_KEY
        base_url = "https://api.openweathermap.org/data/2.5/weather"
        
        url = f"{base_url}?lat={lat}&lon={lon}&appid={api_key}&units=metric"

        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            
            data = response.json()

            # Extract necessary data
            temperature = data["main"]["temp"]
            precipitation = data.get("rain", {}).get("1h", 0)  # Rain in last hour, if available
            humidity = data["main"]["humidity"]

            # Simple drought prediction logic
            drought_prediction = "Normal"
            if temperature > 30 and precipitation < 5:
                drought_prediction = "Drought Alert"
            elif temperature < 20 and humidity > 80:
                drought_prediction = "High Humidity, Low Drought Risk"

            processed_data = {
                "temperature": {
                    "current": temperature,
                    "min": data["main"]["temp_min"],
                    "max": data["main"]["temp_max"]
                },
                "humidity": {
                    "current": humidity
                },
                "precipitation": {
                    "current": precipitation,
                    "forecast": data.get("rain", {}).get("1h", 0)  # This can be adjusted for a different time frame
                },
                "drought_prediction": drought_prediction,
                "weather": {
                    "main": data["weather"][0]["main"],
                    "description": data["weather"][0]["description"]
                }
            }

            return Response(processed_data)

        except requests.RequestException as e:
            print(f"Error details: {str(e)}")
            return Response({"error": f"Failed to fetch data from OpenWeatherMap: {str(e)}"}, status=500)
