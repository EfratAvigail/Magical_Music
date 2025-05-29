// "use client"

// import React, { useState, useRef, useEffect } from "react"
// import { Play, Pause, Volume2, VolumeX } from "lucide-react"
// import "../styles/musicplayer.css"

// interface MusicPlayerProps {
//   isCollapsed?: boolean
// }

// const MusicPlayer: React.FC<MusicPlayerProps> = ({ isCollapsed = false }) => {
//   const [isPlaying, setIsPlaying] = useState(false)
//   const [currentTime, setCurrentTime] = useState(0)
//   const [duration, setDuration] = useState(0)
//   const [volume, setVolume] = useState(0.7)
//   const [isMuted, setIsMuted] = useState(false)
//   const [currentSong, setCurrentSong] = useState({
//     title: "Bohemian Rhapsody",
//     artist: "Queen",
//     cover: "/placeholder.svg?height=60&width=60",
//     audioUrl: "", // כאן יש לשים את שם הקובץ או נתיב לשיר
//   })

//   const audioRef = useRef<HTMLAudioElement | null>(null)
//   const progressRef = useRef<HTMLDivElement | null>(null)

//   // משיכת URL של השיר מהשרת
//   const fetchSongUrl = async (fileName: string) => {
//     try {
//       const response = await fetch(`https://localhost:7234/api/UploadFile/download-url?fileName=${fileName}`)
//       if (!response.ok) {
//         throw new Error('Network response was not ok')
//       }
//       const data = await response.json()
//       return data.fileUrl // מחזיר את כתובת ה-URL של השיר
//     } catch (error) {
//       console.error("Error fetching song URL:", error)
//       return null
//     }
//   }

//   // הפעלת השיר - טוען URL ומפעיל אודיו
//   const playSong = async (fileName: string) => {
//     if (!fileName) return
//     const songUrl = await fetchSongUrl(fileName)
//     if (songUrl) {
//       if (audioRef.current) {
//         audioRef.current.pause()
//         audioRef.current.src = "" // ניקוי מקור ישן
//       }
//       const audio = new Audio(songUrl)
//       audioRef.current = audio
//       audio.volume = isMuted ? 0 : volume

//       // אירועים
//       audio.addEventListener("timeupdate", updateProgress)
//       audio.addEventListener("loadedmetadata", () => {
//         setDuration(audio.duration)
//       })
//       audio.addEventListener("ended", () => {
//         setIsPlaying(false)
//         setCurrentTime(0)
//       })

//       await audio.play()
//       setIsPlaying(true)
//     }
//   }

//   // כאשר משתנה currentSong.audioUrl - נתחיל לנגן את השיר
//   useEffect(() => {
//     playSong(currentSong.audioUrl)

//     return () => {
//       if (audioRef.current) {
//         audioRef.current.pause()
//       }
//     }
//   }, [currentSong.audioUrl])

//   // עדכון עוצמת שמע
//   useEffect(() => {
//     if (audioRef.current) {
//       audioRef.current.volume = isMuted ? 0 : volume
//     }
//   }, [volume, isMuted])

//   // עדכון הזמן הנוכחי
//   const updateProgress = () => {
//     if (audioRef.current) {
//       setCurrentTime(audioRef.current.currentTime)
//     }
//   }

//   // פורמט להצגת זמן
//   const formatTime = (time: number) => {
//     const minutes = Math.floor(time / 60)
//     const seconds = Math.floor(time % 60)
//     return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
//   }

//   // הפעלה והשהיה
//   const togglePlay = () => {
//     if (audioRef.current) {
//       if (isPlaying) {
//         audioRef.current.pause()
//       } else {
//         audioRef.current.play()
//       }
//       setIsPlaying(!isPlaying)
//     }
//   }

//   // השתקה
//   const toggleMute = () => {
//     setIsMuted(!isMuted)
//   }

//   // מעבר בזמן באמצעות לחיצה על פס ההתקדמות
//   const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (progressRef.current && audioRef.current) {
//       const rect = progressRef.current.getBoundingClientRect()
//       const pos = (e.clientX - rect.left) / rect.width
//       audioRef.current.currentTime = pos * duration
//       setCurrentTime(audioRef.current.currentTime)
//     }
//   }

//   // שינוי עוצמת שמע
//   const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newVolume = Number.parseFloat(e.target.value)
//     setVolume(newVolume)
//     setIsMuted(newVolume === 0)
//   }

//   if (isCollapsed) {
//     return (
//       <div className="music-player collapsed">
//         <button className={`play-button ${isPlaying ? "playing" : ""}`} onClick={togglePlay}>
//           {isPlaying ? <Pause size={16} /> : <Play size={16} />}
//         </button>
//       </div>
//     )
//   }

//   return (
//     <div className="music-player">
//       <div className="song-info">
//         <img src={currentSong.cover || "/placeholder.svg"} alt={currentSong.title} className="cover-art" />
//         <div className="song-details">
//           <div className="song-title">{currentSong.title}</div>
//           <div className="song-artist">{currentSong.artist}</div>
//         </div>
//       </div>

//       <div className="player-controls">
//         <button className={`play-button ${isPlaying ? "playing" : ""}`} onClick={togglePlay}>
//           {isPlaying ? <Pause size={20} /> : <Play size={20} />}
//         </button>

//         <div className="progress-container">
//           <div className="progress-bar" ref={progressRef} onClick={handleProgressClick}>
//             <div className="progress" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
//           </div>
//           <div className="time-display">
//             <span>{formatTime(currentTime)}</span>
//             <span>{formatTime(duration)}</span>
//           </div>
//         </div>

//         <div className="volume-control">
//           <button className="mute-button" onClick={toggleMute}>
//             {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
//           </button>
//           <input
//             type="range"
//             min="0"
//             max="1"
//             step="0.01"
//             value={volume}
//             onChange={handleVolumeChange}
//             className="volume-slider"
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default MusicPlayer
