<template>
    <div class="location-list">
      <h3>Saved Locations</h3>
      <ul>
        <li v-for="(location, index) in locations" :key="index">
          <span @click="selectLocation(location)">
            {{ location.name }}
          </span>
          <button @click="deleteLocation(index)">Delete</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LocationList',
    props: {
      locations: {
        type: Array,
        required: true
      }
    },
    methods: {
      selectLocation(location) {
        this.$emit('select', location);
      },
      deleteLocation(index) {
        this.$emit('delete', index);
      }
    }
  }
  </script>
  
  <style scoped>
  .location-list {
    margin-top: 20px;
  }
  
  .location-list ul {
    list-style-type: none;
    padding: 0;
  }
  
  .location-list li {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
  }
  
  button {
    background-color: #e57373;
    border: none;
    padding: 5px;
    cursor: pointer;
  }
  </style>
  