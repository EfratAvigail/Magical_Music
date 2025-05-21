// SideMenu.tsx

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Music, Upload, Mic, Bot, LogOut, Menu, X, ChevronRight, Search, Share, Scissors } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import AIChat from "./AIChat"
import MusicPlayer from "./MusicPlayer"
import "../styles/sidemenu.css"

interface MenuItem {
  id: string
  label: string
  icon: React.ReactNode
}

interface SideMenuProps {
  onNavigate?: (view: string) => void
}

const SideMenu = ({ onNavigate }: SideMenuProps) => {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAIChatOpen, setIsAIChatOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Menu items with proper routing paths
  const menuItems: MenuItem[] = [
    { id: "/dashboard", label: "Home", icon: <Music size={20} /> },
    { id: "/dashboard/folder", label: "Song Folder", icon: <Upload size={20} /> },
    { id: "/dashboard/upload", label: "Upload Song", icon: <Upload size={20} /> }, // Added Upload Song item
    { id: "/dashboard/transcribe", label: "Transcribe", icon: <Mic size={20} /> },
    { id: "/dashboard/cut", label: "Cut Song", icon: <Scissors size={20} /> },
    { id: "/dashboard/share", label: "Share Song", icon: <Share size={20} /> },
    { id: "/dashboard/search", label: "Search Songs", icon: <Search size={20} /> },
  ]

  // Check if route is active
  const isActive = (path: string) => {
    return location.pathname === path || (path !== "/dashboard" && location.pathname.startsWith(path))
  }

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      // If mobile, close menu automatically
      if (mobile && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    // Initial check
    checkMobile()

    // Add listener for window resize
    window.addEventListener("resize", checkMobile)

    // Clean up listener
    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [isMenuOpen])

  // Handle mouse hover
  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    if (!isLocked) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovering(false)
      }, 300)
    }
  }

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleLock = () => {
    setIsLocked(!isLocked)
  }

  const handleAIClick = () => {
    setIsAIChatOpen(true)
    if (isMobile) {
      setIsMenuOpen(false)
    }
  }

  const closeAIChat = () => {
    setIsAIChatOpen(false)
  }

  const handleNavigation = (viewId: string) => {
    if (typeof onNavigate === "function") {
      onNavigate(viewId)
    }

    if (isMobile) {
      setIsMenuOpen(false)
    }
  }

  const isExpanded = isMobile ? isMenuOpen : isHovering || isLocked

  return (
    <>
      {!isMobile && (
        <div
          className="menu-hover-trigger"
          ref={triggerRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <ChevronRight size={20} />
        </div>
      )}

      <div className="mobile-menu-toggle" onClick={toggleMenu}>
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </div>

      <div
        className={`side-menu ${isMobile ? (isMenuOpen ? "open" : "") : isExpanded ? "expanded" : ""}`}
        ref={menuRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="side-menu-header">
          <h2>Magical Music</h2>
          {!isMobile && (
            <button
              className={`lock-button ${isLocked ? "locked" : ""}`}
              onClick={toggleLock}
              title={isLocked ? "Unlock menu" : "Lock menu open"}
            >
              <div className="lock-icon"></div>
            </button>
          )}
        </div>

        <nav className="side-menu-nav">
          <ul>
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.id}
                  className={`side-menu-item ${isActive(item.id) ? "active" : ""}`}
                  onClick={() => handleNavigation(item.id)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
            <li>
              <button className="side-menu-item" onClick={handleAIClick}>
                <Bot size={20} />
                <span>AI Assistant</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="side-menu-player">
          <MusicPlayer isCollapsed={!isExpanded} />
        </div>

        <div className="side-menu-footer">
          <Link to="/login" className="logout-button">
            <LogOut size={20} />
            <span>Logout</span>
          </Link>
        </div>
      </div>

      {isAIChatOpen && <AIChat isOpen={isAIChatOpen} onClose={closeAIChat} />}
    </>
  )
}

export default SideMenu
