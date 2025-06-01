"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  MessageSquarePlus,
  Send,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Trash2,
  RefreshCw,
} from "lucide-react"
import "../styles/admin-requests.css"

interface RequestFormData {
  songName: string
  artistName: string
  message: string
  genre: string
  link?: string
}

interface Request {
  id: number
  songName: string
  artistName: string
  message: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  userId: number
  userName: string
  genre?: string
  link?: string
  adminResponse?: string
}

interface User {
  id?: number
  name?: string
  email?: string
  avatar?: string
}

const AdminRequests = ({ user }: { user: User | null }) => {
  const [activeTab, setActiveTab] = useState<"new" | "my-requests">("new")
  const [formData, setFormData] = useState<RequestFormData>({
    songName: "",
    artistName: "",
    message: "",
    genre: "",
    link: "",
  })
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [myRequests, setMyRequests] = useState<Request[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [sortField, setSortField] = useState<string>("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [expandedRequestId, setExpandedRequestId] = useState<number | null>(null)
  const [refreshKey, setRefreshKey] = useState<number>(0)

  const genres = [
    "Pop",
    "Rock",
    "Hip Hop",
    "R&B",
    "Electronic",
    "Classical",
    "Jazz",
    "Country",
    "Folk",
    "חסידי",
    "מזרחי",
    "Other",
  ]

  useEffect(() => {
    if (activeTab === "my-requests") {
      fetchMyRequests()
    }
  }, [activeTab, refreshKey])

  const fetchMyRequests = async () => {
    if (!user?.id) return

    setIsLoading(true)
    try {
      // In a real app, you would fetch from your API
      // For now, we'll use mock data
      const mockRequests: Request[] = [
        {
          id: 1,
          songName: "Midnight Dreams",
          artistName: "Luna Echo",
          message: "This song has amazing vocals and would be perfect for our collection.",
          status: "approved",
          createdAt: "2023-05-15T14:30:00Z",
          userId: user.id || 1,
          userName: user.name || "User",
          genre: "Electronic",
          adminResponse: "Great suggestion! We've added this to our library.",
        },
        {
          id: 2,
          songName: "Desert Wind",
          artistName: "Sands of Time",
          message: "This is a beautiful song with traditional instruments.",
          status: "pending",
          createdAt: "2023-06-20T09:15:00Z",
          userId: user.id || 1,
          userName: user.name || "User",
          genre: "מזרחי",
        },
        {
          id: 3,
          songName: "Urban Rhythm",
          artistName: "City Beats",
          message: "Great beat and lyrics, would love to have this in the app.",
          status: "rejected",
          createdAt: "2023-04-10T16:45:00Z",
          userId: user.id || 1,
          userName: user.name || "User",
          genre: "Hip Hop",
          adminResponse: "Unfortunately, we couldn't obtain the rights for this song.",
        },
      ]

      setMyRequests(mockRequests)
    } catch (error) {
      console.error("Error fetching requests:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear any previous errors when user starts typing again
    if (submitError) {
      setSubmitError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.songName || !formData.artistName) {
      setSubmitError("Song name and artist name are required")
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // In a real app, you would send this to your API
      // For now, we'll simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("Submitted request:", formData)

      // Reset form and show success message
      setFormData({
        songName: "",
        artistName: "",
        message: "",
        genre: "",
        link: "",
      })
      setSubmitSuccess(true)

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false)
      }, 3000)

      // Refresh the requests list
      setRefreshKey((prev) => prev + 1)
    } catch (error) {
      console.error("Error submitting request:", error)
      setSubmitError("Failed to submit request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const toggleRequestDetails = (requestId: number) => {
    setExpandedRequestId(expandedRequestId === requestId ? null : requestId)
  }

  const filteredRequests = myRequests
    .filter((request) => {
      // Filter by status
      if (filterStatus !== "all" && request.status !== filterStatus) {
        return false
      }

      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        return (
          request.songName.toLowerCase().includes(searchLower) ||
          request.artistName.toLowerCase().includes(searchLower) ||
          (request.genre && request.genre.toLowerCase().includes(searchLower))
        )
      }

      return true
    })
    .sort((a, b) => {
      // Sort by selected field
      if (sortField === "createdAt") {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA
      }

      if (sortField === "songName") {
        return sortDirection === "asc" ? a.songName.localeCompare(b.songName) : b.songName.localeCompare(a.songName)
      }

      if (sortField === "artistName") {
        return sortDirection === "asc"
          ? a.artistName.localeCompare(b.artistName)
          : b.artistName.localeCompare(a.artistName)
      }

      if (sortField === "status") {
        return sortDirection === "asc" ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status)
      }

      return 0
    })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle size={16} className="status-icon approved" />
      case "rejected":
        return <XCircle size={16} className="status-icon rejected" />
      default:
        return <AlertCircle size={16} className="status-icon pending" />
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "approved":
        return "status-approved"
      case "rejected":
        return "status-rejected"
      default:
        return "status-pending"
    }
  }

  return (
    <div className="admin-requests-container">
      <div className="admin-requests-header">
        <h2>Song Requests</h2>
        <p className="admin-requests-description">
          Request new songs to be added to our library or check the status of your previous requests.
        </p>
      </div>

      <div className="tabs-container">
        <div className="tabs">
          <button className={`tab ${activeTab === "new" ? "active" : ""}`} onClick={() => setActiveTab("new")}>
            <MessageSquarePlus size={18} />
            <span>New Request</span>
          </button>
          <button
            className={`tab ${activeTab === "my-requests" ? "active" : ""}`}
            onClick={() => setActiveTab("my-requests")}
          >
            <Search size={18} />
            <span>My Requests</span>
            {myRequests.filter((r) => r.status === "pending").length > 0 && (
              <span className="request-badge">{myRequests.filter((r) => r.status === "pending").length}</span>
            )}
          </button>
        </div>
      </div>

      <div className="admin-requests-content">
        {activeTab === "new" ? (
          <div className="new-request-form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="songName">Song Name *</label>
                <input
                  type="text"
                  id="songName"
                  name="songName"
                  value={formData.songName}
                  onChange={handleInputChange}
                  placeholder="Enter the song name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="artistName">Artist Name *</label>
                <input
                  type="text"
                  id="artistName"
                  name="artistName"
                  value={formData.artistName}
                  onChange={handleInputChange}
                  placeholder="Enter the artist name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="genre">Genre</label>
                <select id="genre" name="genre" value={formData.genre} onChange={handleInputChange}>
                  <option value="">Select a genre</option>
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="link">Song Link (Optional)</label>
                <input
                  type="text"
                  id="link"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  placeholder="YouTube, Spotify, or other link to the song"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message to Admin</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Why would you like this song to be added?"
                  rows={4}
                />
              </div>

              {submitError && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  <span>{submitError}</span>
                </div>
              )}

              {submitSuccess && (
                <div className="success-message">
                  <CheckCircle size={16} />
                  <span>Your request has been submitted successfully!</span>
                </div>
              )}

              <button type="submit" className="submit-button" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="spinner"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Submit Request</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="my-requests">
            <div className="requests-toolbar">
              <div className="search-filter">
                <div className="search-box">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="filter-dropdown">
                  <Filter size={16} />
                  <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <button className="refresh-button" onClick={() => setRefreshKey((prev) => prev + 1)}>
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="loading-requests">
                <div className="spinner"></div>
                <p>Loading your requests...</p>
              </div>
            ) : filteredRequests.length > 0 ? (
              <div className="requests-table">
                <div className="table-header">
                  <div className="header-cell" onClick={() => handleSort("createdAt")}>
                    <span>Date</span>
                    {sortField === "createdAt" &&
                      (sortDirection === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </div>
                  <div className="header-cell" onClick={() => handleSort("songName")}>
                    <span>Song</span>
                    {sortField === "songName" &&
                      (sortDirection === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </div>
                  <div className="header-cell" onClick={() => handleSort("artistName")}>
                    <span>Artist</span>
                    {sortField === "artistName" &&
                      (sortDirection === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </div>
                  <div className="header-cell" onClick={() => handleSort("status")}>
                    <span>Status</span>
                    {sortField === "status" &&
                      (sortDirection === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </div>
                  <div className="header-cell">
                    <span>Actions</span>
                  </div>
                </div>

                <div className="table-body">
                  {filteredRequests.map((request) => (
                    <div key={request.id} className="request-row">
                      <div className="request-item" onClick={() => toggleRequestDetails(request.id)}>
                        <div className="request-cell date-cell">{formatDate(request.createdAt)}</div>
                        <div className="request-cell song-cell">{request.songName}</div>
                        <div className="request-cell artist-cell">{request.artistName}</div>
                        <div className="request-cell status-cell">
                          <span className={`status-badge ${getStatusClass(request.status)}`}>
                            {getStatusIcon(request.status)}
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>
                        <div className="request-cell actions-cell">
                          <button
                            className="action-button"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleRequestDetails(request.id)
                            }}
                          >
                            {expandedRequestId === request.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </div>
                      </div>

                      {expandedRequestId === request.id && (
                        <div className="request-details">
                          <div className="details-grid">
                            <div className="detail-group">
                              <h4>Request Details</h4>
                              <p>
                                <strong>Genre:</strong> {request.genre || "Not specified"}
                              </p>
                              <p>
                                <strong>Submitted on:</strong> {formatDate(request.createdAt)}
                              </p>
                              <p>
                                <strong>Message:</strong> {request.message}
                              </p>
                              {request.link && (
                                <p>
                                  <strong>Link:</strong>{" "}
                                  <a
                                    href={request.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="request-link"
                                  >
                                    {request.link}
                                  </a>
                                </p>
                              )}
                            </div>

                            <div className="detail-group">
                              <h4>Status Information</h4>
                              <div className={`status-info ${getStatusClass(request.status)}`}>
                                {getStatusIcon(request.status)}
                                <span>{request.status.charAt(0).toUpperCase() + request.status.slice(1)}</span>
                              </div>

                              {request.adminResponse && (
                                <div className="admin-response">
                                  <p>
                                    <strong>Admin Response:</strong>
                                  </p>
                                  <p>{request.adminResponse}</p>
                                </div>
                              )}

                              {request.status === "pending" && (
                                <p className="pending-note">
                                  Your request is being reviewed by our team. We'll notify you when there's an update.
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="details-actions">
                            {request.status === "approved" && (
                              <button className="details-button">
                                <Download size={16} />
                                <span>Download Song</span>
                              </button>
                            )}

                            <button className="details-button delete">
                              <Trash2 size={16} />
                              <span>Delete Request</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="no-requests">
                <MessageSquarePlus size={48} />
                <h3>No requests found</h3>
                <p>
                  {searchTerm || filterStatus !== "all"
                    ? "Try adjusting your search or filters"
                    : "You haven't made any song requests yet"}
                </p>
                {(searchTerm || filterStatus !== "all") && (
                  <button
                    className="clear-filters-button"
                    onClick={() => {
                      setSearchTerm("")
                      setFilterStatus("all")
                    }}
                  >
                    Clear Filters
                  </button>
                )}
                {!searchTerm && filterStatus === "all" && (
                  <button className="new-request-button" onClick={() => setActiveTab("new")}>
                    <MessageSquarePlus size={16} />
                    <span>Create New Request</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminRequests
