import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WheelSpinnerComponent } from './wheel-spinner/wheel-spinner.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    WheelSpinnerComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
  ],
  exports: [
    WheelSpinnerComponent
  ]
})
export class UiModule { }
