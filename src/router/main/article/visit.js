export default [{
  path: '/visit',
  redirect: '/visit/exception/404'
}, {
  path: '/visit/exception',
  redirect: '/visit/exception/404'
}, {
  name: 'rejected',
  path: '/visit/exception/403',
  component: () => import(/* webpackChunkName: "visitRejected" */ '@/views/pages/exception/403')
}, {
  name: 'notfound',
  path: '/visit/exception/404',
  component: () => import(/* webpackChunkName: "visitNotfound" */ '@/views/pages/exception/404')
}, {
  name: 'error',
  path: '/visit/exception/500',
  component: () => import(/* webpackChunkName: "visitError" */ '@/views/pages/exception/500')
}]
