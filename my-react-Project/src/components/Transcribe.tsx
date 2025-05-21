"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  Mic,
  StopCircle,
  Play,
  Pause,
  Send,
  Loader,
  CheckCircle,
  AlertCircle,
  FileText,
  X,
  Upload,
  Music,
} from "lucide-react"
import axios from "axios"
import "../styles/transcribe.css"

interface TranscriptionState {
  text: string
  confidence: number
}

const ASSEMBLY_AI_API_KEY = "72956af2d493457a9a1dfdf5661522aa"

const Transcribe = () => {
  console.log("Transcribe component rendering")

  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [recordingTime, setRecordingTime] = useState<number>(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [transcribing, setTranscribing] = useState<boolean>(false)
  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionState | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [transcriptionStatus, setTranscriptionStatus] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [sendingEmail, setSendingEmail] = useState<boolean>(false)
  const [emailSent, setEmailSent] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false)
  const [uploadedAudioFile, setUploadedAudioFile] = useState<File | null>(null)
  const [uploadedAudioDuration, setUploadedAudioDuration] = useState<number>(0)
  const [activeTab, setActiveTab] = useState<"record" | "upload">("record")

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Clean up audio URL when component unmounts
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }

      // Stop any active media streams
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [audioUrl])

  // Handle recording timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1)
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRecording])

  // Format seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Start recording from microphone
  const startRecording = async () => {
    try {
      setError(null)

      // Reset states
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
        setAudioUrl(null)
      }
      setAudioBlob(null)
      setTranscriptionResult(null)
      setEmailSent(false)
      setRecordingTime(0)
      audioChunksRef.current = []

      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" })
      mediaRecorderRef.current = mediaRecorder

      // Handle data available event
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      // Handle recording stop
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        const url = URL.createObjectURL(audioBlob)
        setAudioBlob(audioBlob)
        setAudioUrl(url)

        // Stop all tracks in the stream
        stream.getTracks().forEach((track) => track.stop())
      }

      // Start recording
      mediaRecorder.start(1000) // Collect data every second
      setIsRecording(true)
    } catch (error: any) {
      console.error("Error starting recording:", error)

      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        setPermissionDenied(true)
        setError("Microphone access denied. Please allow microphone access to use this feature.")
      } else {
        setError(`Failed to start recording: ${error.message || "Unknown error"}`)
      }
    }
  }

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  // Play/pause recorded audio
  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Handle audio playback ended
  const handlePlaybackEnded = () => {
    setIsPlaying(false)
  }

  // Upload audio to AssemblyAI
  const uploadAudioToAssemblyAI = async (audioBlob: Blob): Promise<string> => {
    setTranscriptionStatus("Uploading audio...")

    // Convert blob to base64
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
      reader.onloadend = async () => {
        try {
          const base64Audio = reader.result as string
          const base64Data = base64Audio.split(",")[1]

          // Upload to AssemblyAI
          const uploadResponse = await axios.post("https://api.assemblyai.com/v2/upload", base64Data, {
            headers: {
              "Content-Type": "application/octet-stream",
              Authorization: ASSEMBLY_AI_API_KEY,
            },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                setUploadProgress(progress)
              }
            },
          })

          resolve(uploadResponse.data.upload_url)
        } catch (error: any) {
          reject(new Error(`Failed to upload audio: ${error.message}`))
        }
      }
      reader.onerror = () => reject(new Error("Failed to read audio file"))
      reader.readAsDataURL(audioBlob)
    })
  }

  // Transcribe audio using AssemblyAI
  const transcribeAudio = async () => {
    if (!audioBlob) {
      setError("No audio recording found. Please record audio first.")
      return
    }

    try {
      setError(null)
      setTranscribing(true)
      setUploadProgress(0)
      setTranscriptionStatus("Preparing transcription...")

      // Upload audio to AssemblyAI
      const audioUrl = await uploadAudioToAssemblyAI(audioBlob)

      // Create transcription request
      setTranscriptionStatus("Starting transcription...")
      const transcriptionResponse = await axios.post(
        "https://api.assemblyai.com/v2/transcript",
        {
          audio_url: audioUrl,
          speech_model: "universal",
        },
        {
          headers: {
            Authorization: ASSEMBLY_AI_API_KEY,
            "Content-Type": "application/json",
          },
        },
      )

      const transcriptId = transcriptionResponse.data.id
      const pollingEndpoint = `https://api.assemblyai.com/v2/transcript/${transcriptId}`

      // Poll for transcription result
      setTranscriptionStatus("Processing transcription...")
      let pollingInterval: NodeJS.Timeout

      const checkTranscriptionStatus = async () => {
        try {
          const pollingResponse = await axios.get(pollingEndpoint, {
            headers: {
              Authorization: ASSEMBLY_AI_API_KEY,
            },
          })

          const transcriptionResult = pollingResponse.data

          if (transcriptionResult.status === "completed") {
            clearInterval(pollingInterval)
            setTranscriptionResult({
              text: transcriptionResult.text,
              confidence: transcriptionResult.confidence || 0.9,
            })
            setTranscribing(false)
            setTranscriptionStatus("")
          } else if (transcriptionResult.status === "error") {
            clearInterval(pollingInterval)
            setTranscribing(false)
            setTranscriptionStatus("")
            throw new Error(`Transcription failed: ${transcriptionResult.error}`)
          } else {
            // Still processing
            setTranscriptionStatus(`Processing transcription (${transcriptionResult.status})...`)
          }
        } catch (error: any) {
          clearInterval(pollingInterval)
          setTranscribing(false)
          setTranscriptionStatus("")
          setError(`Transcription error: ${error.message}`)
        }
      }

      // Check status every 3 seconds
      pollingInterval = setInterval(checkTranscriptionStatus, 3000)

      // Initial check
      await checkTranscriptionStatus()
    } catch (error: any) {
      console.error("Transcription error:", error)
      setError(`Transcription failed: ${error.message || "Unknown error"}`)
      setTranscribing(false)
      setTranscriptionStatus("")
    }
  }

  // Send transcription via email
  const sendEmail = async () => {
    if (!transcriptionResult) {
      setError("No transcription available. Please transcribe the audio first.")
      return
    }

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.")
      return
    }

    try {
      setError(null)
      setSendingEmail(true)

      // Call the email API
      const response = await fetch("https://localhost:7234/api/Email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email,
          subject: "Your Audio Transcription from Magical Music",
          body: `
            <html>
              <body>
                <h1>Your Audio Transcription</h1>
                <p>Here is the transcription of your audio recording:</p>
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                  <p>${transcriptionResult.text}</p>
                </div>
                <p>Confidence level: ${(transcriptionResult.confidence * 100).toFixed(1)}%</p>
                <p>Thank you for using Magical Music!</p>
              </body>
            </html>
          `,
          isHtml: true,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Email sending failed: ${response.status}`)
      }

      setEmailSent(true)
    } catch (error: any) {
      console.error("Email sending error:", error)
      setError(`Failed to send email: ${error.message || "Unknown error"}`)
    } finally {
      setSendingEmail(false)
    }
  }

  // Clear the current recording
  const clearRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    setAudioBlob(null)
    setAudioUrl(null)
    setTranscriptionResult(null)
    setEmailSent(false)
    setRecordingTime(0)
    audioChunksRef.current = []
  }

  // Handle audio file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Check if it's an audio file
      if (!file.type.startsWith("audio/")) {
        setError("Please select a valid audio file.")
        return
      }

      // Reset states
      clearRecording()
      setUploadedAudioFile(file)

      // Create audio element to get duration
      const audio = new Audio()
      audio.src = URL.createObjectURL(file)

      audio.onloadedmetadata = () => {
        setUploadedAudioDuration(Math.floor(audio.duration))
        setRecordingTime(Math.floor(audio.duration))

        // Create audio URL for playback
        const url = URL.createObjectURL(file)
        setAudioBlob(file)
        setAudioUrl(url)

        // Clean up
        audio.remove()
      }
    }
  }

  // Switch between record and upload tabs
  const switchTab = (tab: "record" | "upload") => {
    setActiveTab(tab)
    clearRecording()
    setError(null)
  }

  return (
    <div className="transcribe-container">
      <div className="transcribe-header">
        <h2>Transcribe Audio</h2>
        <p className="transcribe-description">
          Record audio or upload a song and convert it to text with our AI-powered transcription.
        </p>
      </div>

      <div className="transcribe-content">
        {permissionDenied && activeTab === "record" ? (
          <div className="permission-denied">
            <AlertCircle size={48} />
            <h3>Microphone Access Required</h3>
            <p>
              This feature requires microphone access to record audio. Please allow microphone access in your browser
              settings and refresh the page.
            </p>
            <button className="retry-button" onClick={() => setPermissionDenied(false)}>
              Try Again
            </button>
            <p>Or you can switch to upload mode:</p>
            <button className="switch-tab-button" onClick={() => switchTab("upload")}>
              Switch to Upload
            </button>
          </div>
        ) : (
          <>
            <div className="tabs-container">
              <div className="tabs">
                <button className={`tab ${activeTab === "record" ? "active" : ""}`} onClick={() => switchTab("record")}>
                  <Mic size={18} />
                  <span>Record Audio</span>
                </button>
                <button className={`tab ${activeTab === "upload" ? "active" : ""}`} onClick={() => switchTab("upload")}>
                  <Upload size={18} />
                  <span>Upload Audio</span>
                </button>
              </div>
            </div>

            {activeTab === "record" ? (
              <div className="recording-section">
                <div className={`microphone-visualizer ${isRecording ? "active" : ""}`}>
                  <div className="visualizer-circle"></div>
                  <div className="visualizer-waves">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`wave wave-${i + 1}`}></div>
                    ))}
                  </div>
                  {isRecording ? (
                    <button className="record-button recording" onClick={stopRecording}>
                      <StopCircle size={32} />
                      <span>Stop</span>
                    </button>
                  ) : (
                    <button className="record-button" onClick={startRecording}>
                      <Mic size={32} />
                      <span>Record</span>
                    </button>
                  )}
                </div>

                {recordingTime > 0 && !isRecording && (
                  <div className="recording-time">
                    <span>{formatTime(recordingTime)}</span>
                  </div>
                )}

                {isRecording && (
                  <div className="recording-time">
                    <span>{formatTime(recordingTime)}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="upload-section">
                <input
                  type="file"
                  id="audio-upload"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden-input"
                />
                <label htmlFor="audio-upload" className="upload-label">
                  {uploadedAudioFile ? (
                    <div className="selected-file-info">
                      <Music size={24} />
                      <div className="file-details">
                        <span className="file-name">{uploadedAudioFile.name}</span>
                        <span className="file-meta">
                          {(uploadedAudioFile.size / (1024 * 1024)).toFixed(2)} MB • {formatTime(uploadedAudioDuration)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload size={48} />
                      <p>Click to upload or drag and drop your audio file here</p>
                      <span className="upload-hint">MP3, WAV, FLAC, OGG (max 50MB)</span>
                    </>
                  )}
                </label>
              </div>
            )}

            {audioUrl && (
              <div className="audio-player">
                <audio ref={audioRef} src={audioUrl} onEnded={handlePlaybackEnded} />
                <div className="audio-controls">
                  <button className="control-button" onClick={togglePlayback}>
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <div className="audio-info">
                    <span>
                      {activeTab === "record" ? "Recording" : "Uploaded Audio"} ({formatTime(recordingTime)})
                    </span>
                  </div>
                  <button className="control-button delete" onClick={clearRecording}>
                    <X size={20} />
                  </button>
                </div>
              </div>
            )}

            {audioBlob && !transcribing && !transcriptionResult && (
              <button className="transcribe-button" onClick={transcribeAudio}>
                <FileText size={18} />
                <span>Transcribe Audio</span>
              </button>
            )}

            {transcribing && (
              <div className="transcribing-status">
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                  <span className="progress-text">{transcriptionStatus || "Processing..."}</span>
                </div>
                <Loader size={24} className="spinner" />
              </div>
            )}

            {transcriptionResult && (
              <div className="transcription-result">
                <div className="result-header">
                  <h3>Transcription Result</h3>
                  <div className="confidence-indicator">
                    <span>Confidence:</span>
                    <div className="confidence-bar">
                      <div
                        className="confidence-fill"
                        style={{
                          width: `${transcriptionResult.confidence * 100}%`,
                          backgroundColor: `hsl(${transcriptionResult.confidence * 120}, 80%, 50%)`,
                        }}
                      ></div>
                    </div>
                    <span>{(transcriptionResult.confidence * 100).toFixed(1)}%</span>
                  </div>
                </div>
                <div className="transcription-text">{transcriptionResult.text}</div>

                <div className="email-section">
                  <h3>Send Transcription to Email</h3>
                  <div className="email-form">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={sendingEmail || emailSent}
                    />
                    <button
                      className="send-email-button"
                      onClick={sendEmail}
                      disabled={sendingEmail || emailSent || !email}
                    >
                      {sendingEmail ? (
                        <Loader size={18} className="spinner" />
                      ) : emailSent ? (
                        <CheckCircle size={18} />
                      ) : (
                        <Send size={18} />
                      )}
                      <span>{sendingEmail ? "Sending..." : emailSent ? "Sent!" : "Send"}</span>
                    </button>
                  </div>
                  {emailSent && <div className="email-success">Email sent successfully!</div>}
                </div>
              </div>
            )}

            {error && (
              <div className="error-message">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Transcribe
