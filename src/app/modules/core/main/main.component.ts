import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { latLng, marker, icon, Icon } from 'leaflet';
import { Subject } from 'rxjs';
import { MapsService } from '../service-maps/maps.service';
import { Restaurant } from '../service-maps/models/restaurants';
import { LeafletMapComponent } from '../ui/leaflet-map/leaflet-map.component';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent {
  @ViewChild(LeafletMapComponent) mapComponent: LeafletMapComponent;

  spinWheelEvent: Subject<void> = new Subject<void>();
  wheelState = 'default';
  latitude: number;
  longitude: number;
  restaurants: Restaurant[] = [];
  pickedOptionIndex: number | null = null;
  searchStringControl: FormControl = new FormControl('');
  minPrice: number = 0;
  maxPrice: number = 4;
  radius: number = 500;

  constructor(private mapsService: MapsService) {

  }

  spinWheel() {
    this.resetWheel();
    this.spinWheelEvent.next();
  }

  options: Array<{value: string; selected: boolean}> = [];
  selectedOptionsLabels: string[] = [];

  updatePicked(pickedIndex: number): void {
    setTimeout(() => {this.pickedOptionIndex = pickedIndex}, 5000);
  }

  updateWheelStatus(rotated: boolean): void {
    this.wheelState = rotated ? 'rotated' : 'default';
  }

  async getLocation(): Promise<void> {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position)=>{
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.mapComponent.map.setZoom(15);
          this.mapComponent.map.panTo(latLng(position.coords.latitude, position.coords.longitude));
          let i = 0;
          this.mapComponent.map.eachLayer((layer) => {
            if (i > 0) {
              this.mapComponent.map.removeLayer(layer);
            }
            i = i + 1;
          });
          this.mapComponent.map.addLayer(marker(latLng(position.coords.latitude, position.coords.longitude), {
            icon: icon({
              ...Icon.Default.prototype.options,
              iconUrl: 'assets/marker-icon.png',
              iconRetinaUrl: 'assets/marker-icon-2x.png',
              shadowUrl: 'assets/marker-shadow.png'
            })
          }))
        });
    } else {
       console.log("No support for geolocation")
    }
  }

  getRestaurants(): void {
    const keyword = this.searchStringControl.value ? this.searchStringControl.value : 'restaurant';
    this.mapsService.getRestaurants(
      this.latitude,
      this.longitude,
      {
        keyword,
        radius: this.radius,
        // minprice: this.minPrice,
        // maxprice: this.maxPrice
      }
      ).subscribe((data) => {
      this.restaurants = data as Restaurant[];
      this.options = this.restaurants.map((restaurant) => { return {value: restaurant.name, selected: true}});
      this.selectedOptionsLabels = this.options.filter(option => option.selected).map((option) => { return option.value});
    });
  }

  updateWheelWithSelectedOptions() {
    this.selectedOptionsLabels = this.options.filter(option => option.selected).map((option) => { return option.value});
    this.resetWheel();
  }

  resetWheel() {
    this.pickedOptionIndex = null;
  }

  formatPriceSliderLabel(value: number): string {
    return '$'.repeat(value + 1);
  }

  formatRadiusSliderLabel(value: number): string {
    return value >= 1000 ? `${value/1000}km` : `${value}m`;
  }
}
