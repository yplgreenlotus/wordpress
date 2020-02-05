export default [{
  path: '/',
  redirect: '/article/introduce/index'
}, {
  name: 'article',
  path: '/article/:category/:name',
  component: () => import(/* webpackChunkName: "article" */ '@/views/pages/article/index')
}]
