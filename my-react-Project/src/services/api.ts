import axios from "axios"

// Base API configuration
const API_CONFIG = {
  baseUrl: "https://magical-music.onrender.com",
}

// Set API_CONFIG globally for components to access
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
    try {
      const response = await apiClient.get("/api/Auth/Song")
      return response.data
    } catch (error) {
      console.error("Error fetching songs:", error)
      throw error
    }
  },

  getSongById: async (id: number) => {
    try {
      const response = await apiClient.get(`/api/Auth/Song/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching song with ID ${id}:`, error)
      throw error
    }
  },

  getSongsBySinger: async (singerName: string) => {
    try {
      const response = await apiClient.get(`/api/Auth/Song/singer/${singerName}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching songs for singer ${singerName}:`, error)
      throw error
    }
  },

  addSong: async (songData: FormData) => {
    try {
      const response = await apiClient.post("/api/Auth/Song", songData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data
    } catch (error) {
      console.error("Error adding song:", error)
      throw error
    }
  },

  updateSong: async (id: number, songData: FormData) => {
    try {
      const response = await apiClient.put(`/api/Auth/Song/${id}`, songData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data
    } catch (error) {
      console.error(`Error updating song with ID ${id}:`, error)
      throw error
    }
  },

  deleteSong: async (id: number) => {
    try {
      const response = await apiClient.delete(`/api/Auth/Song/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error deleting song with ID ${id}:`, error)
      throw error
    }
  },
}

// Singer API service
export const singerAPI = {
  getAllSingers: async () => {
    try {
      const response = await apiClient.get("/api/Auth/Singer")
      return response.data
    } catch (error) {
      console.error("Error fetching singers:", error)
      throw error
    }
  },

  getSingerById: async (id: number) => {
    try {
      const response = await apiClient.get(`/api/Auth/Singer/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching singer with ID ${id}:`, error)
      throw error
    }
  },

  addSinger: async (singerData: FormData) => {
    try {
      const response = await apiClient.post("/api/Auth/Singer", singerData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data
    } catch (error) {
      console.error("Error adding singer:", error)
      throw error
    }
  },

  updateSinger: async (id: number, singerData: FormData) => {
    try {
      const response = await apiClient.put(`/api/Auth/Singer/${id}`, singerData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data
    } catch (error) {
      console.error(`Error updating singer with ID ${id}:`, error)
      throw error
    }
  },

  deleteSinger: async (id: number) => {
    try {
      const response = await apiClient.delete(`/api/Auth/Singer/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error deleting singer with ID ${id}:`, error)
      throw error
    }
  },
}

// Authentication API service
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await apiClient.post("/api/Auth/login", { email, password })
      return response.data
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  },

  register: async (userData: any) => {
    try {
      const response = await apiClient.post("/api/Auth/register", userData)
      return response.data
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  },

  getProfile: async () => {
    try {
      const response = await apiClient.get("/api/Auth/profile")
      return response.data
    } catch (error) {
      console.error("Error fetching profile:", error)
      throw error
    }
  },
}

// AI Chat API service
export const aiAPI = {
  sendMessage: async (messages: Array<{ role: string; content: string }>) => {
    try {
      const response = await apiClient.post("/api/ai/chat", { messages })
      return response.data
    } catch (error) {
      console.error("AI chat error:", error)
      throw error
    }
  },
}

export default {
  song: songAPI,
  singer: singerAPI,
  auth: authAPI,
  ai: aiAPI,
}
