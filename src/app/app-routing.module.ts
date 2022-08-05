
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BuzzersComponent } from '@pages/buzzers/buzzers.component';
import { DiagnosticComponent } from '@pages/diagnostic/diagnostic.component';
import { DisplayComponent } from '@pages/display/display.component';
import { ManagementComponent } from '@pages/management/management.component';

const routes: Routes = [
  { path: '', redirectTo: '/edje-management', pathMatch: 'full' },

  { path: 'edje-management', component: ManagementComponent },
  { path: 'edje-display/:key/:colors', component: DisplayComponent },
  { path: 'buzzers/:key', component: BuzzersComponent },

  { path: 'diagnostic/:key', component: DiagnosticComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
