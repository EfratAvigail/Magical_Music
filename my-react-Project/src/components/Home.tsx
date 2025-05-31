"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useNavigate, Routes, Route } from "react-router-dom"
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  LogOut,
  Music,
  Headphones,
  Heart,
  MoreHorizontal,
  Repeat,
  User,
} from "lucide-react"
import type { Song, User as UserType } from "../types"
import "../styles/home.css"
import SideMenu from "./SideMenu"
// import SongFolder from "./SongFolder"
import Transcribe from "./Transcribe"
import CutSong from "./CutSong"
import ShareSong from "./ShareSong"
import UserSettings from "./UserSettings"
import axios from "axios"

interface HomeProps {
  setIsAuthenticated: (value: boolean) => void
}
  // const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || ""
const Home = ({ setIsAuthenticated }: HomeProps) => {
  const [user, setUser] = useState<UserType | null>(null)
  const [songs, setSongs] = useState<Song[]>([])
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [progress, setProgress] = useState<number>(0)
  const [volume, setVolume] = useState<number>(70)
  const navigate = useNavigate()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData && userData !== "undefined") {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error("Error parsing user data:", error)
        localStorage.removeItem("user")
      }
    }

    fetchSongs()

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  const fetchSongs = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get<string[]>(`https://magical-music.onrender.com/api/UploadFile/songs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      

      const data = response.data.map((song: string, index: number) => ({
        id: index + 1,
        name: song,
        songLength: "4:00", // נתון דמה, תעדכן לפי הצורך
        musicStyle: "Unknown",
        releaseDate: "2023-01-01",
        liked: false,
      }))

      setSongs(data)
      if (data.length > 0) {
        setCurrentSong(data[0])
      }
    } catch (error) {
      console.error("Error fetching songs:", error)
      setSongs(mockSongs)
      setCurrentSong(mockSongs[0])
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setIsAuthenticated(false)
    navigate("/login")
  }

  const playSong = async (song: Song) => {
    if (audioRef.current) {
      audioRef.current.pause() // עצור את השיר הנוכחי
    }

    try {
      const response = await axios.get(`https://magical-music.onrender.com/api/UploadFile/download-url`, {
        params: { fileName: song.name }
      })
      const audioUrl = response.data.fileUrl
      audioRef.current = new Audio(audioUrl)
      audioRef.current.volume = volume / 100
      audioRef.current.play()

      setCurrentSong(song)
      setIsPlaying(true)
      setProgress(0)

      audioRef.current.addEventListener('ended', nextSong) // עבור לשיר הבא כאשר השיר נגמר
    } catch (error) {
      console.error("Failed to play song", error)
    }
  }

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
    }
    setIsPlaying(!isPlaying)
  }

  const nextSong = () => {
    if (!currentSong || songs.length === 0) return

    const currentIndex = songs.findIndex((song) => song.id === currentSong.id)
    const nextIndex = (currentIndex + 1) % songs.length
    playSong(songs[nextIndex])
  }

  const prevSong = () => {
    if (!currentSong || songs.length === 0) return

    const currentIndex = songs.findIndex((song) => song.id === currentSong.id)
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length
    playSong(songs[prevIndex])
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number.parseInt(e.target.value))
    if (audioRef.current) {
      audioRef.current.volume = Number.parseInt(e.target.value) / 100
    }
  }

  const toggleLike = (id: number) => {
    setSongs(
      songs.map((song) => {
        if (song.id === id) {
          return { ...song, liked: !song.liked }
        }
        return song
      }),
    )
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const calculateCurrentTime = () => {
    if (!currentSong) return "0:00"
    const timeParts = currentSong.songLength.split(":")
    const totalSeconds = Number.parseInt(timeParts[0]) * 60 + Number.parseInt(timeParts[1])
    const currentSeconds = (progress / 100) * totalSeconds
    return formatTime(currentSeconds)
  }

  const formatSongLength = (songLength: string) => {
    const parts = songLength.split(":")
    if (parts.length === 2) return songLength
    return songLength
  }

  const mockSongs: Song[] = [
    { id: 1, name: "Song One", songLength: "3:45", musicStyle: "חסידי", releaseDate: "2023-01-01", liked: false },
    { id: 2, name: "Song Two", songLength: "3:45", musicStyle: "Pop", releaseDate: "2023-01-01", liked: false },
  ]

  const displaySongs = songs.length > 0 ? songs : mockSongs
  const displayCurrentSong = currentSong || (displaySongs.length > 0 ? displaySongs[0] : null)

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader">
          <Headphones size={48} className="loader-icon" />
          <p>Loading your magical music experience...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="home-container">
      <div className="music-background">
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
            <Music size={15 + Math.random() * 25} color={`hsl(${Math.random() * 360}, 80%, 60%)`} />
          </div>
        ))}
      </div>

      <header className="home-header">
        <div className="logo">
          <div className="logo-circle">
            <Headphones size={24} />
          </div>
          <h1>Magical Music</h1>
        </div>
        <div className="user-info">
          <div className="user-profile">
            <div className="user-avatar">
              <User size={18} />
            </div>
            <span>{user?.name || "Music Lover"}</span>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="app-layout">
        <SideMenu
          onNavigate={(view: string) => navigate(view)}
          activeView={location.pathname}
        />
        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <div className="home-content">
                  <section className="song-list">
                    <h2>Your Songs</h2>
                    <div className="songs-container">
                      {displaySongs.map((song) => (
                        <div
                          key={song.id}
                          className={`song-item ${displayCurrentSong?.id === song.id ? "active" : ""}`}
                          onClick={() => playSong(song)}
                        >
                          <img
                            src={song.imageUrl || "/placeholder.svg?height=60&width=60"}
                            alt={song.name}
                            className="song-cover"
                          />
                          <div className="song-info">
                            <h3>{song.name}</h3>
                            <p>{song.musicStyle}</p>
                          </div>
                          <div className="song-actions">
                            <button
                              className={`like-button ${song.liked ? "liked" : ""}`}
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleLike(song.id)
                              }}
                            >
                              <Heart size={16} />
                            </button>
                            <span className="song-duration">{formatSongLength(song.songLength)}</span>
                            <button
                              className="more-button"
                              onClick={(e) => {
                                e.stopPropagation()
                              }}
                            >
                              <MoreHorizontal size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="player-section">
                    {displayCurrentSong ? (
                      <>
                        <div className="now-playing">
                          <div className="album-artwork">
                            <img
                              src={displayCurrentSong.imageUrl || "/placeholder.svg?height=200&width=200"}
                              alt={displayCurrentSong.name}
                              className="current-song-cover"
                            />
                            <div className={`vinyl-record ${isPlaying ? "spinning" : ""}`}></div>
                          </div>
                          <div className="current-song-info">
                            <div className="song-title-artist">
                              <h2>{displayCurrentSong.name}</h2>
                              <p>{displayCurrentSong.musicStyle}</p>
                            </div>
                            <button
                              className={`like-button large ${displayCurrentSong.liked ? "liked" : ""}`}
                              onClick={() => toggleLike(displayCurrentSong.id)}
                            >
                              <Heart size={20} />
                            </button>
                          </div>
                        </div>

                        <div className="player-controls-container">
                          <div className="additional-controls">
                            <button className="control-button small">
                              <Repeat size={16} />
                            </button>
                          </div>

                          <div className="player-controls">
                            <button className="control-button" onClick={prevSong}>
                              <SkipBack size={24} />
                            </button>
                            <button className="control-button play-button" onClick={togglePlayPause}>
                              {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                            </button>
                            <button className="control-button" onClick={nextSong}>
                              <SkipForward size={24} />
                            </button>
                          </div>

                          <div className="progress-container">
                            <div className="time-display">
                              <span>{calculateCurrentTime()}</span>
                              <span>{formatSongLength(displayCurrentSong.songLength)}</span>
                            </div>
                            <div className="progress-bar">
                              <div className="progress" style={{ width: `${progress}%` }}></div>
                              <div className="progress-handle" style={{ left: `${progress}%` }}></div>
                            </div>
                          </div>

                          <div className="volume-control">
                            <Volume2 size={20} />
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={volume}
                              onChange={handleVolumeChange}
                              className="volume-slider"
                              
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="no-song-selected">
                        <Music size={48} />
                        <p>Select a song to play</p>
                      </div>
                    )}
                  </section>
                </div>
              }
            />
            {/* <Route path="folder" element={<SongFolder songs={displaySongs} onPlaySong={playSong} />} /> */}
            <Route path="transcribe" element={<Transcribe />} />
            <Route path="cut" element={<CutSong songs={displaySongs} />} />
            <Route path="share" element={<ShareSong songs={displaySongs} />} />
            <Route path="settings" element={<UserSettings user={user} />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default Home