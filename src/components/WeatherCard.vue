<template>
    <div class="weather-card">
      <h2>{{ weather.locationName }}</h2>
      <div class="weather-info" v-if="weather.weather && weather.weather[0]">
        <img :src="`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`" alt="Weather Icon" />
        <p>{{ weather.weather[0].description }}</p>
        <p>Temperature: {{ weather.main.temp ? (weather.main.temp - 273.15).toFixed(1) : 'N/A' }} °C</p>
      </div>
      <div v-else>
        <p>Weather data is unavailable.</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      weather: {
        type: Object,
        required: true
      }
    }
  };
  </script>
  
  <style scoped>
  .weather-card {
    padding: 20px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .weather-info img {
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }
  
  .weather-info {
    display: flex;
    align-items: center;
  }
  </style>
  