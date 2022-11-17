import Vue from 'vue'
import Vuex from 'vuex'

import table from './table'
// import example from './module-example'
import app from './modules/app'
import product from './modules/product'
import cart from './modules/cart'
import auth from './modules/auth'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      app,
      table,
      product,
      cart,
      auth
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: false // process.env.DEV
  })

  return Store
}
