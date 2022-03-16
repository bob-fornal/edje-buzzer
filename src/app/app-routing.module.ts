
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ManagementComponent } from '@pages/management/management.component';
import { DisplayComponent } from '@pages/display/display.component';
import { BuzzersComponent } from '@pages/buzzers/buzzers.component';

import { AudioResolverService } from '@core/services/audio-resolver.service';

const routes: Routes = [
  { path: '', redirectTo: '/edje-management', pathMatch: 'full' },

  { path: 'edje-management', component: ManagementComponent },
  { path: 'edje-display/:key', component: DisplayComponent },
  { path: 'buzzers/:key', component: BuzzersComponent, resolve: { songs: AudioResolverService } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
