// "use client"

// import type React from "react"
// import { useState } from "react"
// import { Search, Download, Play, Pause, Filter, Music, Plus, Info, ExternalLink } from "lucide-react"
// import "../styles/searchsongs.css"
// import axios from "axios"

// interface SearchResult {
//   id: string
//   title: string
//   artist: string
//   album: string
//   duration: string
//   coverUrl: string
//   previewUrl?: string
//   source: string
// }

// const SearchSongs = () => {
//   const [searchTerm, setSearchTerm] = useState<string>("")
//   const [searchResults, setSearchResults] = useState<SearchResult[]>([])
//   const [isSearching, setIsSearching] = useState<boolean>(false)
//   const [currentPage, setCurrentPage] = useState<number>(1)
//   const [totalPages, setTotalPages] = useState<number>(1)
//   const [filter, setFilter] = useState<string>("all")
//   const [playingPreview, setPlayingPreview] = useState<string | null>(null)
//   const [isDownloading, setIsDownloading] = useState<{ [key: string]: boolean }>({})
//   const [showInfo, setShowInfo] = useState<string | null>(null)

//   const handleSearch = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!searchTerm.trim()) return;

//     setIsSearching(true);
//     setCurrentPage(1);

//     try {
//       // מבצע קריאה ל-API כדי לקבל את כל השירים
//       const response = await axios.get("https://localhost:7234/api/Song");
//       const data: SearchResult[] = response.data;

//       // מסנן את השירים לפי המונח שהמשתמש הכניס
//       const filteredResults = data.filter(song => 
//         song.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
//         song.artist.toLowerCase().includes(searchTerm.toLowerCase())
//       );

//       setSearchResults(filteredResults);
//       setTotalPages(Math.ceil(filteredResults.length / 10));
//     } catch (error) {
//       console.error("Error fetching songs:", error);
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setFilter(e.target.value)
//   }

//   const togglePreview = (previewUrl: string) => {
//     if (playingPreview === previewUrl) {
//       setPlayingPreview(null)
//     } else {
//       setPlayingPreview(previewUrl)
//     }
//   }

//   const downloadSong = (result: SearchResult) => {
//     setIsDownloading({ ...isDownloading, [result.id]: true })

//     // Simulate the download
//     setTimeout(() => {
//       setIsDownloading({ ...isDownloading, [result.id]: false })
//       alert(`${result.title} by ${result.artist} has been downloaded to your library!`)
//     }, 2000)
//   }

//   const toggleInfo = (id: string) => {
//     if (showInfo === id) {
//       setShowInfo(null)
//     } else {
//       setShowInfo(id)
//     }
//   }

//   // Filter results based on selected filter
//   const filteredResults = filter === "all" ? searchResults : searchResults.filter((result) => result.source === filter)

//   return (
//     <div className="search-songs-container">
//       <div className="search-songs-header">
//         <h2>Search Music</h2>
//         <p className="search-description">
//           Search for songs across multiple music platforms and download them to your library.
//         </p>
//       </div>

//       <div className="search-form-container">
//         <form onSubmit={handleSearch} className="search-form">
//           <div className="search-input-container">
//             <Search size={20} className="search-icon" />
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search for songs, artists, or albums..."
//               className="search-input"
//             />
//           </div>
//           <button type="submit" className="search-button" disabled={isSearching}>
//             {isSearching ? "Searching..." : "Search"}
//           </button>
//         </form>

//         {searchResults.length > 0 && (
//           <div className="search-filters">
//             <div className="filter-group">
//               <label>
//                 <Filter size={16} />
//                 <span>Filter by source:</span>
//               </label>
//               <select value={filter} onChange={handleFilterChange} className="filter-select">
//                 <option value="all">All Sources</option>
//                 <option value="Spotify">Spotify</option>
//                 <option value="Apple Music">Apple Music</option>
//                 <option value="YouTube Music">YouTube Music</option>
//                 <option value="SoundCloud">SoundCloud</option>
//               </select>
//             </div>
//             <div className="results-count">{filteredResults.length} results found</div>
//           </div>
//         )}
//       </div>

//       <div className="search-results">
//         {isSearching ? (
//           <div className="searching-indicator">
//             <div className="search-loader"></div>
//             <p>Searching across music platforms...</p>
//           </div>
//         ) : searchResults.length > 0 ? (
//           <div className="results-table-container">
//             <table className="results-table">
//               <thead>
//                 <tr>
//                   <th></th>
//                   <th>Title</th>
//                   <th>Artist</th>
//                   <th>Album</th>
//                   <th>Duration</th>
//                   <th>Source</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredResults.map((result) => (
//                   <tr key={result.id} className="result-row">
//                     <td>
//                       <img src={result.coverUrl || "/placeholder.svg"} alt={result.title} className="result-cover" />
//                     </td>
//                     <td>{result.title}</td>
//                     <td>{result.artist}</td>
//                     <td>{result.album}</td>
//                     <td>{result.duration}</td>
//                     <td>
//                       <div className="source-badge" data-source={result.source.toLowerCase().replace(" ", "-")}>
//                         {result.source}
//                       </div>
//                     </td>
//                     <td>
//                       <div className="result-actions">
//                         {result.previewUrl && (
//                           <button
//                             className={`preview-button ${playingPreview === result.previewUrl ? "playing" : ""}`}
//                             onClick={() => togglePreview(result.previewUrl!)}
//                           >
//                             {playingPreview === result.previewUrl ? <Pause size={16} /> : <Play size={16} />}
//                           </button>
//                         )}
//                         <button
//                           className={`download-button ${isDownloading[result.id] ? "downloading" : ""}`}
//                           onClick={() => downloadSong(result)}
//                           disabled={isDownloading[result.id]}
//                         >
//                           <Download size={16} />
//                         </button>
//                         <button
//                           className={`info-button ${showInfo === result.id ? "active" : ""}`}
//                           onClick={() => toggleInfo(result.id)}
//                         >
//                           <Info size={16} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : searchTerm ? (
//           <div className="no-results">
//             <Music size={48} />
//             <p>No results found for "{searchTerm}"</p>
//             <p>Try a different search term or check your spelling</p>
//           </div>
//         ) : (
//           <div className="search-placeholder">
//             <Search size={48} />
//             <p>Search for your favorite songs across multiple platforms</p>
//             <p>Type a song title, artist name, or album to get started</p>
//           </div>
//         )}
//       </div>

//       {showInfo && (
//         <div className="song-info-modal">
//           <div className="song-info-content">
//             <button className="close-info" onClick={() => setShowInfo(null)}>
//               ×
//             </button>

//             {(() => {
//               const result = searchResults.find((r) => r.id === showInfo)
//               if (!result) return null

//               return (
//                 <>
//                   <div className="song-info-header">
//                     <img src={result.coverUrl || "/placeholder.svg"} alt={result.title} className="info-cover" />
//                     <div className="info-title">
//                       <h3>{result.title}</h3>
//                       <p>{result.artist}</p>
//                     </div>
//                   </div>

//                   <div className="song-info-details">
//                     <div className="info-row">
//                       <span className="info-label">Album:</span>
//                       <span className="info-value">{result.album}</span>
//                     </div>
//                     <div className="info-row">
//                       <span className="info-label">Duration:</span>
//                       <span className="info-value">{result.duration}</span>
//                     </div>
//                     <div className="info-row">
//                       <span className="info-label">Source:</span>
//                       <span className="info-value">{result.source}</span>
//                     </div>
//                     <div className="info-row">
//                       <span className="info-label">Genre:</span>
//                       <span className="info-value">{(result as any).genre || "Unknown"}</span>
//                     </div>
//                     <div className="info-row">
//                       <span className="info-label">Release Year:</span>
//                       <span className="info-value">{(result as any).releaseYear || "Unknown"}</span>
//                     </div>
//                   </div>

//                   <div className="info-actions">
//                     <button className="view-source-button">
//                       <ExternalLink size={16} />
//                       <span>View on {result.source}</span>
//                     </button>
//                     <button className="add-to-library-button" onClick={() => downloadSong(result)}>
//                       <Plus size={16} />
//                       <span>Add to Library</span>
//                     </button>
//                   </div>
//                 </>
//               )
//             })()}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default SearchSongs


