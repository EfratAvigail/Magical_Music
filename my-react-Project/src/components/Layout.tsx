"use client"

import type React from "react"

import { useState } from "react"
import SideMenu from "./SideMenu"
import "../styles/layout.css"

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const [activeView, setActiveView] = useState<string>("library")

  const handleNavigate = (view: string) => {
    setActiveView(view)
    window.location.hash = view
  }

  return (
    <div className="layout">
      <SideMenu onNavigate={handleNavigate} activeView={activeView} />
      <main className="layout-content">{children}</main>
    </div>
  )
}

export default Layout
