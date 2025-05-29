


import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { UploadService } from '../../services/upload.service';
import { SongUploadRequest, SongUploadResponse, AlertMessage } from '../../models/song.model';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { FormsModule } from '@angular/forms';

// src/app/components/admin-panel/admin-panel.component.ts

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FileUploadComponent,FormsModule],  // הוספת CommonModule
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  @ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

  isUploading = false;
  uploadProgress = 0;
  alertMessage: AlertMessage | null = null;
  uploadedSongs: SongUploadResponse[] = [];
  
  private subscriptions: Subscription[] = [];

  constructor(private uploadService: UploadService) {}

  ngOnInit(): void {
    // Subscribe to upload progress
    const progressSub = this.uploadService.getUploadProgress().subscribe(
      progress => {
        this.uploadProgress = progress;
      }
    );
    this.subscriptions.push(progressSub);

    // Load uploaded songs from localStorage if available
    this.loadUploadedSongs();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onFileSelected(file: File): void {
    console.log('File selected:', file.name);
  }

  onFormSubmit(songData: SongUploadRequest): void {
    if (!songData.file || !songData.name.trim()) {
      this.showAlert('אנא בחר קובץ והכנס שם לשיר', 'error');
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;
    this.clearAlert();

    const uploadSub = this.uploadService.uploadSong(songData).subscribe({
      next: (response: SongUploadResponse) => {
        this.isUploading = false;
        this.uploadProgress = 100;
        
        // Add to uploaded songs list
        this.uploadedSongs.unshift(response);
        this.saveUploadedSongs();
        
        this.showAlert('השיר הועלה בהצלחה!', 'success');
        
        // Reset form after successful upload
        setTimeout(() => {
          this.fileUploadComponent.resetForm();
          this.uploadProgress = 0;
          this.uploadService.resetProgress();
        }, 2000);
      },
      error: (error) => {
        this.isUploading = false;
        this.uploadProgress = 0;
        this.uploadService.resetProgress();
        
        let errorMessage = 'שגיאה בהעלאת השיר';
        
        if (error.error && error.error.message) {
          errorMessage += ': ' + error.error.message;
        } else if (error.status === 0) {
          errorMessage = 'שגיאת חיבור - בדוק את החיבור לשרת';
        } else if (error.status === 404) {
          errorMessage = 'שרת לא נמצא - בדוק את כתובת ה-API';
        } else if (error.status === 500) {
          errorMessage = 'שגיאת שרת פנימית';
        }
        
        this.showAlert(errorMessage, 'error');
        console.error('Upload error:', error);
      }
    });
    
    this.subscriptions.push(uploadSub);
  }

  private showAlert(message: string, type: AlertMessage['type']): void {
    this.alertMessage = { message, type };
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        this.clearAlert();
      }, 5000);
    }
  }

  clearAlert(): void {
    this.alertMessage = null;
  }

  private loadUploadedSongs(): void {
    try {
      const saved = localStorage.getItem('uploadedSongs');
      if (saved) {
        this.uploadedSongs = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading saved songs:', error);
    }
  }

  private saveUploadedSongs(): void {
    try {
      // Keep only last 10 uploads
      const songsToSave = this.uploadedSongs.slice(0, 10);
      localStorage.setItem('uploadedSongs', JSON.stringify(songsToSave));
    } catch (error) {
      console.error('Error saving songs:', error);
    }
  }

  deleteSong(index: number): void {
    if (confirm('האם אתה בטוח שברצונך למחוק את השיר מהרשימה?')) {
      this.uploadedSongs.splice(index, 1);
      this.saveUploadedSongs();
      this.showAlert('השיר נמחק מהרשימה', 'info');
    }
  }

  copyToClipboard(url: string): void {
    navigator.clipboard.writeText(url).then(() => {
      this.showAlert('URL הועתק ללוח', 'success');
    }).catch(() => {
      this.showAlert('שגיאה בהעתקת URL', 'error');
    });
  }

  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('he-IL') + ' ' + date.toLocaleTimeString('he-IL');
    } catch {
      return dateString;
    }
  }
}