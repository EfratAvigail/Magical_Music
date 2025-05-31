"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, X, Loader, Bot, User, ChevronDown, ChevronUp } from 'lucide-react'
// import { aiAPI } from "../services/api"
import { ChatMessage } from "../types"
import "../styles/aichat.css"

interface AIChatProps {
  isOpen: boolean
  onClose: () => void
}

const AIChat = ({ isOpen, onClose }: AIChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your AI music assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMinimized, setIsMinimized] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (inputRef.current && !isMinimized && isOpen) {
      inputRef.current.focus()
    }
  }, [isMinimized, isOpen])

  if (!isOpen) return null

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setError(null)
    setIsLoading(true)

    try {
      const messageHistory = [
        ...messages.filter((msg) => msg.id !== "welcome"),
        userMessage,
      ].map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

const response = await fetch(`https://magical-music.onrender.com/api/chat`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ messages: messageHistory }),
});



const data = await response.json();
console.log("API Response", data); // 👈

if (!response.ok) {
  const content =
    data?.content ||
    (data?.error?.message?.includes("מוזיקה")
      ? "אני כאן כדי לעזור רק בשאלות שקשורות למוזיקה 🎵. נסה לשאול שאלה אחרת."
      : "לא הצלחתי להבין את השאלה. נסה שוב.");

  const aiMessage: ChatMessage = {
    id: Date.now().toString(),
    role: "assistant",
    content,
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, aiMessage]);
  setIsLoading(false);
  return;
}



const aiMessage: ChatMessage = {
  id: Date.now().toString(),
  role: "assistant",
  content: data.content || "I'm not sure how to respond to that.",
  timestamp: new Date(),
}

setMessages((prev) => [...prev, aiMessage])

    } catch (error: any) {
      console.error("AI chat error:", error)
      setError(`Failed to get response: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  return (
    <div className={`ai-chat-container ${isMinimized ? "minimized" : ""}`}>
      <div className="ai-chat-header">
        <div className="ai-chat-title">
          <Bot size={20} />
          <span>AI Music Assistant</span>
        </div>
        <div className="ai-chat-controls">
          <button className="ai-chat-control-button" onClick={toggleMinimize}>
            {isMinimized ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          <button className="ai-chat-control-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="ai-chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`ai-chat-message ${message.role}`}>
                <div className="ai-chat-message-avatar">
                  {message.role === "assistant" ? <Bot size={20} /> : <User size={20} />}
                </div>
                <div className="ai-chat-message-content">
                  <div className="ai-chat-message-text">{message.content}</div>
                  <div className="ai-chat-message-time">{formatTime(message.timestamp)}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="ai-chat-message assistant">
                <div className="ai-chat-message-avatar">
                  <Bot size={20} />
                </div>
                <div className="ai-chat-message-content">
                  <div className="ai-chat-message-text typing">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div className="ai-chat-error">
                <p>{error}</p>
                <p>Please try again or ask a different question.</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="ai-chat-input-container">
            <textarea
              ref={inputRef}
              className="ai-chat-input"
              placeholder="Ask me anything about music..."
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={isLoading}
            />
            <button className="ai-chat-send-button" onClick={handleSendMessage} disabled={!input.trim() || isLoading}>
              {isLoading ? <Loader size={18} className="spinner" /> : <Send size={18} />}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default AIChat
// This component provides a chat interface for interacting with an AI music assistant.
// It allows users to send messages and receive responses, with a minimized mode for compact display.