// src/app/app.component.ts
import { Component } from '@angular/core';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AdminPanelComponent], // ייבא את הקומפוננטה שמשתמשים בה בתבנית
  templateUrl: './app.component.html',
  // styleUrls: ['./app.component.css']
})
export class AppComponent { }
