import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { MapsService } from '../service-maps/maps.service';
import { Restaurant } from '../service-maps/models/restaurants';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent {
  spinWheelEvent: Subject<void> = new Subject<void>();
  wheelState = 'default';
  latitude: number;
  longitude: number;
  restaurants: Restaurant[] = [];

  constructor(private mapsService: MapsService) {

  }

  spinWheel() {
    this.spinWheelEvent.next();
  }

  // 12 options
  options: string[] = ['1','2','3','4','5','6'];

  updatePicked(pickedIndex: number): void {
    console.log(this.options[pickedIndex]);
  }

  updateWheelStatus(rotated: boolean): void {
    this.wheelState = rotated ? 'rotated' : 'default';
  }

  getLocation(): void{
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position)=>{
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
        });
    } else {
       console.log("No support for geolocation")
    }
  }

  getRestaurants(): void {
    this.mapsService.getRestaurants(this.latitude, this.longitude).subscribe((data) => {
      console.log(data);
      this.restaurants = data as Restaurant[];
      this.options = this.restaurants.map((restaurant) => restaurant.name);
      console.log(this.options);
    });
  }
}
