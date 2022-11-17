import axios from 'axios'
const apiClient = axios.create(
  {
    baseURL: `http://future-pos.test`,
    withCredentials: false, // This is the default
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }
)

export default {
  getAllTables () {
    return apiClient.get('/api/tables')
  },
  getAll () {
    return apiClient.get('/api/dish')
  },
  getDishDetail (id) {
    return apiClient.get('/api/dish/' + id)
  },
  getDishType (id) {
    return apiClient.get('/api/dish/' + id + '/type')
  }
}
