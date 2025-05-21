"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, X, Check, Loader, User, Search } from "lucide-react"
import { singerAPI } from "../services/api"
import type { Singer } from "../types"
import "../styles/singermanagement.css"

const SingerManagement = () => {
  console.log("SingerManagement component rendering")
  const [singers, setSingers] = useState<Singer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingSingerId, setEditingSingerId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    biography: "",
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch singers on component mount
  useEffect(() => {
    fetchSingers()
  }, [])

  const fetchSingers = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Fetching singers...")

      const data = await singerAPI.getAllSingers()
      console.log("Singers fetched:", data)

      setSingers(Array.isArray(data) ? data : [])
    } catch (error: any) {
      console.error("Error fetching singers:", error)
      setError(error.message || "Failed to load singers")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file.")
        return
      }

      setSelectedImage(file)

      // Create preview
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc)
      }

      const objectUrl = URL.createObjectURL(file)
      setImageSrc(objectUrl)
    }
  }

  const clearImageSelection = () => {
    if (imageSrc) {
      URL.revokeObjectURL(imageSrc)
    }
    setSelectedImage(null)
    setImageSrc(null)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      biography: "",
    })
    clearImageSelection()
  }

  const handleAddSinger = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      alert("Please enter a singer name.")
      return
    }

    try {
      setSubmitting(true)
      const singerFormData = new FormData()
      singerFormData.append("name", formData.name)
      singerFormData.append("biography", formData.biography || "")
      if (selectedImage) {
        singerFormData.append("imageFile", selectedImage)
      }

      await singerAPI.addSinger(singerFormData)
      await fetchSingers()
      resetForm()
      setShowAddForm(false)
    } catch (error: any) {
      console.error("Error adding singer:", error)
      alert("Failed to add singer: " + (error.message || "Unknown error"))
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditSinger = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !editingSingerId) {
      return
    }

    try {
      setSubmitting(true)
      const singerFormData = new FormData()
      singerFormData.append("name", formData.name)
      singerFormData.append("biography", formData.biography || "")
      if (selectedImage) {
        singerFormData.append("imageFile", selectedImage)
      }

      await singerAPI.updateSinger(editingSingerId, singerFormData)
      await fetchSingers()
      resetForm()
      setEditingSingerId(null)
    } catch (error: any) {
      console.error("Error updating singer:", error)
      alert("Failed to update singer: " + (error.message || "Unknown error"))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteSinger = async (singerId: number) => {
    if (!window.confirm("Are you sure you want to delete this singer? This will also delete all associated songs.")) {
      return
    }

    try {
      await singerAPI.deleteSinger(singerId)
      setSingers((prevSingers) => prevSingers.filter((singer) => singer.id !== singerId))
    } catch (error: any) {
      console.error("Error deleting singer:", error)
      alert("Failed to delete singer: " + (error.message || "Unknown error"))
    }
  }

  const startEditing = (singer: Singer) => {
    setFormData({
      name: singer.name,
      biography: singer.biography || "",
    })
    setImageSrc(singer.imageUrl || null)
    setEditingSingerId(singer.id)
    setShowAddForm(false)
  }

  const cancelEditing = () => {
    resetForm()
    setEditingSingerId(null)
  }

  const filteredSingers = singers.filter((singer) => singer.name.toLowerCase().includes(searchTerm.toLowerCase()))

  if (loading && singers.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading singers...</p>
      </div>
    )
  }

  if (error && singers.length === 0) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={() => fetchSingers()}>Try Again</button>
      </div>
    )
  }

  return (
    <div className="singer-management-container">
      <div className="singer-management-header">
        <h2>Artist Management</h2>
        <div className="header-actions">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search artists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm("")}>
                <X size={16} />
              </button>
            )}
          </div>
          {!showAddForm && !editingSingerId && (
            <button className="add-singer-button" onClick={() => setShowAddForm(true)}>
              <Plus size={18} />
              <span>Add Artist</span>
            </button>
          )}
        </div>
      </div>

      {showAddForm && (
        <div className="singer-form-container">
          <h3>Add New Artist</h3>
          <form onSubmit={handleAddSinger}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter artist name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="biography">Biography</label>
              <textarea
                id="biography"
                name="biography"
                value={formData.biography}
                onChange={handleInputChange}
                placeholder="Enter artist biography"
                rows={4}
              />
            </div>

            <div className="form-group">
              <label>Profile Image</label>
              <div className="image-upload-container">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden-input"
                />
                {selectedImage && imageSrc ? (
                  <div className="image-preview-container">
                    <img src={imageSrc || "/placeholder.svg"} alt="Preview" className="image-preview" />
                    <button type="button" className="remove-image" onClick={clearImageSelection}>
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label htmlFor="image-upload" className="image-upload-label">
                    <User size={24} />
                    <span>Upload Image</span>
                  </label>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
              <button type="submit" className="submit-button" disabled={submitting}>
                {submitting ? <Loader size={18} className="spinner" /> : <Check size={18} />}
                <span>Add Artist</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {editingSingerId && (
        <div className="singer-form-container">
          <h3>Edit Artist</h3>
          <form onSubmit={handleEditSinger}>
            <div className="form-group">
              <label htmlFor="edit-name">Name</label>
              <input
                type="text"
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter artist name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-biography">Biography</label>
              <textarea
                id="edit-biography"
                name="biography"
                value={formData.biography}
                onChange={handleInputChange}
                placeholder="Enter artist biography"
                rows={4}
              />
            </div>

            <div className="form-group">
              <label>Profile Image</label>
              <div className="image-upload-container">
                <input
                  type="file"
                  id="edit-image-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden-input"
                />
                {selectedImage || imageSrc ? (
                  <div className="image-preview-container">
                    <img src={imageSrc || ""} alt="Preview" className="image-preview" />
                    <button type="button" className="remove-image" onClick={clearImageSelection}>
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label htmlFor="edit-image-upload" className="image-upload-label">
                    <User size={24} />
                    <span>Upload Image</span>
                  </label>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={cancelEditing}>
                Cancel
              </button>
              <button type="submit" className="submit-button" disabled={submitting}>
                {submitting ? <Loader size={18} className="spinner" /> : <Check size={18} />}
                <span>Update Artist</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {filteredSingers.length === 0 ? (
        <div className="no-singers">
          <User size={48} />
          <p>No artists found. {!showAddForm && "Add some artists to get started!"}</p>
        </div>
      ) : (
        <div className="singers-grid">
          {filteredSingers.map((singer) => (
            <div key={singer.id} className="singer-card">
              <div className="singer-image">
                {singer.imageUrl ? (
                  <img src={singer.imageUrl || "/placeholder.svg"} alt={singer.name} />
                ) : (
                  <div className="placeholder-image">
                    <User size={32} />
                  </div>
                )}
              </div>
              <div className="singer-info">
                <h3 className="singer-name">{singer.name}</h3>
                {singer.biography && <p className="singer-bio">{singer.biography}</p>}
                {singer.songs && <p className="singer-songs-count">{singer.songs.length} songs</p>}
              </div>
              <div className="singer-actions">
                <button className="action-button edit" onClick={() => startEditing(singer)}>
                  <Edit size={18} />
                </button>
                <button className="action-button delete" onClick={() => handleDeleteSinger(singer.id)}>
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

export default SingerManagement
