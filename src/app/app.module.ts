
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ManagementComponent } from './pages/management/management.component';
import { DisplayComponent } from './pages/display/display.component';
import { BuzzersComponent } from './pages/buzzers/buzzers.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DiagnosticComponent } from './pages/diagnostic/diagnostic.component';

@NgModule({
  declarations: [
    AppComponent,
    ManagementComponent,
    DisplayComponent,
    BuzzersComponent,
    DiagnosticComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    ClipboardModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
