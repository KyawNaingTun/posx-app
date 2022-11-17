import { axiosInstance } from 'boot/axios'
import {
  LocalStorage
} from 'quasar'

export default {
  login (credentials) {
    return new Promise((resolve, reject) => {
      axiosInstance.post('/api/login', credentials)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getLoggedinUser () {
    const userStr = LocalStorage.getItem('user')

    if (!userStr) {
      return null
    }

    return JSON.parse(userStr)
  }
}
