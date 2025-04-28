import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomePage.vue'
import HourlyView from '../views/HourlyView.vue'
import ForecastView from '../views/ForecastView.vue'
import FiveDayForecastView from '../views/FiveDayForecastView.vue'  

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/hourly/:location/:lat/:lon', 
    name: 'hourly',
    component: HourlyView,
    props: true
  },
  {
    path: '/forecast/:location/:lat/:lon', 
    name: 'forecast',
    component: ForecastView,
    props: true
  },
  {
    path: '/5day/:location/:lat/:lon',  
    name: '5day',
    component: FiveDayForecastView, 
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
