import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { SongUploadRequest, SongUploadResponse } from '../models/song.model';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = 'https://magical-music.onrender.com/api/UploadFile/upload';
  private progressSubject = new Subject<number>();

  constructor(private http: HttpClient) { }

  uploadSong(songData: SongUploadRequest): Observable<SongUploadResponse> {
    if (!songData.file) {
      throw new Error('File is required for upload');
    }

    const formData = new FormData();
    formData.append('File', songData.file);
    formData.append('Name', songData.name);
    formData.append('MusicStyle', songData.musicStyle || '');
    formData.append('SongLength', songData.songLength?.toString() || '0');
    formData.append('ReleaseDate', songData.releaseDate || '');
    formData.append('SingerId', songData.singerId?.toString() || '0');

    const request = new HttpRequest('POST', this.apiUrl, formData, {
      reportProgress: true
    });

    return this.http.request<SongUploadResponse>(request).pipe(
      tap(event => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          const progress = Math.round(100 * event.loaded / event.total);
          this.progressSubject.next(progress);
        }
      }),
      filter(event => event.type === HttpEventType.Response),
      map(event => {
        this.progressSubject.next(100);
        return event.body as SongUploadResponse;
      })
    );
  }

  getUploadProgress(): Observable<number> {
    return this.progressSubject.asObservable();
  }

  resetProgress(): void {
    this.progressSubject.next(0);
  }
}
