export interface Song {
  id: number;
  name: string;
  musicStyle: string;
  songLength: string;
  releaseDate: string;
  imageUrl?: string;
  singerId: number;
  singer?: any;
  users?: any;
  s3Url?: string;
  key?: string;
}

export interface SongUploadRequest {
  file: File;
  name: string;
  musicStyle: string;
  songLength: number;
  releaseDate: string;
  singerId: number;
}

export interface SongUploadResponse {
  song: Song;
  s3Url: string;
}

export interface AlertMessage {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}