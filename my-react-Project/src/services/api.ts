import axios from "axios"

// Detect environment
const API_BASE_URL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_API_BASE_URL
    : ""

// Base API configuration
const API_CONFIG = {
  baseUrl: API_BASE_URL,
}

// Set API_CONFIG globally for components to access (optional)
if (typeof window !== "undefined") {
  ;(window as any).API_CONFIG = API_CONFIG
}

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_CONFIG.baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Song API service
export const songAPI = {
  getAllSongs: async () => {
    const response = await apiClient.get("/api/Auth/Song")
    return response.data
  },

  getSongById: async (id: number) => {
    const response = await apiClient.get(`/api/Auth/Song/${id}`)
    return response.data
  },

  getSongsBySinger: async (singerName: string) => {
    const response = await apiClient.get(`/api/Auth/Song/singer/${singerName}`)
    return response.data
  },

  addSong: async (songData: FormData) => {
    const response = await apiClient.post("/api/Auth/Song", songData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  updateSong: async (id: number, songData: FormData) => {
    const response = await apiClient.put(`/api/Auth/Song/${id}`, songData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  deleteSong: async (id: number) => {
    const response = await apiClient.delete(`/api/Auth/Song/${id}`)
    return response.data
  },
}

// Singer API service
export const singerAPI = {
  getAllSingers: async () => {
    const response = await apiClient.get("/api/Auth/Singer")
    return response.data
  },

  getSingerById: async (id: number) => {
    const response = await apiClient.get(`/api/Auth/Singer/${id}`)
    return response.data
  },

  addSinger: async (singerData: FormData) => {
    const response = await apiClient.post("/api/Auth/Singer", singerData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  updateSinger: async (id: number, singerData: FormData) => {
    const response = await apiClient.put(`/api/Auth/Singer/${id}`, singerData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  deleteSinger: async (id: number) => {
    const response = await apiClient.delete(`/api/Auth/Singer/${id}`)
    return response.data
  },
}

// Authentication API service
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post("/api/Auth/login", { email, password })
    return response.data
  },

  register: async (userData: any) => {
    const response = await apiClient.post("/api/Auth/register", userData)
    return response.data
  },

  getProfile: async () => {
    const response = await apiClient.get("/api/Auth/profile")
    return response.data
  },
}

// AI Chat API service
export const aiAPI = {
  sendMessage: async (messages: Array<{ role: string; content: string }>) => {
    const response = await apiClient.post("/api/ai/chat", { messages })
    return response.data
  },
}

export default {
  song: songAPI,
  singer: singerAPI,
  auth: authAPI,
  ai: aiAPI,
}
