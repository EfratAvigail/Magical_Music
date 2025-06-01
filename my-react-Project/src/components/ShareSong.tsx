"use client"

import type React from "react"

import { useState, useRef } from "react"
import {
  Share2,
  Mail,
  Copy,
  CheckCircle,
  LinkIcon,
  Music,
  Search,
  Facebook,
  Twitter,
  Instagram,
  Smartphone,
  Download,
  Headphones,
  Send,
  X,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react"
import type { Song } from "../types"
import axios from "axios"
import "../styles/sharesong.css"

interface ShareSongProps {
  songs: Song[]
}

const ShareSong = ({ songs }: ShareSongProps) => {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [shareLink, setShareLink] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"email" | "link" | "social">("email")
  const [showEmailPreview, setShowEmailPreview] = useState(false)
  const [emailTheme, setEmailTheme] = useState<"dark" | "light" | "colorful">("dark")
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [recipientName, setRecipientName] = useState("")
  const [senderName, setSenderName] = useState("")
  const [includeDownloadLink, setIncludeDownloadLink] = useState(true)
  const [includePlayButton, setIncludePlayButton] = useState(true)
  const [emailSent, setEmailSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const emailPreviewRef = useRef<HTMLDivElement>(null)

  const filteredSongs = songs.filter(
    (song) =>
      song.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (song.musicStyle ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (song.id !== undefined && song.id !== null ? String(song.id) : "").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSongSelect = async (song: Song) => {
    setSelectedSong(song)
    setIsSuccess(false)
    setEmailSent(false)
    setError(null)
    const link = await fetchSongUrl(song)
    setShareLink(link)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSong || !email) return

    setIsSending(true)
    setError(null)

    try {
      // Generate the email HTML based on the selected theme
      const emailHtml = generateEmailHtml()

      await axios.post(`https://magical-music.onrender.com/api/Email/send`, {
        to: email,
        subject: `${senderName ? senderName + " shared" : "Check out"} "${selectedSong.name}" via Magical Music`,
        body: emailHtml,
        songId: selectedSong.id,
      })

      setEmailSent(true)
      setIsSuccess(true)

      // Clear form after successful send
      setEmail("")
      setMessage("")
      setRecipientName("")

      // Show success animation
      setTimeout(() => {
        setIsSuccess(false)
      }, 5000)
    } catch (error) {
      console.error("Error sending email:", error)
      setError("Failed to send email. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  const fetchSongUrl = async (song: Song) => {
    try {
      const response = await axios.get(
        `https://magical-music.onrender.com/api/UploadFile/download-url?fileName=${encodeURIComponent(song.name)}`,
      )
      return response.data.fileUrl
    } catch (error) {
      console.error("Error fetching song URL:", error)
      setShareLink(null)
      return null
    }
  }

  const copyShareLink = () => {
    if (!shareLink) return

    navigator.clipboard.writeText(shareLink)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const generateEmailHtml = () => {
    if (!selectedSong) return ""

    let themeColors = {
      background: "#121212",
      cardBg: "#1e1e1e",
      primary: "#6b66ff",
      secondary: "#ff6b6b",
      text: "#ffffff",
      subtext: "#aaaaaa",
    }

    if (emailTheme === "light") {
      themeColors = {
        background: "#f5f5f5",
        cardBg: "#ffffff",
        primary: "#6b66ff",
        secondary: "#ff6b6b",
        text: "#333333",
        subtext: "#666666",
      }
    } else if (emailTheme === "colorful") {
      themeColors = {
        background: "#2c0051",
        cardBg: "#3a0069",
        primary: "#ff9d00",
        secondary: "#ff3e9d",
        text: "#ffffff",
        subtext: "#d9c5ff",
      }
    }

    const defaultMessage = recipientName
      ? `Hey ${recipientName}, I thought you might enjoy this song!`
      : "I thought you might enjoy this song!"

    return `
      <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: ${themeColors.background};
              color: ${themeColors.text};
              margin: 0; 
              padding: 0;
            }
            .container {
              max-width: 600px;
              background: ${themeColors.cardBg};
              margin: 20px auto;
              border-radius: 16px;
              box-shadow: 0 4px 24px rgba(0,0,0,0.15);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary});
              color: white;
              padding: 30px 20px;
              text-align: center;
              font-size: 28px;
              font-weight: 700;
              position: relative;
            }
            .header-icon {
              position: absolute;
              top: 20px;
              left: 20px;
              width: 40px;
              height: 40px;
              background: rgba(255,255,255,0.2);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .content {
              padding: 30px 40px;
            }
            .message {
              font-size: 18px;
              margin-bottom: 30px;
              line-height: 1.6;
              color: ${themeColors.text};
            }
            .song-card {
              background: rgba(0,0,0,0.1);
              border-radius: 12px;
              padding: 20px;
              margin-bottom: 30px;
              display: flex;
              align-items: center;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            .song-image {
              width: 120px;
              height: 120px;
              border-radius: 8px;
              object-fit: cover;
              margin-right: 20px;
              box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }
            .song-details {
              flex: 1;
            }
            .song-details h2 {
              margin: 0 0 8px 0;
              color: ${themeColors.text};
              font-size: 24px;
            }
            .song-details p {
              margin: 4px 0;
              font-size: 16px;
              color: ${themeColors.subtext};
            }
            .song-meta {
              display: flex;
              align-items: center;
              margin-top: 12px;
              font-size: 14px;
              color: ${themeColors.subtext};
            }
            .song-meta span {
              display: flex;
              align-items: center;
              margin-right: 16px;
            }
            .song-meta span svg {
              margin-right: 6px;
            }
            .buttons {
              display: flex;
              gap: 12px;
              margin-top: 20px;
            }
            .play-button {
              display: inline-block;
              background: linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary});
              color: white;
              text-decoration: none;
              padding: 12px 24px;
              border-radius: 30px;
              font-weight: 600;
              font-size: 16px;
              transition: all 0.3s ease;
              text-align: center;
            }
            .download-button {
              display: inline-block;
              background: rgba(255,255,255,0.1);
              color: ${themeColors.text};
              text-decoration: none;
              padding: 12px 24px;
              border-radius: 30px;
              font-weight: 600;
              font-size: 16px;
              transition: all 0.3s ease;
              text-align: center;
              border: 1px solid rgba(255,255,255,0.2);
            }
            .footer {
              text-align: center;
              padding: 20px;
              font-size: 14px;
              color: ${themeColors.subtext};
              border-top: 1px solid rgba(255,255,255,0.1);
              background: rgba(0,0,0,0.05);
            }
            .logo {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              margin-bottom: 12px;
            }
            .logo-circle {
              width: 24px;
              height: 24px;
              background: linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary});
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .social-links {
              display: flex;
              justify-content: center;
              gap: 16px;
              margin-top: 16px;
            }
            .social-link {
              width: 32px;
              height: 32px;
              background: rgba(255,255,255,0.1);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .sender-info {
              margin-top: 20px;
              font-style: italic;
              color: ${themeColors.subtext};
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="header-icon">🎵</div>
              Shared with Magical Music
            </div>
            <div class="content">
              <p class="message">${message || defaultMessage}</p>
              
              <div class="song-card">
                <img src="${selectedSong.imageUrl || "/placeholder.svg?height=120&width=120"}" alt="${selectedSong.name}" class="song-image">
                <div class="song-details">
                  <h2>${selectedSong.name}</h2>
                  <p>${selectedSong.id || "Unknown Artist"}</p>
                  <p>${selectedSong.musicStyle || "Unknown Genre"}</p>
                  
                  <div class="song-meta">
                    <span>🕒 ${selectedSong.songLength}</span>
                    <span>📅 ${formatDate(selectedSong.releaseDate)}</span>
                  </div>
                  
                  <div class="buttons">
                    ${includePlayButton ? `<a href="${shareLink}" target="_blank" rel="noopener noreferrer" class="play-button">▶️ Play Now</a>` : ""}
                    ${includeDownloadLink ? `<a href="${shareLink}" download="${selectedSong.name}.mp3" class="download-button">⬇️ Download</a>` : ""}
                  </div>
                </div>
              </div>
              
              ${senderName ? `<p class="sender-info">Shared by: ${senderName}</p>` : ""}
            </div>
            <div class="footer">
              <div class="logo">
                <div class="logo-circle">🎧</div>
                <span>Magical Music</span>
              </div>
              <p>Discover, share, and enjoy music together</p>
              <div class="social-links">
                <a href="https://my-react-project-6w5y.onrender.com" class="social-link">📱</a>
                <a href="https://my-react-project-6w5y.onrender.com" class="social-link">📘</a>
                <a href="https://my-react-project-6w5y.onrender.com" class="social-link">📸</a>
              </div>
            </div>
          </div>
        </body>
      </html>
    `
  }

  const toggleEmailPreview = () => {
    setShowEmailPreview(!showEmailPreview)
  }

  const shareToSocial = (platform: string) => {
    if (!selectedSong || !shareLink) return

    let url = ""
    const text = `Check out "${selectedSong.name}" on Magical Music!`

    switch (platform) {
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}&quote=${encodeURIComponent(text)}`
        break
      case "twitter":
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(text)}`
        break
      case "whatsapp":
        url = `https://wa.me/?text=${encodeURIComponent(text + " " + shareLink)}`
        break
    }

    if (url) {
      window.open(url, "_blank", "width=600,height=400")
    }
  }

  return (
    <div className="share-song-container">
      <div className="share-song-header">
        <h2>Share Your Music</h2>
        <p className="share-description">
          Share your favorite songs with friends and family via email, social media, or generate a shareable link.
        </p>
      </div>

      <div className="share-song-content">
        <div className="song-browser">
          <div className="song-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search your songs..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          <div className="song-list">
            {filteredSongs.length > 0 ? (
              filteredSongs.map((song) => (
                <div
                  key={song.id}
                  className={`song-item ${selectedSong?.id === song.id ? "selected" : ""}`}
                  onClick={() => handleSongSelect(song)}
                >
                  <img
                    src={song.imageUrl || "/placeholder.svg?height=50&width=50"}
                    alt={song.name}
                    className="song-image"
                  />
                  <div className="song-details">
                    <h4>{song.name}</h4>
                    <div className="song-meta">
                      <span className="song-style">{song.id || song.musicStyle}</span>
                      <span className="song-date">{formatDate(song.releaseDate)}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-songs-found">
                <Music size={32} />
                <p>No songs found matching "{searchTerm}"</p>
              </div>
            )}
          </div>
        </div>

        <div className="share-options">
          {selectedSong ? (
            <>
              <div className="selected-song-info">
                <img
                  src={selectedSong.imageUrl || "/placeholder.svg?height=100&width=100"}
                  alt={selectedSong.name}
                  className="selected-song-image"
                />
                <div className="selected-song-details">
                  <h3>{selectedSong.name}</h3>
                  <p>{selectedSong.id || selectedSong.musicStyle}</p>
                  <span className="song-length">{selectedSong.songLength}</span>
                </div>
              </div>

              <div className="share-tabs">
                <button
                  className={`share-tab ${activeTab === "email" ? "active" : ""}`}
                  onClick={() => setActiveTab("email")}
                >
                  <Mail size={18} />
                  <span>Email</span>
                </button>
                <button
                  className={`share-tab ${activeTab === "link" ? "active" : ""}`}
                  onClick={() => setActiveTab("link")}
                >
                  <LinkIcon size={18} />
                  <span>Link</span>
                </button>
                <button
                  className={`share-tab ${activeTab === "social" ? "active" : ""}`}
                  onClick={() => setActiveTab("social")}
                >
                  <Share2 size={18} />
                  <span>Social</span>
                </button>
              </div>

              <div className="share-tab-content">
                {activeTab === "email" && (
                  <div className="share-method">
                    <form onSubmit={handleSubmit} className="share-form">
                      <div className="form-group">
                        <label htmlFor="email">Recipient Email</label>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={handleEmailChange}
                          placeholder="friend@example.com"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="recipientName">Recipient Name (Optional)</label>
                        <input
                          type="text"
                          id="recipientName"
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          placeholder="Friend's name"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="message">Message (Optional)</label>
                        <textarea
                          id="message"
                          value={message}
                          onChange={handleMessageChange}
                          placeholder="Check out this awesome song!"
                          rows={3}
                        />
                      </div>

                      <div
                        className="advanced-options-toggle"
                        onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                      >
                        {showAdvancedOptions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        <span>Advanced Options</span>
                      </div>

                      {showAdvancedOptions && (
                        <div className="advanced-options">
                          <div className="form-group">
                            <label htmlFor="senderName">Your Name (Optional)</label>
                            <input
                              type="text"
                              id="senderName"
                              value={senderName}
                              onChange={(e) => setSenderName(e.target.value)}
                              placeholder="Your name"
                            />
                          </div>

                          <div className="form-group">
                            <label>Email Theme</label>
                            <div className="theme-options">
                              <button
                                type="button"
                                className={`theme-option ${emailTheme === "dark" ? "selected" : ""}`}
                                onClick={() => setEmailTheme("dark")}
                              >
                                <span className="theme-preview dark"></span>
                                <span>Dark</span>
                              </button>
                              <button
                                type="button"
                                className={`theme-option ${emailTheme === "light" ? "selected" : ""}`}
                                onClick={() => setEmailTheme("light")}
                              >
                                <span className="theme-preview light"></span>
                                <span>Light</span>
                              </button>
                              <button
                                type="button"
                                className={`theme-option ${emailTheme === "colorful" ? "selected" : ""}`}
                                onClick={() => setEmailTheme("colorful")}
                              >
                                <span className="theme-preview colorful"></span>
                                <span>Colorful</span>
                              </button>
                            </div>
                          </div>

                          <div className="form-group checkboxes">
                            <label className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={includePlayButton}
                                onChange={(e) => setIncludePlayButton(e.target.checked)}
                              />
                              <span>Include Play Button</span>
                            </label>
                            <label className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={includeDownloadLink}
                                onChange={(e) => setIncludeDownloadLink(e.target.checked)}
                              />
                              <span>Include Download Link</span>
                            </label>
                          </div>

                          <button type="button" className="preview-button" onClick={toggleEmailPreview}>
                            {showEmailPreview ? "Hide Preview" : "Preview Email"}
                          </button>
                        </div>
                      )}

                      {error && (
                        <div className="error-message">
                          <AlertCircle size={16} />
                          <span>{error}</span>
                        </div>
                      )}

                      <button type="submit" className="share-button" disabled={isSending || isSuccess}>
                        {isSending ? (
                          <span className="sending">
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                            Sending...
                          </span>
                        ) : isSuccess ? (
                          <>
                            <CheckCircle size={18} />
                            <span>Sent Successfully!</span>
                          </>
                        ) : (
                          <>
                            <Send size={18} />
                            <span>Send Email</span>
                          </>
                        )}
                      </button>
                    </form>

                    {showEmailPreview && (
                      <div className="email-preview-overlay" onClick={toggleEmailPreview}>
                        <div className="email-preview-container" onClick={(e) => e.stopPropagation()}>
                          <div className="email-preview-header">
                            <h3>Email Preview</h3>
                            <button className="close-preview" onClick={toggleEmailPreview}>
                              <X size={18} />
                            </button>
                          </div>
                          <div className="email-preview-content" ref={emailPreviewRef}>
                            <iframe
                              srcDoc={generateEmailHtml()}
                              title="Email Preview"
                              width="100%"
                              height="500"
                              frameBorder="0"
                            ></iframe>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "link" && (
                  <div className="share-method">
                    <h4>
                      <LinkIcon size={18} />
                      <span>Get Shareable Link</span>
                    </h4>

                    <div className="share-link">
                      <div className="link-display">
                        <span>{shareLink || "Choose the song"}</span>
                      </div>
                      <button className="copy-link-button" onClick={copyShareLink} disabled={!shareLink}>
                        {linkCopied ? (
                          <>
                            <CheckCircle size={18} />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={18} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="qr-code-section">
                      <h4>QR Code</h4>
                      <div className="qr-code">
                        {shareLink ? (
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                              shareLink,
                            )}`}
                            alt="QR Code"
                          />
                        ) : (
                          <div className="qr-placeholder">
                            <LinkIcon size={32} />
                            <p>Select a song to generate QR code</p>
                          </div>
                        )}
                      </div>
                      {shareLink && (
                        <button className="download-qr-button">
                          <Download size={16} />
                          <span>Download QR Code</span>
                        </button>
                      )}
                    </div>

                    <p className="link-info">Anyone with this link can listen to this song.</p>
                  </div>
                )}

                {activeTab === "social" && (
                  <div className="share-method">
                    <h4>
                      <Share2 size={18} />
                      <span>Share to Social Media</span>
                    </h4>

                    <div className="social-buttons">
                      <button
                        className="social-button facebook"
                        onClick={() => shareToSocial("facebook")}
                        disabled={!shareLink}
                      >
                        <Facebook size={20} />
                        <span>Facebook</span>
                      </button>
                      <button
                        className="social-button twitter"
                        onClick={() => shareToSocial("twitter")}
                        disabled={!shareLink}
                      >
                        <Twitter size={20} />
                        <span>Twitter</span>
                      </button>
                      <button
                        className="social-button instagram"
                        onClick={() => shareToSocial("instagram")}
                        disabled={!shareLink}
                      >
                        <Instagram size={20} />
                        <span>Instagram</span>
                      </button>
                      <button
                        className="social-button whatsapp"
                        onClick={() => shareToSocial("whatsapp")}
                        disabled={!shareLink}
                      >
                        <Smartphone size={20} />
                        <span>WhatsApp</span>
                      </button>
                    </div>

                    <div className="share-message">
                      <h4>Customize Message</h4>
                      <textarea
                        placeholder="Check out this awesome song!"
                        rows={3}
                        value={message}
                        onChange={handleMessageChange}
                      ></textarea>
                    </div>
                  </div>
                )}
              </div>

              {emailSent && (
                <div className="email-sent-animation">
                  <div className="email-icon">
                    <Mail size={32} />
                  </div>
                  <div className="check-icon">
                    <CheckCircle size={32} />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="no-song-selected">
              <Headphones size={64} />
              <h3>Select a song to share</h3>
              <p>Choose a song from your library to share with friends and family</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ShareSong
