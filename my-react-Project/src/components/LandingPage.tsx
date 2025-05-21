"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Headphones,
  Music,
  FileText,
  Scissors,
  Share2,
  Search,
  ChevronRight,
  Play,
  ArrowRight,
  CheckCircle,
} from "lucide-react"
import "../styles/landing.css"

const LandingPage = () => {
  const [activeFeature, setActiveFeature] = useState<number>(0)

  const features = [
    {
      title: "Music Library",
      description: "Organize and enjoy your personal music collection with our intuitive interface.",
      icon: <Music size={32} />,
      color: "from-purple-500 to-indigo-600",
    },
    {
      title: "AI Transcription",
      description: "Convert any song or audio to text with our advanced AI technology.",
      icon: <FileText size={32} />,
      color: "from-blue-500 to-cyan-600",
    },
    {
      title: "Audio Editing",
      description: "Cut and edit your songs with precision using our visual waveform editor.",
      icon: <Scissors size={32} />,
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Easy Sharing",
      description: "Share your favorite music with friends via email or shareable links.",
      icon: <Share2 size={32} />,
      color: "from-rose-500 to-pink-600",
    },
    {
      title: "Music Discovery",
      description: "Search and discover new music across multiple platforms in one place.",
      icon: <Search size={32} />,
      color: "from-amber-500 to-orange-600",
    },
  ]

  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Music Producer",
      content:
        "Magical Music has transformed how I organize and share my music projects. The transcription feature saves me hours of work!",
      avatar: "/placeholder.svg?height=60&width=60&text=AJ",
    },
    {
      name: "Sarah Williams",
      role: "Podcast Host",
      content: "The audio editing tools are intuitive and powerful. I use it daily for my podcast editing needs.",
      avatar: "/placeholder.svg?height=60&width=60&text=SW",
    },
    {
      name: "Michael Chen",
      role: "Music Enthusiast",
      content:
        "I've discovered so many new artists through the search feature. The UI is beautiful and easy to navigate.",
      avatar: "/placeholder.svg?height=60&width=60&text=MC",
    },
  ]

  return (
    <div className="landing-container">
      <div className="landing-background">
        {/* Animated musical elements */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`floating-element note-${i % 5}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          >
            {i % 3 === 0 ? (
              <Music size={15 + Math.random() * 25} color={`hsl(${Math.random() * 360}, 80%, 60%)`} />
            ) : i % 3 === 1 ? (
              <Headphones size={15 + Math.random() * 25} color={`hsl(${Math.random() * 360}, 80%, 60%)`} />
            ) : (
              <FileText size={15 + Math.random() * 25} color={`hsl(${Math.random() * 360}, 80%, 60%)`} />
            )}
          </div>
        ))}
      </div>

      <header className="landing-header">
        <div className="logo">
          <div className="logo-circle">
            <Headphones size={24} />
          </div>
          <h1>Magical Music</h1>
        </div>
        <nav className="landing-nav">
          <a href="#features" className="nav-link">
            Features
          </a>
          <a href="#how-it-works" className="nav-link">
            How It Works
          </a>
          <a href="#testimonials" className="nav-link">
            Testimonials
          </a>
          <Link to="/login" className="nav-link login-link">
            Login
          </Link>
          <Link to="/register" className="nav-button">
            Get Started
          </Link>
        </nav>
      </header>

      <main className="landing-main">
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Your Music, <span className="text-gradient">Reimagined</span>
            </h1>
            <p className="hero-description">
              Discover a new way to organize, edit, and share your music. Magical Music brings powerful tools and a
              beautiful interface to your music experience.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="primary-button">
                Start Free <ArrowRight size={18} />
              </Link>
              <a href="#features" className="secondary-button">
                Explore Features
              </a>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Users</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">5M+</span>
                <span className="stat-label">Songs Processed</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">4.9</span>
                <span className="stat-label">User Rating</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <div className="app-preview">
              <div className="app-preview-header">
                <div className="app-preview-controls">
                  <span className="control red"></span>
                  <span className="control yellow"></span>
                  <span className="control green"></span>
                </div>
                <div className="app-preview-title">Magical Music</div>
              </div>
              <div className="app-preview-content">
                <div className="preview-player">
                  <div className="preview-album-art">
                    <img src="/placeholder.svg?height=120&width=120" alt="Album art" />
                    <div className="preview-play-button">
                      <Play size={24} />
                    </div>
                  </div>
                  <div className="preview-song-info">
                    <h3>Summer Vibes</h3>
                    <p>Electronic • 3:45</p>
                    <div className="preview-progress">
                      <div className="preview-progress-bar"></div>
                    </div>
                    <div className="preview-controls">
                      <div className="preview-control-button"></div>
                      <div className="preview-control-button large"></div>
                      <div className="preview-control-button"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="features-section">
          <div className="section-header">
            <h2>Powerful Features</h2>
            <p>Everything you need to enhance your music experience in one place.</p>
          </div>

          <div className="features-container">
            <div className="features-list">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`feature-item ${activeFeature === index ? "active" : ""}`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className={`feature-icon bg-gradient-to-r ${feature.color}`}>{feature.icon}</div>
                  <div className="feature-text">
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                  <ChevronRight size={20} className="feature-arrow" />
                </div>
              ))}
            </div>

            <div className="feature-showcase">
              <div className="feature-image">
                <img
                  src={`/placeholder.svg?height=400&width=500&text=Feature+${activeFeature + 1}`}
                  alt={features[activeFeature].title}
                />
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="how-it-works-section">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Get started with Magical Music in three simple steps.</p>
          </div>

          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Create Your Account</h3>
                <p>Sign up for free and set up your personal music profile.</p>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Upload Your Music</h3>
                <p>Add your favorite songs or connect to your existing music library.</p>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Enjoy & Create</h3>
                <p>Listen, edit, transcribe, and share your music with powerful tools.</p>
              </div>
            </div>
          </div>

          <div className="cta-container">
            <h3>Ready to transform your music experience?</h3>
            <Link to="/register" className="primary-button">
              Get Started Now
            </Link>
          </div>
        </section>

        <section id="testimonials" className="testimonials-section">
          <div className="section-header">
            <h2>What Our Users Say</h2>
            <p>Join thousands of satisfied music lovers using Magical Music.</p>
          </div>

          <div className="testimonials-container">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-content">
                  <p>"{testimonial.content}"</p>
                </div>
                <div className="testimonial-author">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="testimonial-avatar"
                  />
                  <div className="testimonial-info">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="features-grid">
          <div className="section-header">
            <h2>Everything You Need</h2>
            <p>Explore all the features that make Magical Music special.</p>
          </div>

          <div className="grid-container">
            <div className="grid-item">
              <Music size={24} />
              <h3>Smart Playlists</h3>
              <p>Automatically create playlists based on your listening habits.</p>
            </div>
            <div className="grid-item">
              <FileText size={24} />
              <h3>Lyrics & Transcription</h3>
              <p>Get accurate lyrics and transcriptions for any song.</p>
            </div>
            <div className="grid-item">
              <Scissors size={24} />
              <h3>Audio Editing</h3>
              <p>Cut, trim, and edit your songs with precision.</p>
            </div>
            <div className="grid-item">
              <Share2 size={24} />
              <h3>Easy Sharing</h3>
              <p>Share your music with friends via email or links.</p>
            </div>
            <div className="grid-item">
              <Search size={24} />
              <h3>Music Discovery</h3>
              <p>Find new music across multiple platforms.</p>
            </div>
            <div className="grid-item">
              <CheckCircle size={24} />
              <h3>Cloud Sync</h3>
              <p>Access your music from any device, anywhere.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <div className="logo-circle">
              <Headphones size={24} />
            </div>
            <h2>Magical Music</h2>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h3>Product</h3>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#testimonials">Testimonials</a>
              <a href="#">Pricing</a>
            </div>
            <div className="footer-column">
              <h3>Resources</h3>
              <a href="#">Documentation</a>
              <a href="#">API</a>
              <a href="#">Guides</a>
              <a href="#">Support</a>
            </div>
            <div className="footer-column">
              <h3>Company</h3>
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Blog</a>
              <a href="#">Contact</a>
            </div>
            <div className="footer-column">
              <h3>Legal</h3>
              <a href="#">Terms</a>
              <a href="#">Privacy</a>
              <a href="#">Cookies</a>
              <a href="#">Licenses</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Magical Music. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
