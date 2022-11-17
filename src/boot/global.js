import numFormat from 'vue-filter-number-format'
import qbtn from '../components/quantity-input'

// "async" is optional
export default async ({ Vue }) => {
  Vue.filter('numFormat', numFormat)
  Vue.component('qty-btn', qbtn)
}
