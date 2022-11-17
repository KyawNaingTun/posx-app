import { axiosInstance } from 'boot/axios'

export default {
  getProducts () {
    return axiosInstance.get('/api/dish')
  },
  getProductDetail (id) {
    return axiosInstance.get('/api/dish/' + id)
  },
  getDishType (id) {
    return axiosInstance.get('/api/dish/' + id + '/type')
  },
  getCategory () {
    return axiosInstance.get('/api/category')
  },
  getProductByCategory (id) {
    return axiosInstance.get('/api/dish/by/category/' + id)
  }
}
