export default [{
  path: '/exception',
  redirect: '/exception/404'
}, {
  name: '403',
  path: '/exception/403',
  component: () => import(/* webpackChunkName: "403" */ '@/views/pages/exception/403')
}, {
  name: '404',
  path: '/exception/404',
  component: () => import(/* webpackChunkName: "404" */ '@/views/pages/exception/404')
}, {
  name: '500',
  path: '/exception/500',
  component: () => import(/* webpackChunkName: "500" */ '@/views/pages/exception/500')
}]
