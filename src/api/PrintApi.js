import { axiosInstance } from 'boot/axios'

export default {
  postPrint (formData) {
    // return apiClient.get('/api/test-print')
    return axiosInstance.post('/api/print/receipt', formData)
  }
}
