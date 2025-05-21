"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
  Shuffle,
  Repeat,
  User,
} from "lucide-react"
import type { Song, User as UserType } from "../types"
import "../styles/home.css"
import SideMenu from "./SideMenu"
import SongFolder from "./SongFolder"
import Transcribe from "./Transcribe"
import CutSong from "./CutSong"
import ShareSong from "./ShareSong"
import SearchSongs from "./SearchSongs"
import UserSettings from "./UserSettings"
import axios from "axios"

interface HomeProps {
  setIsAuthenticated: (value: boolean) => void
}

const Home = ({ setIsAuthenticated }: HomeProps) => {
  const [user, setUser] = useState<UserType | null>(null)
  const [songs, setSongs] = useState<Song[]>([])
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [progress, setProgress] = useState<number>(0)
  const [volume, setVolume] = useState<number>(70)
  const navigate = useNavigate()

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem("user")
    if (userData && userData !== "undefined") {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error("Error parsing user data:", error)
        localStorage.removeItem("user") // Remove invalid data
      }
    }

    // Fetch songs from API
    fetchSongs()

    // Simulate progress for demo purposes
    const interval = setInterval(() => {
      if (isPlaying) {
        setProgress((prev) => {
          if (prev >= 100) {
            nextSong()
            return 0
          }
          return prev + 0.5
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isPlaying])

const fetchSongs = async () => {
    setLoading(true); // הוספת מצב טעינה
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get<string[]>("https://localhost:7234/api/UploadFile/songs", { // עדכון הכתובת
            headers: {
                Authorization: `Bearer ${token}`, // הוספת הטוקן להודעת הבקשה
            },
        });

        const data = response.data.map((song: string, index: number) => ({ // הגדרת טיפוסים
            id: index + 1, // ניתן להוסיף מזהה ייחודי
            name: song, // שם השיר (בהנחה שהשיר הוא רק מפתח)
            songLength: "4:00", // אורך השיר (אם יש לך מידע נוסף)
            musicStyle: "Unknown", // סגנון המוזיקה (אם יש לך מידע נוסף)
            releaseDate: "2023-01-01", // תאריך יציאה (נתון דמה)
            liked: false, // האם השיר אהוב
        }));

        setSongs(data); // עדכון מצב השירים עם הנתונים שהתקבלו
        if (data.length > 0) {
            setCurrentSong(data[0]); // הגדרת השיר הראשון כרגע הנוכחי
        }
    } catch (error) {
        console.error("Error fetching songs:", error); // טיפול בשגיאה
        setSongs(mockSongs); // שימוש בנתוני דמה במקרה של שגיאה
        setCurrentSong(mockSongs[0]); // הגדרת השיר הראשון מדאטה הדמה
    } finally {
        setLoading(false); // סיום מצב הטעינה
    }
}


  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setIsAuthenticated(false)
    navigate("/login")
  }

  const playSong = (song: Song) => {
    setCurrentSong(song)
    setIsPlaying(true)
    setProgress(0)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const nextSong = () => {
    if (!currentSong || songs.length === 0) return

    const currentIndex = songs.findIndex((song) => song.id === currentSong.id)
    const nextIndex = (currentIndex + 1) % songs.length
    setCurrentSong(songs[nextIndex])
    setIsPlaying(true)
    setProgress(0)
  }

  const prevSong = () => {
    if (!currentSong || songs.length === 0) return

    const currentIndex = songs.findIndex((song) => song.id === currentSong.id)
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length
    setCurrentSong(songs[prevIndex])
    setIsPlaying(true)
    setProgress(0)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number.parseInt(e.target.value))
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
    const totalSeconds =
      Number.parseInt(timeParts[0]) * 3600 + Number.parseInt(timeParts[1]) * 60 + Number.parseInt(timeParts[2])

    const currentSeconds = (progress / 100) * totalSeconds
    return formatTime(currentSeconds)
  }

  const formatSongLength = (songLength: string) => {
    const parts = songLength.split(":")
    if (parts.length === 2) return songLength

    if (parts.length === 3) {
      const hours = Number.parseInt(parts[0])
      const minutes = Number.parseInt(parts[1])
      const seconds = Number.parseInt(parts[2])

      const totalMinutes = hours * 60 + minutes
      return `${totalMinutes}:${seconds < 10 ? "0" : ""}${seconds}`
    }

    return songLength
  }

 const mockSongs: Song[] = [
    { id: 1, name: "Song One", songLength: "3:45", musicStyle: "חסידי", releaseDate: "2023-01-01", liked: false },
    { id: 2, name: "Song Two", songLength: "3:45", musicStyle: "Pop", releaseDate: "2023-01-01", liked: false  },
    // שירים נוספים
];


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

  const MusicNote = ({ size, color }: { size: number; color: string }) => {
    return <Music size={size} color={color} />
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
            {i % 3 === 0 ? (
              <MusicNote size={15 + Math.random() * 25} color={`hsl(${Math.random() * 360}, 80%, 60%)`} />
            ) : i % 3 === 1 ? (
              <Headphones size={15 + Math.random() * 25} color={`hsl(${Math.random() * 360}, 80%, 60%)`} />
            ) : (
              <Music size={15 + Math.random() * 25} color={`hsl(${Math.random() * 360}, 80%, 60%)`} />
            )}
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
        <SideMenu />
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
                              <Shuffle size={16} />
                            </button>
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
            <Route path="folder" element={<SongFolder songs={displaySongs} onPlaySong={playSong} />} />
            <Route path="transcribe" element={<Transcribe />} />
            <Route path="cut" element={<CutSong songs={displaySongs} />} />
            <Route path="share" element={<ShareSong songs={displaySongs} />} />
            <Route path="search" element={<SearchSongs />} />
            <Route path="settings" element={<UserSettings user={user} />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default Home
