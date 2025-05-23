// "use client"

// import type React from "react"

// import { useState, useRef, useEffect } from "react"
// import { Upload, CheckCircle, Loader, Music, ImageIcon, X, AlertCircle, Info } from "lucide-react"
// import { songAPI, singerAPI } from "../services/api"
// import type { Singer } from "../types"
// import "../styles/uploadsong.css"

// interface UploadFormData {
//   name: string
//   musicStyle: string
//   singerId: number | string
//   releaseDate: string
// }

// const UploadSong = () => {
//   console.log("UploadSong component rendering")
//   const [selectedAudioFile, setSelectedAudioFile] = useState<File | null>(null)
//   const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
//   const [imageSrc, setImageSrc] = useState<string | null>(null)
//   const [uploading, setUploading] = useState<boolean>(false)
//   const [uploadProgress, setUploadProgress] = useState<number>(0)
//   const [uploadSuccess, setUploadSuccess] = useState<boolean>(false)
//   const [uploadError, setUploadError] = useState<string | null>(null)
//   const [formData, setFormData] = useState<UploadFormData>({
//     name: "",
//     musicStyle: "",
//     singerId: "",
//     releaseDate: new Date().toISOString().split("T")[0],
//   })
//   const [audioDuration, setAudioDuration] = useState<string>("00:00:00")
//   const [singers, setSingers] = useState<Singer[]>([])
//   const [loading, setLoading] = useState<boolean>(true)
//   const [showNewArtistForm, setShowNewArtistForm] = useState<boolean>(false)
//   const [newArtistData, setNewArtistData] = useState({
//     name: "",
//     biography: "",
//     image: null as File | null,
//   })
//   const [newArtistImagePreview, setNewArtistImagePreview] = useState<string | null>(null)
//   const [addingArtist, setAddingArtist] = useState<boolean>(false)
//   const audioRef = useRef<HTMLAudioElement>(null)
//   const audioDropzoneRef = useRef<HTMLDivElement>(null)
//   const imageDropzoneRef = useRef<HTMLDivElement>(null)
//   const artistImageDropzoneRef = useRef<HTMLDivElement>(null)

//   // Fetch singers on component mount
//   useEffect(() => {
//     const fetchSingers = async () => {
//       try {
//         const data = await singerAPI.getAllSingers()
//         setSingers(data)
//       } catch (error) {
//         console.error("Error fetching singers:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchSingers()
//   }, [])

//   useEffect(() => {
//     // Clean up object URLs when component unmounts
//     return () => {
//       if (imageSrc && imageSrc.startsWith("blob:")) {
//         URL.revokeObjectURL(imageSrc)
//       }
//       if (newArtistImagePreview && newArtistImagePreview.startsWith("blob:")) {
//         URL.revokeObjectURL(newArtistImagePreview)
//       }
//     }
//   }, [imageSrc, newArtistImagePreview])

//   // Set up drag and drop for audio file
//   useEffect(() => {
//     const audioDropzone = audioDropzoneRef.current
//     if (!audioDropzone) return

//     const handleDragOver = (e: DragEvent) => {
//       e.preventDefault()
//       audioDropzone.classList.add("drag-over")
//     }

//     const handleDragLeave = () => {
//       audioDropzone.classList.remove("drag-over")
//     }

//     const handleDrop = (e: DragEvent) => {
//       e.preventDefault()
//       audioDropzone.classList.remove("drag-over")

//       if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
//         const file = e.dataTransfer.files[0]
//         if (file.type.startsWith("audio/")) {
//           handleAudioFileSelect(file)
//         } else {
//           setUploadError("Please select a valid audio file.")
//         }
//       }
//     }

//     audioDropzone.addEventListener("dragover", handleDragOver)
//     audioDropzone.addEventListener("dragleave", handleDragLeave)
//     audioDropzone.addEventListener("drop", handleDrop)

//     return () => {
//       audioDropzone.removeEventListener("dragover", handleDragOver)
//       audioDropzone.removeEventListener("dragleave", handleDragLeave)
//       audioDropzone.removeEventListener("drop", handleDrop)
//     }
//   }, [])

//   // Set up drag and drop for cover image
//   useEffect(() => {
//     const imageDropzone = imageDropzoneRef.current
//     if (!imageDropzone) return

//     const handleDragOver = (e: DragEvent) => {
//       e.preventDefault()
//       imageDropzone.classList.add("drag-over")
//     }

//     const handleDragLeave = () => {
//       imageDropzone.classList.remove("drag-over")
//     }

//     const handleDrop = (e: DragEvent) => {
//       e.preventDefault()
//       imageDropzone.classList.remove("drag-over")

//       if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
//         const file = e.dataTransfer.files[0]
//         if (file.type.startsWith("image/")) {
//           handleImageFileSelect(file)
//         } else {
//           setUploadError("Please select a valid image file.")
//         }
//       }
//     }

//     imageDropzone.addEventListener("dragover", handleDragOver)
//     imageDropzone.addEventListener("dragleave", handleDragLeave)
//     imageDropzone.addEventListener("drop", handleDrop)

//     return () => {
//       imageDropzone.removeEventListener("dragover", handleDragOver)
//       imageDropzone.removeEventListener("dragleave", handleDragLeave)
//       imageDropzone.removeEventListener("drop", handleDrop)
//     }
//   }, [])

//   // Set up drag and drop for artist image
//   useEffect(() => {
//     const artistImageDropzone = artistImageDropzoneRef.current
//     if (!artistImageDropzone || !showNewArtistForm) return

//     const handleDragOver = (e: DragEvent) => {
//       e.preventDefault()
//       artistImageDropzone.classList.add("drag-over")
//     }

//     const handleDragLeave = () => {
//       artistImageDropzone.classList.remove("drag-over")
//     }

//     const handleDrop = (e: DragEvent) => {
//       e.preventDefault()
//       artistImageDropzone.classList.remove("drag-over")

//       if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
//         const file = e.dataTransfer.files[0]
//         if (file.type.startsWith("image/")) {
//           handleArtistImageSelect(file)
//         } else {
//           setUploadError("Please select a valid image file.")
//         }
//       }
//     }

//     artistImageDropzone.addEventListener("dragover", handleDragOver)
//     artistImageDropzone.addEventListener("dragleave", handleDragLeave)
//     artistImageDropzone.addEventListener("drop", handleDrop)

//     return () => {
//       artistImageDropzone.removeEventListener("dragover", handleDragOver)
//       artistImageDropzone.removeEventListener("dragleave", handleDragLeave)
//       artistImageDropzone.removeEventListener("drop", handleDrop)
//     }
//   }, [showNewArtistForm])

//   const handleAudioFileSelect = (file: File) => {
//     // Validate file type
//     if (!file.type.startsWith("audio/")) {
//       setUploadError("Please select a valid audio file.")
//       return
//     }

//     setSelectedAudioFile(file)

//     // Get audio duration
//     const audio = new Audio()
//     audio.src = URL.createObjectURL(file)

//     audio.onloadedmetadata = () => {
//       const duration = audio.duration
//       const hours = Math.floor(duration / 3600)
//       const minutes = Math.floor((duration % 3600) / 60)
//       const seconds = Math.floor(duration % 60)

//       const formattedDuration = [
//         hours.toString().padStart(2, "0"),
//         minutes.toString().padStart(2, "0"),
//         seconds.toString().padStart(2, "0"),
//       ].join(":")

//       setAudioDuration(formattedDuration)

//       // Clean up
//       URL.revokeObjectURL(audio.src)
//     }

//     // Try to extract song name from filename
//     const fileName = file.name.replace(/\.[^/.]+$/, "") // Remove extension
//     if (formData.name === "") {
//       setFormData((prev) => ({ ...prev, name: fileName }))
//     }

//     setUploadSuccess(false)
//     setUploadError(null)
//   }

//   const handleImageFileSelect = (file: File) => {
//     // Validate file type
//     if (!file.type.startsWith("image/")) {
//       setUploadError("Please select a valid image file.")
//       return
//     }

//     setSelectedImageFile(file)

//     // Create preview
//     if (imageSrc && imageSrc.startsWith("blob:")) {
//       URL.revokeObjectURL(imageSrc)
//     }

//     const objectUrl = URL.createObjectURL(file)
//     setImageSrc(objectUrl)
//   }

//   const handleArtistImageSelect = (file: File) => {
//     // Validate file type
//     if (!file.type.startsWith("image/")) {
//       setUploadError("Please select a valid image file.")
//       return
//     }

//     setNewArtistData((prev) => ({ ...prev, image: file }))

//     // Create preview
//     if (newArtistImagePreview && newArtistImagePreview.startsWith("blob:")) {
//       URL.revokeObjectURL(newArtistImagePreview)
//     }

//     const objectUrl = URL.createObjectURL(file)
//     setNewArtistImagePreview(objectUrl)
//   }

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleNewArtistInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setNewArtistData((prev) => ({ ...prev, [name]: value }))
//   }

//   const clearImageSelection = () => {
//     if (imageSrc && imageSrc.startsWith("blob:")) {
//       URL.revokeObjectURL(imageSrc)
//     }
//     setSelectedImageFile(null)
//     setImageSrc(null)
//   }

//   const clearArtistImageSelection = () => {
//     if (newArtistImagePreview && newArtistImagePreview.startsWith("blob:")) {
//       URL.revokeObjectURL(newArtistImagePreview)
//     }
//     setNewArtistData((prev) => ({ ...prev, image: null }))
//     setNewArtistImagePreview(null)
//   }

//   const handleAddNewArtist = async () => {
//     if (!newArtistData.name.trim()) {
//       setUploadError("Please enter an artist name.")
//       return
//     }

//     setAddingArtist(true)
//     setUploadError(null)

//     try {
//       const artistFormData = new FormData()
//       artistFormData.append("name", newArtistData.name)
//       artistFormData.append("biography", newArtistData.biography || "")

//       if (newArtistData.image) {
//         artistFormData.append("imageFile", newArtistData.image)
//       }

//       const newArtist = await singerAPI.addSinger(artistFormData)

//       // Update singers list
//       setSingers((prev) => [...prev, newArtist])

//       // Select the new artist
//       setFormData((prev) => ({ ...prev, singerId: newArtist.id }))

//       // Reset form and hide it
//       setNewArtistData({ name: "", biography: "", image: null })
//       setNewArtistImagePreview(null)
//       setShowNewArtistForm(false)

//       // Show success message
//       setUploadError(null)
//     } catch (error: any) {
//       console.error("Error adding artist:", error)
//       setUploadError(error.response?.data?.message || "Failed to add artist. Please try again.")
//     } finally {
//       setAddingArtist(false)
//     }
//   }

//   const handleUpload = async () => {
//     if (!selectedAudioFile) {
//       setUploadError("Please select an audio file to upload.")
//       return
//     }

//     if (!formData.name.trim()) {
//       setUploadError("Please enter a song name.")
//       return
//     }

//     if (!formData.singerId) {
//       setUploadError("Please select an artist.")
//       return
//     }

//     setUploading(true)
//     setUploadProgress(0)
//     setUploadSuccess(false)
//     setUploadError(null)

//     try {
//       // Create form data for multipart upload
//       const uploadFormData = new FormData()
//       uploadFormData.append("audioFile", selectedAudioFile)
//       if (selectedImageFile) {
//         uploadFormData.append("imageFile", selectedImageFile)
//       }

//       // Add metadata
//       uploadFormData.append("name", formData.name)
//       uploadFormData.append("musicStyle", formData.musicStyle)
//       uploadFormData.append("singerId", formData.singerId.toString())
//       uploadFormData.append("releaseDate", formData.releaseDate)
//       uploadFormData.append("songLength", audioDuration)

//       // Track upload progress
//       const onUploadProgress = (progressEvent: any) => {
//         if (progressEvent.total) {
//           const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
//           setUploadProgress(progress)
//         }
//       }

//       // Use axios via our API service to upload the song
//       await songAPI.addSong(uploadFormData, onUploadProgress)

//       setUploadSuccess(true)
//       resetForm()
//     } catch (error: any) {
//       console.error("Upload failed:", error)
//       setUploadError(error.response?.data?.error || "File upload failed. Please try again.")
//     } finally {
//       setUploading(false)
//     }
//   }

//   const resetForm = () => {
//     setSelectedAudioFile(null)
//     clearImageSelection()
//     setFormData({
//       name: "",
//       musicStyle: "",
//       singerId: "",
//       releaseDate: new Date().toISOString().split("T")[0],
//     })
//     setAudioDuration("00:00:00")
//   }

//   const musicStyles = [
//     "Pop",
//     "Rock",
//     "Hip Hop",
//     "R&B",
//     "Country",
//     "Electronic",
//     "Jazz",
//     "Classical",
//     "Folk",
//     "Reggae",
//     "Blues",
//     "Metal",
//     "Punk",
//     "Soul",
//     "Funk",
//     "Disco",
//     "Techno",
//     "House",
//     "Ambient",
//     "Indie",
//     "K-pop",
//     "Latin",
//     "World",
//     "Other",
//   ]

//   return (
//     <div className="upload-song-container">
//       <div className="upload-song-header">
//         <h2>Upload Your Music</h2>
//         <p className="upload-description">Add your favorite songs to your personal music library.</p>
//       </div>

//       <div className="upload-song-content">
//         <div className="upload-form">
//           <div className="form-row">
//             <div className="form-group">
//               <label htmlFor="name">Song Name</label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 placeholder="Enter song name"
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="musicStyle">Genre</label>
//               <select id="musicStyle" name="musicStyle" value={formData.musicStyle} onChange={handleInputChange}>
//                 <option value="">Select genre</option>
//                 {musicStyles.map((style) => (
//                   <option key={style} value={style}>
//                     {style}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className="form-row">
//             <div className="form-group artist-selection">
//               <label htmlFor="singerId">Artist</label>
//               <div className="artist-input-container">
//                 <select
//                   id="singerId"
//                   name="singerId"
//                   value={formData.singerId}
//                   onChange={handleInputChange}
//                   required
//                   disabled={showNewArtistForm}
//                 >
//                   <option value="">Select artist</option>
//                   {loading ? (
//                     <option disabled>Loading artists...</option>
//                   ) : (
//                     singers.map((singer) => (
//                       <option key={singer.id} value={singer.id}>
//                         {singer.name}
//                       </option>
//                     ))
//                   )}
//                 </select>
//                 <button
//                   type="button"
//                   className="add-artist-button"
//                   onClick={() => setShowNewArtistForm(!showNewArtistForm)}
//                 >
//                   {showNewArtistForm ? "Cancel" : "Add New Artist"}
//                 </button>
//               </div>
//             </div>

//             <div className="form-group">
//               <label htmlFor="releaseDate">Release Date</label>
//               <input
//                 type="date"
//                 id="releaseDate"
//                 name="releaseDate"
//                 value={formData.releaseDate}
//                 onChange={handleInputChange}
//               />
//             </div>
//           </div>

//           {showNewArtistForm && (
//             <div className="new-artist-form">
//               <h3>Add New Artist</h3>
//               <div className="form-row">
//                 <div className="form-group">
//                   <label htmlFor="artistName">Artist Name</label>
//                   <input
//                     type="text"
//                     id="artistName"
//                     name="name"
//                     value={newArtistData.name}
//                     onChange={handleNewArtistInputChange}
//                     placeholder="Enter artist name"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="form-row">
//                 <div className="form-group">
//                   <label htmlFor="artistBio">Biography (Optional)</label>
//                   <textarea
//                     id="artistBio"
//                     name="biography"
//                     value={newArtistData.biography}
//                     onChange={handleNewArtistInputChange}
//                     placeholder="Enter artist biography"
//                     rows={3}
//                   />
//                 </div>
//               </div>

//               <div className="form-row">
//                 <div className="form-group">
//                   <label>Artist Image (Optional)</label>
//                   <div className="upload-area artist-image-upload" ref={artistImageDropzoneRef}>
//                     <input
//                       type="file"
//                       id="artist-image-upload"
//                       accept="image/*"
//                       onChange={(e) => {
//                         if (e.target.files && e.target.files[0]) {
//                           handleArtistImageSelect(e.target.files[0])
//                         }
//                       }}
//                       className="hidden-input"
//                     />
//                     {newArtistImagePreview ? (
//                       <div className="image-preview-container">
//                         <img
//                           src={newArtistImagePreview || "/placeholder.svg"}
//                           alt="Artist preview"
//                           className="image-preview"
//                         />
//                         <button className="remove-image" onClick={clearArtistImageSelection}>
//                           <X size={16} />
//                         </button>
//                       </div>
//                     ) : (
//                       <label htmlFor="artist-image-upload" className="upload-label">
//                         <ImageIcon size={48} />
//                         <p>Upload artist image</p>
//                         <span className="upload-hint">JPG, PNG, WebP (max 5MB)</span>
//                       </label>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div className="artist-form-actions">
//                 <button
//                   type="button"
//                   className="cancel-artist-button"
//                   onClick={() => {
//                     setShowNewArtistForm(false)
//                     setNewArtistData({ name: "", biography: "", image: null })
//                     setNewArtistImagePreview(null)
//                   }}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   className="add-artist-button-submit"
//                   onClick={handleAddNewArtist}
//                   disabled={!newArtistData.name.trim() || addingArtist}
//                 >
//                   {addingArtist ? (
//                     <>
//                       <Loader size={18} className="spinner" />
//                       <span>Adding...</span>
//                     </>
//                   ) : (
//                     <>
//                       <span>Add Artist</span>
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="upload-files-container">
//           <div className="upload-area audio-upload" ref={audioDropzoneRef}>
//             <input
//               type="file"
//               id="audio-upload"
//               accept="audio/*"
//               onChange={(e) => {
//                 if (e.target.files && e.target.files[0]) {
//                   handleAudioFileSelect(e.target.files[0])
//                 }
//               }}
//               className="hidden-input"
//             />
//             <label htmlFor="audio-upload" className="upload-label">
//               {selectedAudioFile ? (
//                 <div className="selected-file-info">
//                   <Music size={24} />
//                   <div className="file-details">
//                     <span className="file-name">{selectedAudioFile.name}</span>
//                     <span className="file-meta">
//                       {(selectedAudioFile.size / (1024 * 1024)).toFixed(2)} MB • {audioDuration}
//                     </span>
//                   </div>
//                 </div>
//               ) : (
//                 <>
//                   <Music size={48} />
//                   <p>Click to upload or drag and drop your audio file here</p>
//                   <span className="upload-hint">MP3, WAV, FLAC, OGG (max 50MB)</span>
//                 </>
//               )}
//             </label>
//           </div>

//           <div className="upload-area image-upload" ref={imageDropzoneRef}>
//             <input
//               type="file"
//               id="image-upload"
//               accept="image/*"
//               onChange={(e) => {
//                 if (e.target.files && e.target.files[0]) {
//                   handleImageFileSelect(e.target.files[0])
//                 }
//               }}
//               className="hidden-input"
//             />
//             {selectedImageFile && imageSrc ? (
//               <div className="image-preview-container">
//                 <img src={imageSrc || "/placeholder.svg"} alt="Cover preview" className="image-preview" />
//                 <button className="remove-image" onClick={clearImageSelection}>
//                   <X size={16} />
//                 </button>
//               </div>
//             ) : (
//               <label htmlFor="image-upload" className="upload-label">
//                 <ImageIcon size={48} />
//                 <p>Upload cover image (optional)</p>
//                 <span className="upload-hint">JPG, PNG, WebP (max 5MB)</span>
//               </label>
//             )}
//           </div>
//         </div>

//         {uploadError && (
//           <div className="upload-error">
//             <AlertCircle size={18} />
//             <span>{uploadError}</span>
//           </div>
//         )}

//         {uploading && (
//           <div className="upload-progress">
//             <div className="progress-bar">
//               <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
//             </div>
//             <span className="progress-text">{uploadProgress}% Uploaded</span>
//           </div>
//         )}

//         <div className="upload-info-box">
//           <Info size={18} />
//           <p>
//             If you don't provide a cover image, a default image will be used. You can always edit the song details
//             later.
//           </p>
//         </div>

//         <div className="upload-actions">
//           <button className="upload-button" onClick={handleUpload} disabled={uploading || !selectedAudioFile}>
//             {uploading ? (
//               <>
//                 <Loader size={18} className="spinner" />
//                 <span>Uploading...</span>
//               </>
//             ) : (
//               <>
//                 <Upload size={18} />
//                 <span>Upload Song</span>
//               </>
//             )}
//           </button>
//         </div>

//         {uploadSuccess && (
//           <div className="upload-success">
//             <CheckCircle size={24} />
//             <p>Song uploaded successfully!</p>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default UploadSong
