import { bootstrapApplication } from '@angular/platform-browser';
import { AdminPanelComponent } from './app/components/admin-panel/admin-panel.component';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AdminPanelComponent, {
  providers: []
});
