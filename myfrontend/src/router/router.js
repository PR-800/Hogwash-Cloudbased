import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'HogWash',
    meta: { guess: true },
    component: () => import('../views/HomePage.vue') // set home as path '/'
  },
  {
    path: '/contact',
    name: 'HogWash | Contact',
    meta: { login: true },
    component: () => import('../views/ContactPage.vue')
  },
  {
    path: '/user',
    name: 'HogWash | User',
    meta: { guess: true },
    component: () => import('../views/LoginPage.vue')
  },
  {
    path: '/history',
    name: 'HogWash | History',
    meta: { login: true },
    component: () => import('../views/HistoryPage.vue')
  },
  {
    path: '/feedback',
    name: 'HogWash | Feedback',
    meta: { login: true },
    component: () => import('../views/FeedbackPage.vue')
  },
  {
    path: '/historylist',
    name: 'HogWash | AllHistory',
    meta: { login: true },
    component: () => import('../views/AllHistory.vue')
  },
]

// const router = new VueRouter({
//   mode: 'history',
//   base: process.env.BASE_URL,
//   routes
// })

// router.beforeEach((to, from, next) => {
//   document.title = to.name;
//   next();
// });

const router = new VueRouter({ routes })

router.beforeEach((to, from, next) => {
  document.title = to.name;   //เปลี่ยนชื่อ title
  const isLoggedIn = !!localStorage.getItem('token') // เช็คว่ามีตัวแปร token ใน local storage รึยัง (มีแล้ว = login แล้ว)

  if (to.meta.login && !isLoggedIn) {
    alert('Please login')
    next({ path: '/user' })
  }

  next()
})

export default router