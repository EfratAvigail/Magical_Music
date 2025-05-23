"use client"

import { useState, useEffect } from "react"
import { Play, Pause, Heart, Trash2, Edit, Music, Filter, X } from "lucide-react"
import { songAPI, singerAPI } from "../services/api"
import type { Song, Singer } from "../types"
import "../styles/songlibrary.css"

const SongLibrary = () => {
  console.log("SongLibrary component rendering")

  const [songs, setSongs] = useState<Song[]>([])
  const [singers, setSingers] = useState<Singer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState<string>("")
  const [selectedSinger, setSelectedSinger] = useState<string>("")
  const [showFilters, setShowFilters] = useState(false)

  // Fetch songs and singers on component mount
  useEffect(() => {
    console.log("SongLibrary: useEffect running to fetch data")
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("Fetching songs and singers...")

        // Fetch songs
        try {
          const songsData = await songAPI.getAllSongs()
          console.log("Songs fetched:", songsData)
          setSongs(Array.isArray(songsData) ? songsData : [])
        } catch (songError: any) {
          console.error("Error fetching songs:", songError)
          setError(`Failed to load songs: ${songError.message || "Unknown error"}`)
          setSongs([])
        }

        // Fetch singers
        try {
          const singersData = await singerAPI.getAllSingers()
          console.log("Singers fetched:", singersData)
          setSingers(Array.isArray(singersData) ? singersData : [])
        } catch (singerError: any) {
          console.error("Error fetching singers:", singerError)
          // Don't override song error if it exists
          if (!error) {
            setError(`Failed to load singers: ${singerError.message || "Unknown error"}`)
          }
        }
      } catch (error: any) {
        console.error("Error fetching data:", error)
        setError(error.message || "Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Handle play/pause
  const togglePlay = (songId: number) => {
    if (currentlyPlaying === songId) {
      setIsPlaying(!isPlaying)
    } else {
      setCurrentlyPlaying(songId)
      setIsPlaying(true)
    }
  }

  // Handle song deletion
  const handleDeleteSong = async (songId: number) => {
    if (!window.confirm("Are you sure you want to delete this song?")) {
      return
    }

    try {
      await songAPI.deleteSong(songId)
      setSongs((prevSongs) => prevSongs.filter((song) => song.id !== songId))
    } catch (error: any) {
      console.error("Error deleting song:", error)
      alert("Failed to delete song: " + (error.message || "Unknown error"))
    }
  }

  // Filter songs based on search term, genre, and singer
  const filteredSongs = songs.filter((song) => {
    const matchesSearch =
      song.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (song.singerName && song.singerName.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesGenre = selectedGenre ? song.musicStyle === selectedGenre : true
    const matchesSinger = selectedSinger ? song.singerId === Number.parseInt(selectedSinger) : true

    return matchesSearch && matchesGenre && matchesSinger
  })

  // Get unique genres from songs
  const genres = [...new Set(songs.map((song) => song.musicStyle))].filter(Boolean).sort()

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("")
    setSelectedGenre("")
    setSelectedSinger("")
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading songs...</p>
      </div>
    )
  }

  return (
    <div className="song-library-container">
      <div className="library-header">
        <h2>My Music Library</h2>
        <div className="search-container">
          <div className="search-input-wrapper">
            {/* <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search songs or artists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            /> */}
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm("")}>
                <X size={16} />
              </button>
            )}
          </div>
          <button className="filter-button" onClick={() => setShowFilters(!showFilters)}>
            <Filter size={18} />
            <span>Filter</span>
          </button>
        </div>

        {showFilters && (
          <div className="filters-container">
            <div className="filter-group">
              <label>Genre</label>
              <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
                <option value="">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Artist</label>
              <select value={selectedSinger} onChange={(e) => setSelectedSinger(e.target.value)}>
                <option value="">All Artists</option>
                {singers.map((singer) => (
                  <option key={singer.id} value={singer.id}>
                    {singer.name}
                  </option>
                ))}
              </select>
            </div>
            <button className="clear-filters-button" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      )}

      {!error && filteredSongs.length === 0 ? (
        <div className="no-songs">
          <Music size={48} />
          <p>No songs found. Try adjusting your filters or upload some songs!</p>
        </div>
      ) : (
        <div className="songs-grid">
          {filteredSongs.map((song) => (
            <div key={song.id} className="song-card">
              <div className="song-image">
                {song.imageUrl ? (
                  <img src={song.imageUrl || "/placeholder.svg"} alt={song.name} />
                ) : (
                  <div className="placeholder-image">
                    <Music size={32} />
                  </div>
                )}
                <div className="play-overlay" onClick={() => togglePlay(song.id)}>
                  {currentlyPlaying === song.id && isPlaying ? (
                    <Pause className="play-icon" size={32} />
                  ) : (
                    <Play className="play-icon" size={32} />
                  )}
                </div>
              </div>
              <div className="song-info">
                <h3 className="song-title">{song.name}</h3>
                <p className="song-artist">{song.singerName}</p>
                <p className="song-genre">{song.musicStyle}</p>
              </div>
              <div className="song-actions">
                <button className="action-button like">
                  <Heart size={18} className={song.liked ? "liked" : ""} />
                </button>
                <button className="action-button edit">
                  <Edit size={18} />
                </button>
                <button className="action-button delete" onClick={() => handleDeleteSong(song.id)}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SongLibrary
