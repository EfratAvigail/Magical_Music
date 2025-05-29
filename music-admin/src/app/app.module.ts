// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// אל תכריז בקומפוננטות standalone במודול
@NgModule({
  imports: [
    BrowserModule,
    
    // כאן אין צורך לייבא את הקומפוננטות standalone - הן מיובאות ישירות בקומפוננטות שמשתמשות בהן
  ],
  // אין declarations כלל ל-standalone components
  declarations: [],
  bootstrap: [] // אין bootstrap במודול כאשר משתמשים ב-bootstrapApplication
})
export class AppModule { }
