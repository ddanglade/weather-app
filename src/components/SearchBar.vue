<template>
    <div>
      <input
        type="text"
        v-model="location"
        placeholder="Search for a location"
        @keyup.enter="searchLocation"
      />
      <button @click="searchLocation">Search</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        location: '',
      }
    },
    methods: {
      searchLocation() {
        if (this.location.trim() !== '') {
          this.$emit('search', this.location)
          this.location = ''
        }
      },
    },
  }
  </script>
  