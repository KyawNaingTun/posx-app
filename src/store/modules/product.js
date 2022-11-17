import ProductApi from '../../api/ProductApi'

// define default state
const getDefaultState = () => {
  return {
    all: [],
    selectedProduct: {},
    categories: []
  }
}

// initial state
const state = getDefaultState()

// getters
const getters = {
  getProductDetail: (state, getters, rootState) => {
    return state.selectedProduct
  }
}

// actions
const actions = {
  getAllProducts ({ commit }) {
    ProductApi
      .getProducts()
      .then(response => {
        commit('setProducts', response.data.data)
        console.log(response.data.data)
      })
      .catch(error => {
        console.log(error)
      })
  },
  getAllCategories ({ commit }) {
    ProductApi
      .getCategory()
      .then(response => {
        const categories = response.data.data.map((category, index) => ({
          label: category.name,
          value: category.id
        }))
        commit('setCategory', categories)
      })
      .catch(error => {
        console.log(error)
      })
  },
  getProductDetail ({ commit }, itemId) {
    commit('getProductDetail', { id: itemId })
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
  setProducts (state, products) {
    state.all = products
  },

  setCategory (state, category) {
    state.categories = category
  },

  getProductDetail: (state, { id }) => {
    const product = state.all.find(product => product.id === id)
    // state.productDetailForm = null
    state.selectedProduct = {
      id: product.id,
      dish: product.dish,
      thumbnail: product.thumbnail,
      dish_prices: []
    }

    const select = product.dish_prices.map((dis, index) => ({
      label: dis.dish_type,
      price: dis.price,
      value: dis.id,
      comment: [],
      qty: 1,
      check: index === 0
    }))

    state.selectedProduct.dish_prices = select
    // console.log('after added selected product', state.selectedProduct.dish_prices)
  },

  decrementProductInventory (state, { id }) {
    const product = state.all.find(product => product.id === id)
    product.inventory--
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
