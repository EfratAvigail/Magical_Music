import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class SongService {
  private apiUrl = 'https://localhost:7234/api/UploadFile/upload'; // ← נתיב נכון מהשרת


  constructor(private http: HttpClient) {}

  uploadSong(formData: FormData) {
    return this.http.post(this.apiUrl, formData);
  }
}

// c:\Users\user1\Desktop\רגע\src\app\services\song.service.ts