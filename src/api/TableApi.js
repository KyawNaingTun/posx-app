import { axiosInstance } from 'boot/axios'

export default {
  getAll () {
    return axiosInstance.get('/api/table')
  },
  getAvailableTables () {
    return axiosInstance.get('/api/available/table')
  }

}
