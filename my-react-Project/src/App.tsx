"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Home from "./components/Home"
import Login from "./components/Login"
import Register from "./components/Register"
import LandingPage from "./components/LandingPage"
import ErrorBoundary from "./components/ErrorBoundary"
import UploadSong from "./components/UploadSong" // Import the UploadSong component

// Define types for authentication
interface User {
  id: number
  name: string
  email: string
  role: string
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token")
    if (token && token !== "undefined" && token !== "null") {
      setIsAuthenticated(true)
    } else {
      // Clear any invalid tokens
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      setIsAuthenticated(false)
    }
    setIsLoading(false)
  }, [])

  // Add console logging to help diagnose issues
  console.log("Authentication state:", { isAuthenticated, isLoading })

  // Add error boundary to catch rendering errors
  window.addEventListener("error", (event) => {
    console.error("Global error caught:", event.error)
  })

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loader">
          <div className="loader-icon"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <Register setIsAuthenticated={setIsAuthenticated} />
            }
          />

          {/* Protected routes */}
          <Route
            path="/dashboard/*"
            element={isAuthenticated ? <Home setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />}
          />
          <Route
            path="/dashboard/upload"
            element={isAuthenticated ? <UploadSong /> : <Navigate to="/login" />} // Added UploadSong route
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

export default App
