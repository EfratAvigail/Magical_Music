import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './app/components/admin-panel/admin-panel.component';

const routes: Routes = [
  { path: '', component: AdminPanelComponent },
  { path: 'admin', component: AdminPanelComponent },
  { path: '**', redirectTo: '' } // Wildcard route for 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }