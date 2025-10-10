import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/admin/signup',
      name: 'adminSignup',
      component: () => import('@/views/AdminSignupView.vue')
    },
    {
      path: '/admin/login',
      name: 'adminLogin',
      component: () => import('@/views/AdminLoginView.vue')
    },
    {
      path: '/user/signup',
      name: 'userSignup',
      component: () => import('@/views/UserSignupView.vue')
    },
    {
      path: '/user/login',
      name: 'userLogin',
      component: () => import('@/views/UserLoginView.vue')
    }
  ]
})

export default router