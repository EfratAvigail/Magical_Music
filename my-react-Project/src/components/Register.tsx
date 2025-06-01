"use client"

import { useState, type FormEvent, type ChangeEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, Check, X, Music, Headphones, Mail, Lock, User, Star } from "lucide-react"
import "../styles/auth.css"
import axios from "axios"

interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  favoriteGenre?: string
  agreeToTerms: boolean
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
    favoriteGenre: "",
    agreeToTerms: false,
  })
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [registrationSuccess, setRegistrationSuccess] = useState<boolean>(false)
  const [passwordStrength, setPasswordStrength] = useState<number>(0)
  const [currentStep, setCurrentStep] = useState<number>(1)
  const navigate = useNavigate()

  const musicGenres = [
    "",
    "Pop",
    "Rock",
    "Hip Hop",
    "R&B",
    "Electronic",
    "Classical",
    "Jazz",
    "Country",
    "Folk",
    "חסידי",
    "מזרחי",
    "Other",
  ]

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined

    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }))

    if (error) setError("")

    // Check password strength when password field changes
    if (name === "password") {
      checkPasswordStrength(value)
    }
  }

  const checkPasswordStrength = (password: string) => {
    let strength = 0

    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1

    setPasswordStrength(strength)
  }

  const getPasswordStrengthLabel = () => {
    switch (passwordStrength) {
      case 0:
        return "Weak"
      case 1:
        return "Fair"
      case 2:
        return "Good"
      case 3:
        return "Strong"
      case 4:
        return "Very Strong"
      default:
        return ""
    }
  }

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
        return "#ff4d4d"
      case 1:
        return "#ffaa4d"
      case 2:
        return "#ffff4d"
      case 3:
        return "#4dff4d"
      case 4:
        return "#4d4dff"
      default:
        return ""
    }
  }

  const nextStep = () => {
    if (currentStep === 1) {
      if (!formData.name || !formData.email) {
        setError("Please fill in all required fields")
        return
      }
      if (!validateEmail(formData.email)) {
        setError("Please enter a valid email address")
        return
      }
    } else if (currentStep === 2) {
      if (!formData.password || !formData.confirmPassword) {
        setError("Please fill in all required fields")
        return
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        return
      }
      if (passwordStrength < 2) {
        setError("Please use a stronger password")
        return
      }
    }

    setError("")
    setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    setError("")
    setCurrentStep(currentStep - 1)
  }

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!formData.agreeToTerms) {
      setError("You must agree to the Terms of Service")
      setLoading(false)
      return
    }

    try {
      const response = await axios.post(`https://magical-music.onrender.com/api/Auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        favoriteGenre: formData.favoriteGenre || undefined,
      })

      const data = response.data

      // Send welcome email with enhanced design
      await sendWelcomeEmail()

      // Show success animation
      setRegistrationSuccess(true)

      // Store token and user data
      if (data.token) {
        localStorage.setItem("token", data.token)
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user))
        }

        // Wait for animation to complete before redirecting
        setTimeout(() => {
          setIsAuthenticated(true)
          navigate("/")
        }, 2000)
      } else {
        setTimeout(() => {
          navigate("/login")
        }, 2000)
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "An error occurred during registration")
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
      setLoading(false)
    }
  }

  const sendWelcomeEmail = async () => {
    try {
      const welcomeEmailHtml = `
        <html>
          <head>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
              
              body {
                font-family: 'Poppins', sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f9f9f9;
                color: #333;
              }
              
              .email-container {
                max-width: 600px;
                margin: 0 auto;
                background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
              }
              
              .email-header {
                padding: 40px 30px;
                text-align: center;
                position: relative;
              }
              
              .email-header h1 {
                color: white;
                font-size: 32px;
                margin: 0;
                font-weight: 700;
                letter-spacing: 1px;
              }
              
              .email-header p {
                color: rgba(255, 255, 255, 0.9);
                font-size: 18px;
                margin: 10px 0 0;
              }
              
              .floating-notes {
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                overflow: hidden;
                z-index: 0;
              }
              
              .note {
                position: absolute;
                color: rgba(255, 255, 255, 0.3);
                font-size: 24px;
                animation: float 10s infinite linear;
              }
              
              @keyframes float {
                0% {
                  transform: translateY(100%) rotate(0deg);
                  opacity: 0;
                }
                10% {
                  opacity: 1;
                }
                90% {
                  opacity: 1;
                }
                100% {
                  transform: translateY(-100%) rotate(360deg);
                  opacity: 0;
                }
              }
              
              .email-body {
                background: white;
                padding: 40px 30px;
                border-radius: 20px 20px 0 0;
                position: relative;
                z-index: 1;
              }
              
              .welcome-message {
                text-align: center;
                margin-bottom: 30px;
              }
              
              .welcome-message h2 {
                color: #6a11cb;
                font-size: 28px;
                margin: 0 0 15px;
              }
              
              .welcome-message p {
                color: #666;
                font-size: 16px;
                line-height: 1.6;
                margin: 0;
              }
              
              .features {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 20px;
                margin: 30px 0;
              }
              
              .feature {
                background: #f5f7ff;
                border-radius: 12px;
                padding: 20px;
                width: calc(50% - 30px);
                box-sizing: border-box;
                text-align: center;
              }
              
              .feature-icon {
                background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
                width: 50px;
                height: 50px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 15px;
                color: white;
                font-size: 24px;
              }
              
              .feature h3 {
                color: #333;
                font-size: 18px;
                margin: 0 0 10px;
              }
              
              .feature p {
                color: #666;
                font-size: 14px;
                margin: 0;
                line-height: 1.4;
              }
              
              .cta-button {
                display: block;
                background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
                color: white;
                text-decoration: none;
                text-align: center;
                padding: 15px 30px;
                border-radius: 30px;
                font-weight: 600;
                font-size: 16px;
                margin: 30px auto;
                width: 200px;
                transition: all 0.3s ease;
              }
              
              .cta-button:hover {
                transform: translateY(-3px);
                box-shadow: 0 5px 15px rgba(106, 17, 203, 0.4);
              }
              
              .email-footer {
                background: rgba(0, 0, 0, 0.05);
                padding: 20px;
                text-align: center;
              }
              
              .social-links {
                display: flex;
                justify-content: center;
                gap: 15px;
                margin-bottom: 15px;
              }
              
              .social-link {
                width: 36px;
                height: 36px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                text-decoration: none;
                font-size: 18px;
                transition: all 0.3s ease;
              }
              
              .social-link:hover {
                background: white;
                color: #6a11cb;
              }
              
              .footer-text {
                color: rgba(255, 255, 255, 0.7);
                font-size: 14px;
                margin: 0;
              }
              
              .footer-links {
                margin-top: 10px;
              }
              
              .footer-links a {
                color: rgba(255, 255, 255, 0.9);
                text-decoration: none;
                margin: 0 10px;
                font-size: 14px;
              }
              
              .footer-links a:hover {
                text-decoration: underline;
              }
              
              @media (max-width: 600px) {
                .feature {
                  width: 100%;
                }
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="email-header">
                <div class="floating-notes">
                  <div class="note" style="top: 20%; left: 10%;">♪</div>
                  <div class="note" style="top: 30%; left: 20%;">♫</div>
                  <div class="note" style="top: 50%; left: 15%;">♩</div>
                  <div class="note" style="top: 70%; left: 25%;">♬</div>
                  <div class="note" style="top: 40%; left: 80%;">♪</div>
                  <div class="note" style="top: 60%; left: 70%;">♫</div>
                  <div class="note" style="top: 80%; left: 85%;">♩</div>
                </div>
                <h1>Welcome to Magical Music!</h1>
                <p>Your musical journey begins now</p>
              </div>
              
              <div class="email-body">
                <div class="welcome-message">
                  <h2>Hello ${formData.name}!</h2>
                  <p>Thank you for joining our musical community. We're excited to have you on board and can't wait for you to explore all the amazing features we have to offer.</p>
                </div>
                
                <div class="features">
                  <div class="feature">
                    <div class="feature-icon">🎵</div>
                    <h3>Discover Music</h3>
                    <p>Explore thousands of songs across different genres and find your next favorite track.</p>
                  </div>
                  
                  <div class="feature">
                    <div class="feature-icon">🎤</div>
                    <h3>Karaoke Mode</h3>
                    <p>Sing along with synchronized lyrics to your favorite songs.</p>
                  </div>
                  
                  <div class="feature">
                    <div class="feature-icon">✂️</div>
                    <h3>Cut Songs</h3>
                    <p>Create custom clips and ringtones from your favorite music.</p>
                  </div>
                  
                  <div class="feature">
                    <div class="feature-icon">🔊</div>
                    <h3>High Quality</h3>
                    <p>Enjoy crystal clear audio with our premium sound quality.</p>
                  </div>
                </div>
                
                <a href="https://magical-music.onrender.com" class="cta-button">Start Listening Now</a>
              </div>
              
              <div class="email-footer">
                <div class="social-links">
                  <a href="#" class="social-link">f</a>
                  <a href="#" class="social-link">t</a>
                  <a href="#" class="social-link">in</a>
                  <a href="#" class="social-link">ig</a>
                </div>
                
                <p class="footer-text">© 2023 Magical Music. All rights reserved.</p>
                
                <div class="footer-links">
                  <a href="#">Privacy Policy</a>
                  <a href="#">Terms of Service</a>
                  <a href="#">Contact Us</a>
                </div>
              </div>
            </div>
          </body>
        </html>
      `

      await axios.post(`https://magical-music.onrender.com/api/Email/send`, {
        to: formData.email,
        subject: "Welcome to Magical Music!",
        body: welcomeEmailHtml,
      })
    } catch (error) {
      console.error("Error sending welcome email:", error)
      // Continue with registration even if email fails
    }
  }

  const renderStepIndicator = () => {
    return (
      <div className="step-indicator">
        <div className={`step ${currentStep >= 1 ? "active" : ""}`}>
          <div className="step-number">{currentStep > 1 ? <Check size={16} /> : "1"}</div>
          <span className="step-label">Account</span>
        </div>
        <div className="step-line"></div>
        <div className={`step ${currentStep >= 2 ? "active" : ""}`}>
          <div className="step-number">{currentStep > 2 ? <Check size={16} /> : "2"}</div>
          <span className="step-label">Security</span>
        </div>
        <div className="step-line"></div>
        <div className={`step ${currentStep >= 3 ? "active" : ""}`}>
          <div className="step-number">3</div>
          <span className="step-label">Preferences</span>
        </div>
      </div>
    )
  }

  if (registrationSuccess) {
    return (
      <div className="auth-container">
        <div className="auth-success-animation">
          <div className="success-icon">
            <Check size={40} />
          </div>
          <h2>Registration Successful!</h2>
          <p>Welcome to Magical Music, {formData.name}!</p>
          <p>Redirecting you to the app...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <div className="auth-header">
          <div className="auth-logo">
            <Headphones size={28} />
          </div>
          <h2>Create Your Account</h2>
          <p>Join Magical Music and start your musical journey</p>
        </div>

        {renderStepIndicator()}

        <form onSubmit={handleSubmit} className="auth-form">
          {currentStep === 1 && (
            <div className="auth-step">
              <div className="form-group">
                <label htmlFor="name">
                  <User size={18} />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <Mail size={18} />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" className="next-button" onClick={nextStep}>
                  Next
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="auth-step">
              <div className="form-group">
                <label htmlFor="password">
                  <Lock size={18} />
                  <span>Password</span>
                </label>
                <div className="password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    required
                  />
                  <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formData.password && (
                  <div className="password-strength">
                    <div className="strength-meter">
                      <div
                        className="strength-value"
                        style={{
                          width: `${(passwordStrength / 4) * 100}%`,
                          backgroundColor: getPasswordStrengthColor(),
                        }}
                      ></div>
                    </div>
                    <span className="strength-label" style={{ color: getPasswordStrengthColor() }}>
                      {getPasswordStrengthLabel()}
                    </span>
                  </div>
                )}
                <div className="password-requirements">
                  <p>Password must contain:</p>
                  <ul>
                    <li className={formData.password.length >= 8 ? "met" : ""}>
                      {formData.password.length >= 8 ? <Check size={12} /> : <X size={12} />}
                      <span>At least 8 characters</span>
                    </li>
                    <li className={/[A-Z]/.test(formData.password) ? "met" : ""}>
                      {/[A-Z]/.test(formData.password) ? <Check size={12} /> : <X size={12} />}
                      <span>At least one uppercase letter</span>
                    </li>
                    <li className={/[0-9]/.test(formData.password) ? "met" : ""}>
                      {/[0-9]/.test(formData.password) ? <Check size={12} /> : <X size={12} />}
                      <span>At least one number</span>
                    </li>
                    <li className={/[^A-Za-z0-9]/.test(formData.password) ? "met" : ""}>
                      {/[^A-Za-z0-9]/.test(formData.password) ? <Check size={12} /> : <X size={12} />}
                      <span>At least one special character</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">
                  <Lock size={18} />
                  <span>Confirm Password</span>
                </label>
                <div className="password-input">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formData.password && formData.confirmPassword && (
                  <div
                    className={`password-match ${
                      formData.password === formData.confirmPassword ? "match" : "no-match"
                    }`}
                  >
                    {formData.password === formData.confirmPassword ? (
                      <>
                        <Check size={14} />
                        <span>Passwords match</span>
                      </>
                    ) : (
                      <>
                        <X size={14} />
                        <span>Passwords don't match</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="button" className="back-button" onClick={prevStep}>
                  Back
                </button>
                <button type="button" className="next-button" onClick={nextStep}>
                  Next
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="auth-step">
              <div className="form-group">
                <label htmlFor="favoriteGenre">
                  <Music size={18} />
                  <span>Favorite Music Genre (Optional)</span>
                </label>
                <select id="favoriteGenre" name="favoriteGenre" value={formData.favoriteGenre} onChange={handleChange}>
                  <option value="">Select your favorite genre</option>
                  {musicGenres.slice(1).map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    required
                  />
                  <span>
                    I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                  </span>
                </label>
              </div>

              {error && (
                <div className="error-message">
                  <X size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div className="form-actions">
                <button type="button" className="back-button" onClick={prevStep}>
                  Back
                </button>
                <button type="submit" className="register-button" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="spinner"></div>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <Star size={18} />
                      <span>Complete Registration</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <a href="/login">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
