import { LocalStorage } from 'quasar'
// leave the export, even if you don't use it
export default async ({ app, router, Vue }) => {
  router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      const userStr = LocalStorage.getItem('user')
      if (userStr) {
        next()
        return
      }
      next('/login')
    } else {
      next()
    }
  })
}
