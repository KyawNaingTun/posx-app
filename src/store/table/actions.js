import TableApi from '../../api/TableApi'

export function getAllTables ({ commit, state }) {
  TableApi
    .getAll()
    .then(response => {
      commit('setTable', { tables: response.data.data })
      console.log(response.data.data)
    })
    .catch(error => {
      console.log(error)
    })
}
