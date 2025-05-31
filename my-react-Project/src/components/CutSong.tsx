"use client"

import { useState, useRef, useEffect } from "react"
import { Scissors, Play, Pause, Save, RotateCcw, Music } from "lucide-react"
import type { Song } from "../types"
import "../styles/cutsong.css"
import axios from "axios"

interface CutSongProps {
  songs: Song[]
}
  // const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || ""
const CutSong = ({ songs }: CutSongProps) => {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [startMarker, setStartMarker] = useState<number>(0)
  const [endMarker, setEndMarker] = useState<number>(100)
  const [isCutting, setIsCutting] = useState<boolean>(false)
  const [cutComplete, setCutComplete] = useState<boolean>(false)
  const [cutDownloadUrl, setCutDownloadUrl] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const waveformCanvasRef = useRef<HTMLCanvasElement>(null)

  const parseSongLength = (songLength: string): number => {
    const parts = songLength.split(":")
    if (parts.length === 3) {
      return Number.parseInt(parts[0]) * 3600 + Number.parseInt(parts[1]) * 60 + Number.parseInt(parts[2])
    }
    return 0
  }

  useEffect(() => {
    if (selectedSong) {
      const songDuration = parseSongLength(selectedSong.songLength)
      setDuration(songDuration)
      setEndMarker(songDuration)
      drawWaveform()
    }
  }, [selectedSong])

  useEffect(() => {
    drawWaveform()
  }, [startMarker, endMarker])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const onEnded = () => setIsPlaying(false)

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("ended", onEnded)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("ended", onEnded)
    }
  }, [])

  const drawWaveform = () => {
    const canvas = waveformCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const width = canvas.width
    const height = canvas.height
    const barWidth = 2
    const barGap = 1
    const bars = Math.floor(width / (barWidth + barGap))

    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"

    for (let i = 0; i < bars; i++) {
      const barHeight = Math.random() * (height * 0.8) + height * 0.1
      ctx.fillRect(i * (barWidth + barGap), (height - barHeight) / 2, barWidth, barHeight)
    }

    if (selectedSong && duration > 0) {
      const startX = (startMarker / duration) * width
      const endX = (endMarker / duration) * width

      ctx.fillStyle = "rgba(107, 102, 255, 0.3)"
      ctx.fillRect(startX, 0, endX - startX, height)

      ctx.fillStyle = "#6b66ff"
      ctx.fillRect(startX - 2, 0, 4, height)
      ctx.fillRect(endX - 2, 0, 4, height)
    }
  }

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = waveformCanvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const width = canvas.width
    const clickedTime = (x / width) * duration

    if (clickedTime < startMarker) {
      setStartMarker(clickedTime)
    } else if (clickedTime > endMarker) {
      setEndMarker(clickedTime)
    }
  }

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSongSelect = (song: Song) => {
    setSelectedSong(song)
    setIsPlaying(false)
    setCurrentTime(0)
    setStartMarker(0)
    setEndMarker(parseSongLength(song.songLength))
    setCutComplete(false)
    setCutDownloadUrl(null)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const cutSong = async () => {
    if (!selectedSong || startMarker >= endMarker) {
      alert("Start marker must be less than end marker.")
      return
    }

    setIsCutting(true)

    const requestBody = {
      songKey: selectedSong.name,
      startSeconds: Math.floor(startMarker),
      endSeconds: Math.floor(endMarker),
    }

    try {
      const response = await axios.post(`https://magical-music.onrender.com/api/CutSong`, requestBody, {
        headers: { "Content-Type": "application/json" },
        responseType: "blob",
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      setCutDownloadUrl(url)
      setCutComplete(true)
    } catch (error) {
      console.error("Error cutting song:", error)
      alert("Failed to cut the song.")
    } finally {
      setIsCutting(false)
    }
  }

  const resetCut = () => {
    if (selectedSong) {
      setStartMarker(0)
      setEndMarker(parseSongLength(selectedSong.songLength))
      setCutComplete(false)
      setCutDownloadUrl(null)
      drawWaveform()
    }
  }

  return (
    <div className="cut-song-container">
      <div className="cut-song-header">
        <h2>Cut Song</h2>
        <p className="cut-song-description">
          Select a song and trim it to create a shorter version or extract your favorite part.
        </p>
      </div>

      <div className="cut-song-content">
        <div className="song-selection">
          <h3>Select a Song</h3>
          <div className="song-selection-list">
            {songs.map((song) => (
              <div
                key={song.id}
                className={`song-selection-item ${selectedSong?.id === song.id ? "selected" : ""}`}
                onClick={() => handleSongSelect(song)}
              >
                <img
                  src={song.imageUrl || "/placeholder.svg?height=50&width=50"}
                  alt={song.name}
                  className="song-selection-image"
                />
                <div className="song-selection-info">
                  <h4>{song.name}</h4>
                  <p>{song.musicStyle}</p>
                </div>
                <span className="song-selection-duration">{song.songLength.substring(3)}</span>
              </div>
            ))}
          </div>
        </div>

        {selectedSong && (
          <div className="song-editor">
            <div className="song-editor-header">
              <div className="selected-song-info">
                <h3>{selectedSong.name}</h3>
                <p>{selectedSong.musicStyle}</p>
              </div>
              <button className="play-button" onClick={togglePlayPause}>
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                <span>{isPlaying ? "Pause" : "Play"}</span>
              </button>
            </div>

            <div className="waveform-container">
              <canvas
                ref={waveformCanvasRef}
                className="waveform-canvas"
                width={800}
                height={150}
                onClick={handleCanvasClick}
              ></canvas>
              <audio
                ref={audioRef}
                src={selectedSong.audioUrl}
                style={{ display: "none" }}
              />
            </div>

            <div className="cut-markers">
              <label>
                Start Time:
                <input
                  type="number"
                  value={startMarker}
                  onChange={(e) => setStartMarker(Number(e.target.value))}
                  min={0}
                  max={duration}
                />
              </label>
              <label>
                End Time:
                <input
                  type="number"
                  value={endMarker}
                  onChange={(e) => setEndMarker(Number(e.target.value))}
                  min={0}
                  max={duration}
                />
              </label>
            </div>

            <div className="cut-actions">
              <button className="reset-button" onClick={resetCut} disabled={isCutting}>
                <RotateCcw size={18} />
                <span>Reset</span>
              </button>

              {!cutComplete ? (
                <button className="cut-button" onClick={cutSong} disabled={isCutting}>
                  {isCutting ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <Scissors size={18} />
                      <span>Cut Song</span>
                    </>
                  )}
                </button>
              ) : (
                <a
                  href={cutDownloadUrl || "#"}
                  className="cut-button"
                  download={`${selectedSong?.name}_cut.mp3`}
                >
                  <Save size={18} />
                  <span>Save Cut</span>
                </a>
              )}
            </div>

            {cutComplete && (
              <div className="cut-complete">
                <p>Your cut is complete! The new song duration is {formatTime(endMarker - startMarker)}.</p>
              </div>
            )}
          </div>
        )}

        {!selectedSong && (
          <div className="no-song-selected">
            <Music size={48} />
            <p>Select a song to start cutting</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CutSong
