import axios from 'axios'

export const saveMission = data => {
  return axios
    .post('http://localhost:5000/missions/create', data)
    .then(response => {
        return response
    })
    .catch(err => {
        return err
    })
}
