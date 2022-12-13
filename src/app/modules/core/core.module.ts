import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { HeaderComponent } from './header/header.component';
import { UiModule } from './ui/ui.module';
import { HttpClientModule } from '@angular/common/http';
import { MapsService } from './service-maps/maps.service';

@NgModule({
  declarations: [
    MainComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    UiModule,
    HttpClientModule
  ],
  exports: [
    MainComponent,
    HeaderComponent
  ],
  providers: [
    MapsService
  ]
})
export class CoreModule { }
