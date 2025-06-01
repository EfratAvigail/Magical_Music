// "use client"

// import type React from "react"

// import { useState, useEffect, useRef } from "react"
// import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Settings, Mic2, Download, Share2 } from "lucide-react"
// import "../styles/karaoke.css"

// interface KaraokeProps {
//   songs: Song[]
// }

// interface Song {
//   id: number
//   name: string
//   songLength: string
//   musicStyle: string
//   releaseDate: string
//   liked: boolean
//   imageUrl?: string
//   artist?: string
// }

// interface LyricLine {
//   text: string
//   startTime: number
//   endTime: number
// }

// const Karaoke = ({ songs }: KaraokeProps) => {
//   const [selectedSong, setSelectedSong] = useState<Song | null>(null)
//   const [isPlaying, setIsPlaying] = useState<boolean>(false)
//   const [currentTime, setCurrentTime] = useState<number>(0)
//   const [duration, setDuration] = useState<number>(0)
//   const [volume, setVolume] = useState<number>(70)
//   const [isMuted, setIsMuted] = useState<boolean>(false)
//   const [previousVolume, setPreviousVolume] = useState<number>(70)
//   const [lyrics, setLyrics] = useState<LyricLine[]>([])
//   const [currentLyricIndex, setCurrentLyricIndex] = useState<number>(-1)
//   const [isLoading, setIsLoading] = useState<boolean>(false)
//   const [searchTerm, setSearchTerm] = useState<string>("")
//   const [showSettings, setShowSettings] = useState<boolean>(false)
//   const [fontScale, setFontScale] = useState<number>(1)
//   const [highlightColor, setHighlightColor] = useState<string>("#6b66ff")
//   const [karaokeMode, setKaraokeMode] = useState<"duet" | "solo">("duet")
//   const [remainingTime, setRemainingTime] = useState<number>(0)

//   const audioRef = useRef<HTMLAudioElement | null>(null)
//   const lyricsContainerRef = useRef<HTMLDivElement>(null)
//   const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

//   // Filter songs based on search term
//   const filteredSongs = songs.filter(
//     (song) =>
//       song.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (song.artist && song.artist.toLowerCase().includes(searchTerm.toLowerCase())) ||
//       (song.musicStyle && song.musicStyle.toLowerCase().includes(searchTerm.toLowerCase())),
//   )

//   useEffect(() => {
//     return () => {
//       if (progressIntervalRef.current) {
//         clearInterval(progressIntervalRef.current)
//       }
//       if (audioRef.current) {
//         audioRef.current.pause()
//       }
//     }
//   }, [])

//   useEffect(() => {
//     if (selectedSong) {
//       fetchLyrics(selectedSong.id)
//     }
//   }, [selectedSong])

//   useEffect(() => {
//     if (isPlaying) {
//       progressIntervalRef.current = setInterval(() => {
//         if (audioRef.current) {
//           setCurrentTime(audioRef.current.currentTime)

//           // Calculate remaining time
//           const remaining = duration - audioRef.current.currentTime
//           setRemainingTime(remaining)

//           // Find current lyric
//           const currentIndex = lyrics.findIndex(
//             (line) => audioRef.current!.currentTime >= line.startTime && audioRef.current!.currentTime < line.endTime,
//           )

//           if (currentIndex !== currentLyricIndex) {
//             setCurrentLyricIndex(currentIndex)

//             // Scroll to current lyric
//             if (lyricsContainerRef.current && currentIndex >= 0) {
//               const lyricElements = lyricsContainerRef.current.querySelectorAll(".lyric-line")
//               if (lyricElements[currentIndex]) {
//                 lyricElements[currentIndex].scrollIntoView({
//                   behavior: "smooth",
//                   block: "center",
//                 })
//               }
//             }
//           }
//         }
//       }, 100)
//     } else if (progressIntervalRef.current) {
//       clearInterval(progressIntervalRef.current)
//     }

//     return () => {
//       if (progressIntervalRef.current) {
//         clearInterval(progressIntervalRef.current)
//       }
//     }
//   }, [isPlaying, lyrics, currentLyricIndex, duration])

//   const fetchLyrics = async (songId: number) => {
//     setIsLoading(true)
//     try {
//       // In a real app, you would fetch lyrics from your API
//       // For now, we'll use mock data
//       const mockLyrics: LyricLine[] = generateMockLyrics(songId)
//       setLyrics(mockLyrics)

//       // Reset state
//       setCurrentLyricIndex(-1)
//       setCurrentTime(0)
//       setIsPlaying(false)

//       // Set duration based on the last lyric's end time
//       if (mockLyrics.length > 0) {
//         const lastLyric = mockLyrics[mockLyrics.length - 1]
//         setDuration(lastLyric.endTime + 5) // Add 5 seconds buffer
//       }
//     } catch (error) {
//       console.error("Error fetching lyrics:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const generateMockLyrics = (songId: number): LyricLine[] => {
//     // This would be replaced with actual lyrics from your API
//     const baseLyrics = [
//       "When the night has come, and the land is dark",
//       "And the moon is the only light we'll see",
//       "No I won't be afraid, no I won't be afraid",
//       "Just as long as you stand, stand by me",
//       "So darling, darling, stand by me, oh stand by me",
//       "Oh stand, stand by me, stand by me",
//       "If the sky that we look upon should tumble and fall",
//       "Or the mountains should crumble to the sea",
//       "I won't cry, I won't cry, no I won't shed a tear",
//       "Just as long as you stand, stand by me",
//     ]

//     // Generate different lyrics based on song ID to simulate different songs
//     const offset = songId % 3
//     const selectedLyrics = baseLyrics.slice(offset, offset + 7)

//     return selectedLyrics.map((text, index) => ({
//       text,
//       startTime: index * 10,
//       endTime: (index + 1) * 10 - 0.5,
//     }))
//   }

//   const handleSongSelect = async (song: Song) => {
//     if (audioRef.current) {
//       audioRef.current.pause()
//     }

//     setSelectedSong(song)
//     setIsPlaying(false)
//     setCurrentTime(0)

//     try {
//       // In a real app, you would fetch the audio URL from your API
//       // For now, we'll simulate loading the audio
//       const audioUrl = await fetchSongUrl(song)

//       if (audioRef.current) {
//         audioRef.current.src = audioUrl
//         audioRef.current.load()
//       }
//     } catch (error) {
//       console.error("Failed to load song:", error)
//     }
//   }

//   const fetchSongUrl = async (song: Song): Promise<string> => {
//     try {
//       // In a real app, you would fetch the URL from your API
//       // For now, we'll return a mock URL
//       return `/api/songs/${song.id}`
//     } catch (error) {
//       console.error("Error fetching song URL:", error)
//       throw error
//     }
//   }

//   const togglePlayPause = () => {
//     if (!audioRef.current) return

//     if (isPlaying) {
//       audioRef.current.pause()
//     } else {
//       audioRef.current.play()
//     }

//     setIsPlaying(!isPlaying)
//   }

//   const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newVolume = Number(e.target.value)
//     setVolume(newVolume)

//     if (audioRef.current) {
//       audioRef.current.volume = newVolume / 100
//     }

//     if (newVolume === 0) {
//       setIsMuted(true)
//     } else {
//       setIsMuted(false)
//     }
//   }

//   const toggleMute = () => {
//     if (isMuted) {
//       setVolume(previousVolume)
//       if (audioRef.current) {
//         audioRef.current.volume = previousVolume / 100
//       }
//     } else {
//       setPreviousVolume(volume)
//       setVolume(0)
//       if (audioRef.current) {
//         audioRef.current.volume = 0
//       }
//     }

//     setIsMuted(!isMuted)
//   }

//   const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const seekTime = Number(e.target.value)
//     setCurrentTime(seekTime)

//     if (audioRef.current) {
//       audioRef.current.currentTime = seekTime
//     }
//   }

//   const nextSong = () => {
//     if (!selectedSong || filteredSongs.length === 0) return

//     const currentIndex = filteredSongs.findIndex((song) => song.id === selectedSong.id)
//     const nextIndex = (currentIndex + 1) % filteredSongs.length
//     handleSongSelect(filteredSongs[nextIndex])
//   }

//   const prevSong = () => {
//     if (!selectedSong || filteredSongs.length === 0) return

//     const currentIndex = filteredSongs.findIndex((song) => song.id === selectedSong.id)
//     const prevIndex = (currentIndex - 1 + filteredSongs.length) % filteredSongs.length
//     handleSongSelect(filteredSongs[prevIndex])
//   }

//   const formatTime = (seconds: number): string => {
//     const mins = Math.floor(seconds / 60)
//     const secs = Math.floor(seconds % 60)
//     return `${mins}:${secs.toString().padStart(2, "0")}`
//   }

//   const downloadLyrics = () => {
//     if (!selectedSong || lyrics.length === 0) return

//     const lyricsText = lyrics.map((line) => line.text).join("\n")
//     const blob = new Blob([lyricsText], { type: "text/plain" })
//     const url = URL.createObjectURL(blob)

//     const a = document.createElement("a")
//     a.href = url
//     a.download = `${selectedSong.name} - Lyrics.txt`
//     document.body.appendChild(a)
//     a.click()
//     document.body.removeChild(a)
//     URL.revokeObjectURL(url)
//   }

//   const shareLyrics = () => {
//     if (!selectedSong) return

//     // Open share dialog
//     alert(`Share functionality would open here for "${selectedSong.name}"`)
//   }

//   return (
//     <div className="karaoke-container">
//       <div className="karaoke-header">
//         <h2>Karaoke Mode</h2>
//         <p className="karaoke-description">Sing along with synchronized lyrics to your favorite songs.</p>

//         <div className="karaoke-search">
//           <input
//             type="text"
//             placeholder="Search songs by name, artist or style..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       <div className="karaoke-content">
//         <div className="song-selection">
//           <h3>Select a Song</h3>
//           <div className="song-list">
//             {filteredSongs.length > 0 ? (
//               filteredSongs.map((song) => (
//                 <div
//                   key={song.id}
//                   className={`song-item ${selectedSong?.id === song.id ? "selected" : ""}`}
//                   onClick={() => handleSongSelect(song)}
//                 >
//                   <img
//                     src={song.imageUrl || "/placeholder.svg?height=50&width=50"}
//                     alt={song.name}
//                     className="song-image"
//                   />
//                   <div className="song-details">
//                     <h4>{song.name}</h4>
//                     <p>{song.artist || song.musicStyle}</p>
//                   </div>
//                   <span className="song-duration">{song.songLength}</span>
//                 </div>
//               ))
//             ) : (
//               <div className="no-songs-found">
//                 <p>No songs found matching "{searchTerm}"</p>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="karaoke-player">
//           {selectedSong ? (
//             <>
//               <div className="karaoke-player-header">
//                 <div className="song-info">
//                   <h3>{selectedSong.name}</h3>
//                   <p>{selectedSong.artist || selectedSong.musicStyle}</p>
//                 </div>

//                 <div className="karaoke-actions">
//                   <button className="action-button" onClick={downloadLyrics}>
//                     <Download size={18} />
//                   </button>
//                   <button className="action-button" onClick={shareLyrics}>
//                     <Share2 size={18} />
//                   </button>
//                   <button className="action-button" onClick={() => setShowSettings(!showSettings)}>
//                     <Settings size={18} />
//                   </button>
//                 </div>
//               </div>

//               {showSettings && (
//                 <div className="karaoke-settings">
//                   <div className="settings-group">
//                     <label>Font Size</label>
//                     <input
//                       type="range"
//                       min="0.8"
//                       max="1.5"
//                       step="0.1"
//                       value={fontScale}
//                       onChange={(e) => setFontScale(Number(e.target.value))}
//                     />
//                   </div>

//                   <div className="settings-group">
//                     <label>Highlight Color</label>
//                     <div className="color-options">
//                       {["#6b66ff", "#ff6b6b", "#66ff6b", "#ff66b3", "#ffb366"].map((color) => (
//                         <button
//                           key={color}
//                           className={`color-option ${highlightColor === color ? "selected" : ""}`}
//                           style={{ backgroundColor: color }}
//                           onClick={() => setHighlightColor(color)}
//                         />
//                       ))}
//                     </div>
//                   </div>

//                   <div className="settings-group">
//                     <label>Mode</label>
//                     <div className="mode-options">
//                       <button
//                         className={`mode-option ${karaokeMode === "duet" ? "selected" : ""}`}
//                         onClick={() => setKaraokeMode("duet")}
//                       >
//                         Duet Mode
//                       </button>
//                       <button
//                         className={`mode-option ${karaokeMode === "solo" ? "selected" : ""}`}
//                         onClick={() => setKaraokeMode("solo")}
//                       >
//                         Solo Mode
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <div className="lyrics-display" ref={lyricsContainerRef}>
//                 {isLoading ? (
//                   <div className="loading-lyrics">
//                     <div className="loading-spinner"></div>
//                     <p>Loading lyrics...</p>
//                   </div>
//                 ) : lyrics.length > 0 ? (
//                   <div className="lyrics-container" style={{ fontSize: `${fontScale}rem` }}>
//                     {lyrics.map((line, index) => (
//                       <div
//                         key={index}
//                         className={`lyric-line ${index === currentLyricIndex ? "active" : ""} ${
//                           index < currentLyricIndex ? "past" : ""
//                         }`}
//                         style={
//                           index === currentLyricIndex
//                             ? { color: highlightColor }
//                             : index < currentLyricIndex
//                               ? { opacity: 0.5 }
//                               : {}
//                         }
//                       >
//                         {line.text}
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="no-lyrics">
//                     <Mic2 size={48} />
//                     <p>No lyrics available for this song</p>
//                   </div>
//                 )}
//               </div>

//               <div className="remaining-time">
//                 {remainingTime > 0 && (
//                   <div className="time-display">
//                     <span>Next line in: {formatTime(remainingTime)}</span>
//                   </div>
//                 )}
//               </div>

//               <div className="karaoke-controls">
//                 <div className="progress-container">
//                   <span className="time-display">{formatTime(currentTime)}</span>
//                   <input
//                     type="range"
//                     min="0"
//                     max={duration}
//                     value={currentTime}
//                     onChange={handleSeek}
//                     className="progress-slider"
//                   />
//                   <span className="time-display">{formatTime(duration)}</span>
//                 </div>

//                 <div className="playback-controls">
//                   <button className="control-button" onClick={prevSong}>
//                     <SkipBack size={20} />
//                   </button>
//                   <button className="control-button play-button" onClick={togglePlayPause}>
//                     {isPlaying ? <Pause size={24} /> : <Play size={24} />}
//                   </button>
//                   <button className="control-button" onClick={nextSong}>
//                     <SkipForward size={20} />
//                   </button>
//                 </div>

//                 <div className="volume-control">
//                   <button className="control-button" onClick={toggleMute}>
//                     {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
//                   </button>
//                   <input
//                     type="range"
//                     min="0"
//                     max="100"
//                     value={volume}
//                     onChange={handleVolumeChange}
//                     className="volume-slider"
//                   />
//                 </div>
//               </div>

//               <audio ref={audioRef} preload="auto" />
//             </>
//           ) : (
//             <div className="no-song-selected">
//               <Mic2 size={64} />
//               <h3>Select a song to start singing</h3>
//               <p>Choose from your library and enjoy the karaoke experience</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Karaoke
