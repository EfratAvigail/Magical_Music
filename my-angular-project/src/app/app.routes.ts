import { Routes } from '@angular/router';
import { SongUploadComponent } from './admin/admin.component';
// import { SongUploadComponent } from './admin/song-upload/song-upload.component';

export const routes: Routes = [
  { path: 'upload', component: SongUploadComponent },
];
