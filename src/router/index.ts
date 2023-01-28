import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import loginVue from '@/components/login.vue'
import addition from '../views/addition.vue'
import substraction from '@/views/substraction.vue'
import multiplication from '@/views/multiplication.vue'
import division from '@/views/division.vue'
import squareroot from '@/views/squareroot.vue'
import randomstring from '@/views/randomstring.vue'


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
    },
    {
      path: '/substraction',
      name: 'substraction',
      component: substraction
    },
    {
      path: '/multiplication',
      name: 'multiplication',
      component: multiplication
    },
    {
      path: '/division',
      name: 'division',
      component: division
    },
    {
      path: '/square_root',
      name: 'square_root',
      component: squareroot
    },
    {
      path: '/random_string',
      name: 'random_string',
      component: randomstring
    },
    
  ]
})

export default router
