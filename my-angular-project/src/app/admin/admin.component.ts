import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SongService } from '../services/song.service';

@Component({
  selector: 'app-song-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class SongUploadComponent {
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  isSubmitting = false;

  constructor(private fb: FormBuilder, private songService: SongService) {
    this.uploadForm = this.fb.group({
      name: [''],
      musicStyle: [''],
      songLength: [0],
      releaseDate: [''],
      creatorId: [0],
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const allowedTypes = ['audio/mpeg', 'audio/wav'];
      if (!allowedTypes.includes(file.type)) {
        alert('רק קבצי MP3 או WAV מותרים.');
        input.value = '';  // נקה בחירה
        this.selectedFile = null;
        return;
      }
      this.selectedFile = file;
    }
  }

  formatSongLength(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' + s : s}`;
  }

  onSubmit() {
    if (!this.selectedFile) {
      alert('יש לבחור קובץ!');
      return;
    }
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    const song = this.uploadForm.value;
    formData.append('name', song.name);
    formData.append('musicStyle', song.musicStyle);
    formData.append('songLength', song.songLength.toString());
    formData.append('releaseDate', song.releaseDate);
    formData.append('creatorId', song.creatorId.toString());

    this.songService.uploadSong(formData).subscribe({
      next: () => {
        alert('השיר הועלה בהצלחה!');
        this.isSubmitting = false;
      },
      error: err => {
        console.error('שגיאה בהעלאה:', err);
        this.isSubmitting = false;
      }
    });
  }
}
