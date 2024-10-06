from django.urls import path
from .views import WaterResourceAPIView

urlpatterns = [
    # Expects POST request with 'location' in the format 'latitude,longitude'
    path('api/get_water_data/', WaterResourceAPIView.as_view(), name='get_water_data'),
]