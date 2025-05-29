

import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SongUploadRequest } from '../../models/song.model';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, FormsModule], // הוסף כאן
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  @Output() fileSelected = new EventEmitter<File>();
  @Output() formSubmit = new EventEmitter<SongUploadRequest>();
  @Input() isUploading = false;
  @Input() uploadProgress = 0;

  selectedFile: File | null = null;
  songData: SongUploadRequest = {
    file: null as any,
    name: '',
    musicStyle: '',
    songLength: 0,
    releaseDate: '',
    singerId: 0
  };

  musicStyles = [
    'פופ',
    'רוק',
    'ג\'אז',
    'קלאסי',
    'אלקטרוני',
    'היפ הופ',
    'מזרחי',
    'חסידי',
    'אחר'
  ];

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      this.selectedFile = file;
      this.songData.file = file;
      this.fileSelected.emit(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('audio/')) {
        this.selectedFile = file;
        this.songData.file = file;
        this.fileSelected.emit(file);
      }
    }
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      // Convert release date to ISO string if provided
      if (this.songData.releaseDate) {
        this.songData.releaseDate = new Date(this.songData.releaseDate).toISOString();
      }
      
      this.formSubmit.emit(this.songData);
    }
  }

  isFormValid(): boolean {
    return !!(this.selectedFile && this.songData.name.trim());
  }

  resetForm(): void {
    this.selectedFile = null;
    this.songData = {
      file: null as any,
      name: '',
      musicStyle: '',
      songLength: 0,
      releaseDate: '',
      singerId: 0
    };
    
    // Reset file input
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}