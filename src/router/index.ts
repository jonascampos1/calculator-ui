import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import loginVue from '@/components/login.vue'
import addition from '../views/addition.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: loginVue
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/addition',
      name: 'addition',
      component: addition
    }
  ]
})

export default router
