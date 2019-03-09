import Vue from 'vue'
import Router from 'vue-router'
import login from './views/login.vue'
import cookies from "js-cookie"


Vue.use(Router)

const ifAuthenticated = (to, from, next) => {
  if (cookies.get("aut")) {
    next()
    return
  } else {
    next('/')
  }
}


export default new Router({
  mode: 'history',
  routes: [{
      path: '/',
      name: 'loginForm',
      component: login
    },
    {
      path: '/map',
      name: 'map',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import( /* webpackChunkName: "about" */ './views/map.vue'),
      beforeEnter: ifAuthenticated
    }
  ]
})