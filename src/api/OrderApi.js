import { axiosInstance } from 'boot/axios'

export default {
  postCreate (formData) {
    // return apiClient.get('/api/test-print')
    return axiosInstance.post('/api/order/store', formData)
  },
  postUpdate (formData) {
    return axiosInstance.post('/api/order/update', formData)
  },
  postPaid (formData) {
    // return axiosInstance.get('/api/test-print')
    return axiosInstance.post('/api/order/paid', formData)
  },
  changeTable (formData) {
    return axiosInstance.post('/api/order/change/table', formData)
  },
  getDetail (id) {
    // return axiosInstance.get('/api/test-print')
    return axiosInstance.get('/api/order/' + id + '/detail')
  }
}
