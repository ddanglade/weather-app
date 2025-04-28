<template>
  <div class="home" :class="weatherBackground">
    <SearchBar @search="searchLocation" />
    <LocationList :locations="savedLocations" @select="selectLocation" @delete="deleteLocation" />
    
    <WeatherCard v-if="currentWeather && currentWeather.locationName" :weather="currentWeather" />
    
    <!-- Links to Forecasts -->
    <div v-if="currentWeather">
      <router-link :to="{ name: 'hourly', params: { location: currentWeather.locationName, lat: currentWeather.coord.lat, lon: currentWeather.coord.lon } }">
        Hourly Forecast
      </router-link>
      <router-link :to="{ name: '5day', params: { location: currentWeather.locationName, lat: currentWeather.coord.lat, lon: currentWeather.coord.lon } }">
        5 Day Forecast
      </router-link>
    </div>

    <!-- Only Hourly Chart Displayed Here -->
    <div v-if="showHourly">
      <h2>Hourly Forecast for {{ currentWeather.locationName }}</h2>
      <line-chart v-if="hourlyData" :data="chartData" :options="chartOptions" />
    </div>

  </div>
</template>


<script>
import SearchBar from '../components/SearchBar.vue'
import LocationList from '../components/LocationList.vue'
import WeatherCard from '../components/WeatherCard.vue'
import { Line } from 'vue-chartjs';
import axios from 'axios';

export default {
  components: {
    SearchBar,
    LocationList,
    WeatherCard,
    LineChart: Line,
  },
  data() {
    return {
      savedLocations: JSON.parse(localStorage.getItem('locations')) || [],
      currentWeather: null,
      weatherBackground: '',
      showHourly: false,
      hourlyData: null,
      chartData: {
        labels: [],
        datasets: [
          {
            label: 'Temperature (°C)',
            data: [],
            borderColor: '#42A5F5',
            fill: false
          },
          {
            label: 'Rainfall (mm)',
            data: [],
            borderColor: '#66BB6A',
            fill: false
          }
        ]
      },
      chartOptions: {
        responsive: true,
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              autoSkip: true,
              maxTicksLimit: 10
            }
          },
          y: {
            beginAtZero: true
          }
        }
      }
    };
  },
  methods: {
    async searchLocation(location) {
      try {
        if (!location || location.trim() === '') {
          alert('Please enter a valid location.');
          return;
        }

        const apiKey = process.env.VUE_APP_OPENWEATHER_API_KEY;
        if (!apiKey) {
          console.error('API key is missing');
          alert('API key is missing');
          return;
        }

        const isZipCode = /^\d+$/.test(location);

        const geoRes = await axios.get(
          isZipCode
            ? `https://api.openweathermap.org/data/2.5/weather?zip=${location}&appid=${apiKey}`
            : `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`
        );

        const geoData = geoRes.data;

        if (!geoData || !geoData.name || !geoData.sys || !geoData.sys.country) {
          console.error('Invalid API response:', geoData);
          alert('Location data is invalid');
          return;
        }

        this.currentWeather = {
          ...geoData,
          locationName: `${geoData.name}, ${geoData.sys.country}`,
        };

        const weatherCondition = geoData.weather[0]?.main?.toLowerCase();
        if (weatherCondition) {
          if (weatherCondition.includes('clear')) {
            this.weatherBackground = 'clear';
          } else if (weatherCondition.includes('rain')) {
            this.weatherBackground = 'rain';
          } else if (geoData.main.temp > 20) {
            this.weatherBackground = 'warm';
          } else if (geoData.main.temp <= 0) {
            this.weatherBackground = 'cold';
          } else {
            this.weatherBackground = 'night';
          }
        }

        const existing = this.savedLocations.find(
          (loc) => loc.name === this.currentWeather.locationName
        );
        if (!existing) {
          this.savedLocations.push({
            name: this.currentWeather.locationName,
            lat: geoData.coord.lat,
            lon: geoData.coord.lon,
          });
          localStorage.setItem('locations', JSON.stringify(this.savedLocations));
        }

        // Fetch hourly and 5-day forecast data
        this.fetchHourlyData(geoData.coord.lat, geoData.coord.lon);
        this.fetchFiveDayData(geoData.coord.lat, geoData.coord.lon);
      } catch (err) {
        console.error('Error details:', err);
        alert('Error fetching location');
      }
    },

    async fetchHourlyData(lat, lon) {
      const apiKey = process.env.VUE_APP_OPENWEATHER_API_KEY;
      try {
        const res = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,daily,alerts&appid=${apiKey}`);
        const data = res.data.hourly;

        this.hourlyData = data;
        const labels = [];
        const tempData = [];
        const rainData = [];

        data.forEach(item => {
          labels.push(new Date(item.dt * 1000).toLocaleTimeString());
          tempData.push((item.temp - 273.15).toFixed(1)); // Convert from Kelvin to Celsius
          rainData.push(item.rain ? item.rain['1h'] : 0); // Rain in mm
        });

        this.chartData.labels = labels;
        this.chartData.datasets[0].data = tempData;
        this.chartData.datasets[1].data = rainData;

        this.showHourly = true;
        this.showFiveDay = false;
      } catch (err) {
        console.error('Error fetching hourly data', err);
      }
    },

    async fetchFiveDayData(lat, lon) {
      const apiKey = process.env.VUE_APP_OPENWEATHER_API_KEY;
      try {
        const res = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${apiKey}`);
        this.fiveDayData = res.data.daily;
        this.showFiveDay = true;
        this.showHourly = false;
      } catch (err) {
        console.error('Error fetching 5-day data', err);
      }
    },

    selectLocation(location) {
      this.searchLocation(location.name);
    },

    deleteLocation(index) {
      this.savedLocations.splice(index, 1);
      localStorage.setItem('locations', JSON.stringify(this.savedLocations));
    }
  }
};
</script>

<style scoped>
.home {
  padding: 20px;
  transition: background-image 0.3s ease-in-out;
}

.clear {
  background-image: url('@/assets/clear-day.jpg');
}

.rain {
  background-image: url('@/assets/rainy-day.jpg');
}

.warm {
  background-image: url('@/assets/warm-day.jpg');
}

.cold {
  background-image: url('@/assets/cold-day.jpg');
}

.night {
  background-image: url('@/assets/night.jpg');
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

th {
  background-color: #f4f4f4;
}
</style>
