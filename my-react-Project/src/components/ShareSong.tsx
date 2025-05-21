import type React from "react";
import { useState } from "react";
import { Share2, Mail, Copy, CheckCircle, LinkIcon, Music, Search } from "lucide-react";
import type { Song } from "../types";
import axios from 'axios';
import "../styles/sharesong.css";

interface ShareSongProps {
  songs: Song[];
}

const ShareSong = ({ songs }: ShareSongProps) => {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [shareLink, setShareLink] = useState<string | null>(null);

  const filteredSongs = songs.filter(
    (song) =>
      song.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (song.musicStyle ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSongSelect = async (song: Song) => {
    setSelectedSong(song);
    setIsSuccess(false);
    const link = await fetchSongUrl(song);
    setShareLink(link);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSong || !email) return;

    setIsSending(true);

    try {
      const fullMessage = `${message}\n\n🌟🎵שיהיה לך יום נעים!\n\n\n👇לינק לשיר: ${shareLink}`;
      
      await axios.post("https://localhost:7234/api/Email/send", {
        to: email,
        subject: `שותף איתך ${selectedSong.name} באמצעות מערכת Magical_Music`,
        body: fullMessage,
        songId: selectedSong.id,
      });

      setIsSuccess(true);
      setEmail("");
      setMessage("");
      setShareLink(null); // מאפס את הקישור
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email. Please check the console for more details.");
    } finally {
      setIsSending(false);
    }
  };

  const fetchSongUrl = async (song: Song) => {
    try {
      const response = await axios.get(`https://localhost:7234/api/UploadFile/download-url?fileName=${encodeURIComponent(song.name)}`);
      console.log("Fetching URL for song:", song.name);

      return response.data.fileUrl;
    } catch (error) {
      console.log("Fetching URL failed for song:", song.name);
      console.error("Error fetching song URL:", error);
      setShareLink(null);
      return null;
    }
  };

  const copyShareLink = () => {
    if (!shareLink) return;

    navigator.clipboard.writeText(shareLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="share-song-container">
      <div className="share-song-header">
        <h2>Share Your Music</h2>
        <p className="share-description">
          Share your favorite songs with friends and family via email or generate a shareable link.
        </p>
      </div>

      <div className="share-song-content">
        <div className="song-browser">
          <div className="song-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search your songs..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          <div className="song-list">
            {filteredSongs.length > 0 ? (
              filteredSongs.map((song) => (
                <div
                  key={song.id}
                  className={`song-item ${selectedSong?.id === song.id ? "selected" : ""}`}
                  onClick={() => handleSongSelect(song)}
                >
                  <img
                    src={song.imageUrl || "/placeholder.svg?height=50&width=50"}
                    alt={song.name}
                    className="song-image"
                  />
                  <div className="song-details">
                    <h4>{song.name}</h4>
                    <div className="song-meta">
                      <span className="song-style">{song.musicStyle}</span>
                      <span className="song-date">{formatDate(song.releaseDate)}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-songs-found">
                <Music size={32} />
                <p>No songs found matching "{searchTerm}"</p>
              </div>
            )}
          </div>
        </div>

        <div className="share-options">
          {selectedSong ? (
            <>
              <div className="selected-song-info">
                <img
                  src={selectedSong.imageUrl || "/placeholder.svg?height=100&width=100"}
                  alt={selectedSong.name}
                  className="selected-song-image"
                />
                <div className="selected-song-details">
                  <h3>{selectedSong.name}</h3>
                  <p>{selectedSong.musicStyle}</p>
                  <span className="song-length">{selectedSong.songLength.substring(3)}</span>
                </div>
              </div>

              <div className="share-methods">
                <div className="share-method">
                  <h4>
                    <Mail size={18} />
                    <span>Share via Email</span>
                  </h4>

                  <form onSubmit={handleSubmit} className="share-form">
                    <div className="form-group">
                      <label htmlFor="email">Recipient Email</label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="friend@example.com"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="message">Message (Optional)</label>
                      <textarea
                        id="message"
                        value={message}
                        onChange={handleMessageChange}
                        placeholder="Check out this awesome song!"
                        rows={3}
                      />
                    </div>

                    <button type="submit" className="share-button" disabled={isSending || isSuccess}>
                      {isSending ? (
                        <span>Sending...</span>
                      ) : isSuccess ? (
                        <>
                          <CheckCircle size={18} />
                          <span>Sent Successfully!</span>
                        </>
                      ) : (
                        <>
                          <Share2 size={18} />
                          <span>Send Email</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                <div className="share-divider">
                  <span>OR</span>
                </div>

                <div className="share-method">
                  <h4>
                    <LinkIcon size={18} />
                    <span>Get Shareable Link</span>
                  </h4>

                  <div className="share-link">
                    <div className="link-display">
                      <span>{shareLink || 'Choose the song'}</span>
                    </div>
                    <button className="copy-link-button" onClick={copyShareLink}>
                      {linkCopied ? (
                        <>
                          <CheckCircle size={18} />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={18} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="link-info">Anyone with this link can listen to this song.</p>
                </div>
              </div>
            </>
          ) : (
            <div className="no-song-selected">
              <Music size={48} />
              <p>Select a song to share</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareSong;
