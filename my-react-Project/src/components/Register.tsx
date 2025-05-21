"use client"

import { useState, type FormEvent, type ChangeEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FileMusicIcon as MusicNote, User, Mail, KeyRound, Headphones, Music } from "lucide-react"
import "../styles/auth.css"
import axios from "axios"

interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

interface RegisterProps {
  setIsAuthenticated: (value: boolean) => void
}

const Register = ({ setIsAuthenticated }: RegisterProps) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    // Reset error message on input change
    if (error) setError("")
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      const response = await axios.post("https://localhost:7234/api/Auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })

      const data = response.data

      // Save token to localStorage if your API returns one on registration
      if (data.token) {
        localStorage.setItem("token", data.token)
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user))
        }

        // Update authentication state
        setIsAuthenticated(true)

        // Redirect to home page
        navigate("/")
      } else {
        // If no token is returned, redirect to login
        navigate("/login")
      }
    } catch (err) {
      // Improved error handling
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "An error occurred during registration")
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-background">
        {/* Animated musical notes and instruments */}
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
          <h1>Create Account</h1>
          <p>Join Magical Music today</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-with-icon">
              <User className="input-icon" size={18} />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
              />
            </div>
          </div>

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
                minLength={6}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-with-icon">
              <KeyRound className="input-icon" size={18} />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
                minLength={6}
              />
            </div>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
            <span className="button-glow"></span>
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
