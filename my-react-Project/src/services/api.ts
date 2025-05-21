import axios from "axios"

// Base API configuration
const API_CONFIG = {
  baseUrl:  "https://localhost:7234",
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
  // Get all songs
  getAllSongs: async () => {
    try {
      const response = await apiClient.get("/api/Auth/Song")
      return response.data
    } catch (error) {
      console.error("Error fetching songs:", error)
      throw error
    }
  },

  // Get song by ID
  getSongById: async (id: number) => {
    try {
      const response = await apiClient.get(`/api/Auth/Song/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching song with ID ${id}:`, error)
      throw error
    }
  },

  // Get songs by singer name
  getSongsBySinger: async (singerName: string) => {
    try {
      const response = await apiClient.get(`/api/Auth/Song/singer/${singerName}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching songs for singer ${singerName}:`, error)
      throw error
    }
  },

  // Add new song
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

  // Update existing song
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

  // Delete song
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
  // Get all singers
  getAllSingers: async () => {
    try {
      const response = await apiClient.get("/api/Auth/Singer")
      return response.data
    } catch (error) {
      console.error("Error fetching singers:", error)
      throw error
    }
  },

  // Get singer by ID
  getSingerById: async (id: number) => {
    try {
      const response = await apiClient.get(`/api/Auth/Singer/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching singer with ID ${id}:`, error)
      throw error
    }
  },

  // Add new singer
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

  // Update existing singer
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

  // Delete singer
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
  // Login
  login: async (email: string, password: string) => {
    try {
      const response = await apiClient.post("/api/Auth/login", { email, password })
      return response.data
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  },

  // Register
  register: async (userData: any) => {
    try {
      const response = await apiClient.post("/api/Auth/register", userData)
      return response.data
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  },

  // Get user profile
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

// Transcription API service
export const transcriptionAPI = {
  // Transcribe audio
  transcribeAudio: async (audioFile: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData()
    formData.append("audioFile", audioFile)

    try {
      const response = await axios.post("https://api.assemblyai.com/v2/upload", audioFile, {
        headers: {
          "Content-Type": "application/octet-stream",
          Authorization: process.env.NEXT_PUBLIC_ASSEMBLY_AI_KEY || "72956af2d493457a9a1dfdf5661522aa",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            onProgress(progress)
          }
        },
      })

      const uploadUrl = response.data.upload_url

      const transcriptResponse = await axios.post(
        "https://api.assemblyai.com/v2/transcript",
        {
          audio_url: uploadUrl,
          speech_model: "universal",
        },
        {
          headers: {
            Authorization: process.env.NEXT_PUBLIC_ASSEMBLY_AI_KEY || "72956af2d493457a9a1dfdf5661522aa",
            "Content-Type": "application/json",
          },
        }
      )

      return transcriptResponse.data
    } catch (error) {
      console.error("Transcription error:", error)
      throw error
    }
  },

  // Send email with transcription
  sendTranscriptionEmail: async (email: string, transcriptionText: string) => {
    try {
      const response = await apiClient.post("/api/Email/send", {
        to: email,
        subject: "Your Audio Transcription from Magical Music",
        body: `
          <html>
            <body>
              <h1>Your Audio Transcription</h1>
              <p>Here is the transcription of your audio recording:</p>
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p>${transcriptionText}</p>
              </div>
              <p>Thank you for using Magical Music!</p>
            </body>
          </html>
        `,
        isHtml: true,
      })
      return response.data
    } catch (error) {
      console.error("Email sending error:", error)
      throw error
    }
  },
}

// AI Chat API service
export const aiAPI = {
  // Send message to AI
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
  transcription: transcriptionAPI,
  ai: aiAPI,
}
