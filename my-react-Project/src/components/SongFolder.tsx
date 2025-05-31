"use client"

import { useState } from "react"
import { FolderPlus, MoreHorizontal, Play, Heart, Filter, SortDesc, Grid, List } from "lucide-react"
import axios from "axios" // הוספת Axios
import type { Song } from "../types"
import "../styles/songfolder.css"
  // const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || ""
interface SongFolderProps {
  songs: Song[]
}

const SongFolder = ({ songs }: SongFolderProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"name" | "date" | "style">("name")
  const [filterStyle, setFilterStyle] = useState<string>("")

  // Get unique music styles for filter
  const musicStyles = Array.from(new Set(songs.map((song) => song.musicStyle)))

  // Sort songs based on current sort option
  const sortedSongs = [...songs].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name)
    } else if (sortBy === "date") {
      return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
    } else {
      return a.musicStyle.localeCompare(b.musicStyle)
    }
  })

  // Filter songs by music style if filter is active
  const filteredSongs = filterStyle ? sortedSongs.filter((song) => song.musicStyle === filterStyle) : sortedSongs

  // Format date to display in a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Function to play the song using Axios
const onPlaySong = async (song: Song) => {
  try {
    const response = await axios.get(`https://magical-music.onrender.com/api/UploadFile/download-url`, {
      params: { fileName: song.name }
    });
    
    // הנחה שה-API מחזיר אובייקט עם fileUrl
    const audioUrl = response.data.fileUrl; 
    const audio = new Audio(audioUrl);
    audio.play();
  } catch (error) {
    console.error("Failed to fetch the song", error);
  }
}


  return (
    <div className="song-folder">
      <div className="folder-header">
        <h2>Your Song Collection</h2>
        <div className="folder-actions">
          <button className="folder-action-button">
            <FolderPlus size={18} />
            <span>New Folder</span>
          </button>
          <div className="view-options">
            <button
              className={`view-option ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <Grid size={18} />
            </button>
            <button
              className={`view-option ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="folder-filters">
        <div className="filter-group">
          <label>
            <Filter size={16} />
            <span>Filter by:</span>
          </label>
          <select value={filterStyle} onChange={(e) => setFilterStyle(e.target.value)} className="filter-select">
            <option value="">All Styles</option>
            {musicStyles.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>
            <SortDesc size={16} />
            <span>Sort by:</span>
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "name" | "date" | "style")}
            className="filter-select"
          >
            <option value="name">Name</option>
            <option value="date">Release Date</option>
            <option value="style">Music Style</option>
          </select>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="songs-grid">
          {filteredSongs.map((song) => (
            <div key={song.id} className="song-card">
              <div className="song-card-image">
                <img src={song.imageUrl || "/placeholder.svg?height=200&width=200"} alt={song.name} />
                <div className="song-card-overlay">
                  <button className="play-overlay-button" onClick={() => onPlaySong(song)}>
                    <Play size={32} />
                  </button>
                </div>
              </div>
              <div className="song-card-info">
                <h3>{song.name}</h3>
                <p className="song-style">{song.musicStyle}</p>
                <div className="song-card-meta">
                  <span className="song-date">{formatDate(song.releaseDate)}</span>
                  <button className={`like-button ${song.liked ? "liked" : ""}`}>
                    <Heart size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="songs-list">
          <table className="songs-table">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Style</th>
                <th>Length</th>
                <th>Release Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSongs.map((song) => (
                <tr key={song.id} className="song-row">
                  <td>
                    <div className="song-row-image">
                      <img src={song.imageUrl || "/placeholder.svg?height=40&width=40"} alt={song.name} />
                      <button className="play-row-button" onClick={() => onPlaySong(song)}>
                        <Play size={16} />
                      </button>
                    </div>
                  </td>
                  <td>{song.name}</td>
                  <td>{song.musicStyle}</td>
                  <td>{song.songLength.substring(3)}</td>
                  <td>{formatDate(song.releaseDate)}</td>
                  <td>
                    <div className="song-row-actions">
                      <button className={`like-button ${song.liked ? "liked" : ""}`}>
                        <Heart size={16} />
                      </button>
                      <button className="more-button">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default SongFolder
