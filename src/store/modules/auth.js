import { LocalStorage } from 'quasar'
import AuthApi from '../../api/AuthApi'

const user = AuthApi.getLoggedinUser()

const state = {
  currentUser: user,
  isLoggedIn: !!user,
  loading: false,
  auth_error: null,
  reg_error: null,
  registeredUser: null
}
const getters = {
  isLoading (state) {
    return state.loading
  },
  isLoggedin (state) {
    return state.isLoggedin
  },
  currentUser (state) {
    return state.currentUser
  },
  authError (state) {
    return state.auth_error
  },
  regError (state) {
    return state.reg_error
  },
  registeredUser (state) {
    return state.registeredUser
  }
}

const actions = {
  login ({ commit }) {
    commit('login')
  }
}

const mutations = {
  login (state) {
    state.loading = true
    state.auth_error = null
  },
  loginSuccess (state, payload) {
    state.auth_error = null
    state.isLoggedin = true
    state.loading = false
    state.currentUser = Object.assign({}, payload.user, {
      token: payload.token
    })
    LocalStorage.set('accessToken', payload.token)
    LocalStorage.set('user', JSON.stringify(state.currentUser))
  },
  loginFailed (state, payload) {
    state.loading = false
    state.auth_error = payload.error
  },
  logout (state) {
    LocalStorage.remove('user')
    LocalStorage.remove('accessToken')
    state.isLoggedin = false
    state.currentUser = null
  },
  registerSuccess (state, payload) {
    state.reg_error = null
    state.registeredUser = payload.user
  },
  registerFailed (state, payload) {
    state.reg_error = payload.error
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
