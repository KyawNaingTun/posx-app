import Vue from 'vue'
import axios from 'axios'
import {
  Notify,
  LocalStorage
} from 'quasar'
import { i18n } from 'boot/i18n'

const token = LocalStorage.getItem('accessToken')
const apiUrl = LocalStorage.getItem('serverApiUrl')

const axiosInstance = axios.create({
  baseURL: apiUrl || 'nourl',
  withCredentials: false, // This is the default
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: {
      toString () {
        return token ? `Bearer ${token}` : ''
      }
    }
  }
})

axiosInstance.interceptors.response.use((response) => {
  return response
}, (error) => {
  if (!error.response) {
    Notify.create(i18n.t('errors.network'))
  }
  return Promise.reject(error)
})

Vue.prototype.$axios = axiosInstance

export { axiosInstance }
