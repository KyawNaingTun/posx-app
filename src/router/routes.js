
// layouts
import MasterLayout from 'layouts/MasterLayout'

// pages
import TablePage from 'pages/Table'
import OrderPage from 'pages/Order'
import LoginPage from 'pages/Login'
import StarterPage from 'pages/Starter'

const routes = [
  {
    path: '/page',
    component: MasterLayout,
    children: [
      { path: '/table', name: 'table', component: TablePage, meta: { requiresAuth: true } },
      { path: '/order/:id/number/:no/status/:status/order/:orderId', name: 'order', component: OrderPage, meta: { requiresAuth: true } }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/',
    name: 'starter',
    component: StarterPage
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
