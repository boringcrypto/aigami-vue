// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/aigami-vue', component: () => import('@/views/Home.vue') },
  { path: '/aigami-vue/debug', component: () => import('@/views/Debug.vue') }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
