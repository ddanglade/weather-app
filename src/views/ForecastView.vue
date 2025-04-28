<template>
    <div>
      <h1>5 Day Forecast for {{ location }}</h1>
      <p>Latitude: {{ lat }}, Longitude: {{ lon }}</p>
      
    </div>
  </template>
  
  <script>
  export default {
    props: ['location', 'lat', 'lon'],
    mounted() {
      console.log('Location:', this.location);
      console.log('Latitude:', this.lat);
      console.log('Longitude:', this.lon);
      
    }
  }
  </script>
  
  <style scoped>
  .forecast-view {
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

.forecast-table {
  width: 100%;
  border-collapse: collapse;
}

.forecast-table th,
.forecast-table td {
  padding: 10px;
  text-align: center;
  border: 1px solid #ddd;
}

.forecast-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.forecast-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.forecast-table td {
  font-size: 16px;
  color: #333;
}

  </style>
  