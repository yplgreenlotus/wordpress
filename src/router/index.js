import Vue from 'vue'
import VueRouter from 'vue-router'
import MainLayout from '@/components/layout/mainLayout'
import OtherLayout from '@/components/layout/otherLayout'
import Exception from '@/router/exception/index'
import Main from '@/router/main/index'

Vue.use(VueRouter)
console.log(Main)
const routes = [{
  path: '/',
  name: 'mainLayout',
  component: MainLayout,
  children: [...Main]
}, {
  path: '/exception',
  name: 'exception',
  component: OtherLayout,
  children: [...Exception]
}, {
  path: '*',
  redirect: '/exception/404'
}]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
