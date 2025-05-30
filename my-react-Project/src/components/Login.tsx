"use client"

import { useState, type FormEvent, type ChangeEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FileMusicIcon as MusicNote, KeyRound, Mail, Headphones, Music } from "lucide-react"
import "../styles/auth.css"
import axios from "axios"

interface LoginFormData {
  email: string
  password: string
}

interface LoginProps {
  setIsAuthenticated: (value: boolean) => void
}

const Login = ({ setIsAuthenticated }: LoginProps) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")



    try {
      const response = await axios.post(`https://magical-music.onrender.com/api/Auth/login`, {
        email: formData.email,
        password: formData.password,
      })

      const data = response.data

      localStorage.setItem("token", data.token || "")
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user))
      }

      setIsAuthenticated(true)
      navigate("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-background">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`floating-element note-${i % 5}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            {i % 3 === 0 ? (
              <MusicNote size={20 + Math.random() * 30} color={`hsl(${Math.random() * 360}, 80%, 60%)`} />
            ) : i % 3 === 1 ? (
              <Headphones size={20 + Math.random() * 30} color={`hsl(${Math.random() * 360}, 80%, 60%)`} />
            ) : (
              <Music size={20 + Math.random() * 30} color={`hsl(${Math.random() * 360}, 80%, 60%)`} />
            )}
          </div>
        ))}
      </div>

      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-circle">
            <Headphones size={32} />
          </div>
          <h2>Magical Music</h2>
        </div>

        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to continue to your music experience</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <KeyRound className="input-icon" size={18} />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
            <span className="button-glow"></span>
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="auth-link">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
