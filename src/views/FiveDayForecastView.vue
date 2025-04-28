<template>
    <div class="five-day-forecast">
      <h1>5 Day Forecast for {{ location }}</h1>
      <p>Latitude: {{ lat }}, Longitude: {{ lon }}</p>
  
      <div v-if="forecast.length">
        <div v-for="(day, index) in forecast" :key="index" class="forecast-day">
          <h3>{{ day.date }}</h3>
          <p>Temp: {{ day.temp }}°C</p>
          <p>Weather: {{ day.description }}</p>
        </div>
      </div>
  
      <div v-else>
        <p>Loading forecast...</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['location', 'lat', 'lon'],
    data() {
      return {
        forecast: []
      };
    },
    mounted() {
      this.fetchFiveDayForecast();
    },
    methods: {
      async fetchFiveDayForecast() {
        try {
          const apiKey = '06c221e9bfe9308f60929ecfc9b6c78a'
          const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${this.lat}&lon=${this.lon}&units=metric&appid=${apiKey}`;
          const response = await fetch(url);
          const data = await response.json();
  
          // Process the response to get 1 forecast per day
          const dailyForecast = {};
  
          data.list.forEach(item => {
            const date = item.dt_txt.split(' ')[0]; // Just the date part
            if (!dailyForecast[date]) {
              dailyForecast[date] = {
                temp: item.main.temp,
                description: item.weather[0].description
              };
            }
          });
  
          // Convert the dailyForecast object into an array
          this.forecast = Object.keys(dailyForecast).map(date => ({
            date,
            temp: Math.round(dailyForecast[date].temp),
            description: dailyForecast[date].description
          }));
  
          console.log('5-Day Forecast:', this.forecast);
        } catch (error) {
          console.error('Error fetching 5-day forecast:', error);
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .five-day-forecast {
    padding: 20px;
    background: rgba(255,255,255,0.9);
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    text-align: center;
  }
  
  .forecast-day {
    margin: 20px 0;
    padding: 10px;
    background: #f0f8ff;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  }
  </style>
  