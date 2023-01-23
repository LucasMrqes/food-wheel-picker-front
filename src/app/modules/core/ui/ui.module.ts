import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WheelSpinnerComponent } from './wheel-spinner/wheel-spinner.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LeafletMapComponent } from './leaflet-map/leaflet-map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';


@NgModule({
  declarations: [
    WheelSpinnerComponent,
    LeafletMapComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    LeafletModule
  ],
  exports: [
    WheelSpinnerComponent,
    LeafletMapComponent
  ]
})
export class UiModule { }
