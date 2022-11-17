import { Loading } from 'quasar'
import Vue from 'vue'
import * as Notification from '../../helpers/notification'
// import ProductApi from '../../api/ProductApi'
import OrderApi from '../../api/OrderApi'

// define default staet
const getDefaultState = () => {
  return {
    currentOrderNo: null,
    tableId: null, // for server
    tableNo: null, // for print
    paymentMethod: null,
    changeAmount: null,
    status: 'eating',
    type: 'table',
    tax: 5 / 100,
    items: [],
    checkoutStatus: null,
    cartItemDetailForm: [],
    cartItemHoverIndex: null
  }
}

// initial state
const state = getDefaultState()

// getters
const getters = {
  cartProducts: (state, getters, rootState) => {
    return state.items
  },

  cartItemDetailForm: (state, getters, rootState) => {
    return state.cartItemDetailForm
  },

  subTotal: (state, getters) => {
    return getters.cartProducts.reduce((total, product) => {
      return total + product.total_price
    }, 0)
  },

  taxAmount: (state, getters) => {
    return getters.cartProducts.reduce((total, product) => {
      return getters.subTotal * state.tax
    }, 0)
  },

  grandTotal: (state, getters) => {
    return getters.cartProducts.reduce((total, product) => {
      return getters.subTotal + getters.taxAmount
    }, 0)
  }
}

// actions
const actions = {
  checkout ({ commit, state, getters }) {
    commit('setCheckoutStatus', null)

    const formData = {
      table_id: state.tableId,
      payment_method: state.paymentMethod,
      change_amount: state.changeAmount,
      status: state.status,
      type: state.paymentType,
      tax_amount: getters.taxAmount,
      sub_total: getters.subTotal,
      grand_total: getters.grandTotal,
      items: state.items
    }

    Loading.show() // api loading start

    OrderApi
      .postCheckout(formData)
      .then(response => {
        commit('setCheckoutStatus', 'successful')
        console.log(response.data.data)
        // empty cart
        commit('setCartItems', { items: [] })
        commit('setOrderNumber', response.data.data.order_no)

        Loading.hide()
        Notification.successNoti(response.data.message)
      })
      .catch(error => {
        commit('setCheckoutStatus', 'failed')
        console.log(error)
        Loading.hide()
        Notification.errorNoti(error.data.message)
      })
  },

  addProductToCart ({ state, commit, rootState }, product) {
    commit('setCheckoutStatus', null)

    var data = []
    product.dish_prices.map(form => {
      if (form.check === true) {
        data.push({
          thumbnail: product.thumbnail,
          name: product.dish,
          label: form.label,
          comment: form.comment,
          dish_id: product.id,
          dish_price_id: form.value,
          unit_price: form.price,
          total_price: form.price * form.qty,
          qty: form.qty
        })
      }
    })
    console.log('data array', data)
    data.map(formArr => {
      // checking already cart item
      const cartItem = state.items.find(item => item.dish_price_id === formArr.dish_price_id)
      if (!cartItem) {
        commit('pushProductToCart', { item: formArr })
      } else {
        commit('incrementItemQuantity', { id: cartItem.dish_price_id, qty: formArr.qty })
      }
    })
    // clean products state
  },
  updateCartItem ({ commit }, form) {
    // console.log('update cart item', form)
    commit('updateCartItem', form)
  },

  quantityChange ({ commit }, { id, qty }) {
    commit('changeQuantity', { id: id, qty: qty })
  },

  getCartItemDetail ({ commit }, id) {
    commit('setCartItemDetailForm', id)
  },

  deleteCartItem ({ commit }, id) {
    commit('deleteCartItem', id)
  },

  updateCarItemHoverIndex: ({ commit }, index) => {
    console.log('received from action', index)
    commit('updateCarItemHoverIndex', index)
  },

  setTableInfoForCart: ({ commit }, tableInfo) => {
    commit('setTable', tableInfo)
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

  pushProductToCart (state, { item }) {
    state.items.push(item)
  },

  incrementItemQuantity (state, { id, qty }) {
    const cartItem = state.items.find(item => item.dish_price_id === id)
    cartItem.qty += qty
    cartItem.total_price = cartItem.total_price + (cartItem.unit_price * qty)
  },

  changeQuantity (state, { id, qty }) {
    const cartItem = state.items.find(item => item.dish_price_id === id)
    cartItem.qty = qty
    cartItem.total_price = cartItem.unit_price * qty
  },

  setCartItemDetailForm (state, id) {
    const cartItem = state.items.find(item => item.dish_price_id === id)
    state.cartItemDetailForm = Object.assign({}, cartItem)// used Object.assign() to clear state object relation
  },

  updateCartItem (state, form) {
    const foundCartItemIndex = state.items.findIndex(item => item.dish_price_id === form.dish_price_id)
    Vue.set(state.items, foundCartItemIndex, form)
  },

  setCartItems (state, { items }) {
    state.items = items
  },

  setCheckoutStatus (state, status) {
    state.checkoutStatus = status
  },

  setOrderNumber (state, number) {
    state.currentOrderNo = number
  },

  setTable (state, { id, no }) {
    state.tableId = id
    state.tableNo = no
  },

  deleteCartItem (state, id) {
    const cartItem = state.items.findIndex(item => item.dish_price_id === id)
    state.items.splice(cartItem, 1)
  },

  updateCarItemHoverIndex (state, index) {
    state.cartItemHoverIndex = index
  }

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
