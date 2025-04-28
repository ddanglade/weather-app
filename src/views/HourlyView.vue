<template>
    <div class="hourly-view">
      <div class="header">
        <h1>Hourly Forecast for {{ location }}</h1>
        <p>Latitude: {{ lat }}, Longitude: {{ lon }}</p>
      </div>
  
      <div v-if="hourlyData.length > 0" class="chart-container">
        <canvas id="hourly-chart"></canvas>
        <p>Hourly temperatures and rain amounts for today</p>
      </div>
  
      <div v-else class="loading">
        <p>Loading hourly data...</p>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import Chart from 'chart.js/auto'; 
  
  export default {
    props: ['location', 'lat', 'lon'], 
    setup(props) {
      const hourlyData = ref([]);
  
      onMounted(async () => {
        const { location, lat, lon } = props; 
  
        console.log('Fetching hourly forecast data for:', { location, lat, lon });
  
        try {
          const apiKey = process.env.VUE_APP_OPENWEATHER_API_KEY;
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,daily,alerts&appid=${apiKey}`
          );
          const data = await response.json();
          hourlyData.value = data.hourly.slice(0, 24); 
  
          
          renderChart(hourlyData.value);
        } catch (error) {
          console.error('Error fetching hourly data:', error);
        }
      });
  
      const renderChart = (data) => {
        const labels = data.map((hour) => new Date(hour.dt * 1000).getHours());
        const temperatures = data.map((hour) => (hour.temp - 273.15).toFixed(1)); 
        const rain = data.map((hour) => (hour.rain ? hour.rain['1h'] : 0));
  
        const ctx = document.getElementById('hourly-chart').getContext('2d');
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Temperature (°C)',
                data: temperatures,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                fill: true,
                tension: 0.3,
              },
              {
                label: 'Rain (mm)',
                data: rain,
                borderColor: '#2ecc71',
                backgroundColor: 'rgba(46, 204, 113, 0.2)',
                fill: true,
                tension: 0.3,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      };
  
      return { hourlyData };
    },
  };
  </script>
  
  <style scoped>
  .hourly-view {
    padding: 20px;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .header {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .header h1 {
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }
  
  .header p {
    font-size: 16px;
    color: #777;
  }
  
  .chart-container {
    padding: 20px;
    background: #f4f4f4;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .chart-container p {
    font-size: 16px;
    text-align: center;
    color: #777;
  }
  
  .loading {
    text-align: center;
    color: #777;
  }
  </style>
  