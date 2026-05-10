import axios from "axios"

const api = axios.create({ baseURL: "/" })

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // TODO: Add your global error handling here (toast, logging, etc.)
    return Promise.reject(err)
  }
)

export default api
