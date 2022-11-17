// import { LocalStorage } from 'quasar'
// define default state
const getDefaultState = () => {
  return {
    serverApiUrl: 'http://future-pos.dev',
    loading: null,
    rightDrawerView: 'product-menu',
    rightDrawerMenuShow: false,
    fontClass: {
      'myanmar-unicode-font': true
    },
    comments: [
      {
        label: 'အချိုလျှော့',
        value: 'အချိုလျှော့'
      },
      {
        label: 'အငန်လျှော့',
        value: 'အငန်လျှော့'
      },
      {
        label: 'ငရုတ်သီးမထည့်',
        value: 'ငရုတ်သီးမထည့်'
      },
      {
        label: 'အစပ်လျှော့',
        value: 'အစပ်လျှော့'
      }
    ]
  }
}

// initial state
const state = getDefaultState()

const getters = {
  isLoading (state) {
    return state.loading
  }
}

const actions = {
  changeRightDrawerView ({ commit }, viewName) {
    commit('CHANGE_RIGHT_DRAWER_VIEW', viewName)
  },
  setRightDrawerMenu ({ commit }, status) {
    commit('SET_RIGHT_DRAWER_MENU', status)
  },
  resetState: ({ commit }) => {
    commit('resetState')
  }
}

// mutations
const mutations = {
  resetState (state) {
    Object.assign(state, getDefaultState())
  },
  CHANGE_RIGHT_DRAWER_VIEW (state, viewName) {
    state.rightDrawerView = viewName
  },
  SET_RIGHT_DRAWER_MENU (state, status) {
    state.rightDrawerMenuShow = status
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
