"use client"

import { useState, useRef, useEffect } from "react"
import { Scissors, Play, Pause, Save, RotateCcw, Music } from "lucide-react"
import type { Song } from "../types"
import "../styles/cutsong.css"

interface CutSongProps {
  songs: Song[]
}

const CutSong = ({ songs }: CutSongProps) => {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [startMarker, setStartMarker] = useState<number>(0)
  const [endMarker, setEndMarker] = useState<number>(100)
  const [isCutting, setIsCutting] = useState<boolean>(false)
  const [cutComplete, setCutComplete] = useState<boolean>(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const waveformCanvasRef = useRef<HTMLCanvasElement>(null)

  // Parse song length from format "00:03:45" to seconds
  const parseSongLength = (songLength: string): number => {
    const parts = songLength.split(":")
    if (parts.length === 3) {
      return Number.parseInt(parts[0]) * 3600 + Number.parseInt(parts[1]) * 60 + Number.parseInt(parts[2])
    }
    return 0
  }

  useEffect(() => {
    if (selectedSong) {
      // In a real app, we would load the actual audio file
      // For demo purposes, we'll simulate the audio duration
      const songDuration = parseSongLength(selectedSong.songLength)
      setDuration(songDuration)
      setEndMarker(songDuration)

      // Draw waveform
      drawWaveform()
    }
  }, [selectedSong])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => {
      setCurrentTime(audio.currentTime)
    }

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("ended", () => setIsPlaying(false))

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("ended", () => setIsPlaying(false))
    }
  }, [])

  const drawWaveform = () => {
    const canvas = waveformCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Generate random waveform for demo
    const width = canvas.width
    const height = canvas.height
    const barWidth = 2
    const barGap = 1
    const bars = Math.floor(width / (barWidth + barGap))

    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"

    for (let i = 0; i < bars; i++) {
      // Random height for each bar
      const barHeight = Math.random() * (height * 0.8) + height * 0.1

      ctx.fillRect(i * (barWidth + barGap), (height - barHeight) / 2, barWidth, barHeight)
    }

    // Draw selection area
    if (selectedSong) {
      const startX = (startMarker / duration) * width
      const endX = (endMarker / duration) * width

      ctx.fillStyle = "rgba(107, 102, 255, 0.3)"
      ctx.fillRect(startX, 0, endX - startX, height)

      // Draw markers
      ctx.fillStyle = "#6b66ff"
      ctx.fillRect(startX - 2, 0, 4, height)
      ctx.fillRect(endX - 2, 0, 4, height)
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
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const handleMarkerChange = (marker: "start" | "end", value: number) => {
    if (marker === "start") {
      setStartMarker(Math.min(value, endMarker - 1))
    } else {
      setEndMarker(Math.max(value, startMarker + 1))
    }
    drawWaveform()
  }

  const cutSong = () => {
    setIsCutting(true)

    // In a real app, we would send the cut parameters to an API
    // For demo purposes, we'll simulate the cutting process
    setTimeout(() => {
      setIsCutting(false)
      setCutComplete(true)
    }, 2000)
  }

  const resetCut = () => {
    if (selectedSong) {
      setStartMarker(0)
      setEndMarker(parseSongLength(selectedSong.songLength))
      setCutComplete(false)
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
              <canvas ref={waveformCanvasRef} className="waveform-canvas" width={800} height={150}></canvas>

              {/* Hidden audio element for playback */}
              <audio
                ref={audioRef}
                src="/sample-audio.mp3" // In a real app, this would be the actual song URL
                style={{ display: "none" }}
              />
            </div>

            <div className="time-markers">
              <div className="time-marker">
                <span>Start: {formatTime(startMarker)}</span>
                <input
                  type="range"
                  min={0}
                  max={duration}
                  value={startMarker}
                  onChange={(e) => handleMarkerChange("start", Number(e.target.value))}
                  className="marker-slider"
                />
              </div>
              <div className="time-marker">
                <span>End: {formatTime(endMarker)}</span>
                <input
                  type="range"
                  min={0}
                  max={duration}
                  value={endMarker}
                  onChange={(e) => handleMarkerChange("end", Number(e.target.value))}
                  className="marker-slider"
                />
              </div>
            </div>

            <div className="cut-actions">
              <button className="reset-button" onClick={resetCut}>
                <RotateCcw size={18} />
                <span>Reset</span>
              </button>
              <button className="cut-button" onClick={cutSong} disabled={isCutting || cutComplete}>
                {isCutting ? (
                  <span>Processing...</span>
                ) : cutComplete ? (
                  <>
                    <Save size={18} />
                    <span>Save Cut</span>
                  </>
                ) : (
                  <>
                    <Scissors size={18} />
                    <span>Cut Song</span>
                  </>
                )}
              </button>
            </div>

            {cutComplete && (
              <div className="cut-complete">
                <p>Your cut is complete! The new song duration is {formatTime(endMarker - startMarker)}.</p>
                <div className="cut-preview">
                  <div className="cut-preview-info">
                    <Music size={20} />
                    <span>{selectedSong.name} (Cut)</span>
                  </div>
                  <button className="download-cut-button">
                    <Save size={18} />
                    <span>Download</span>
                  </button>
                </div>
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
