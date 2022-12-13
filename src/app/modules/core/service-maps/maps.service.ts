import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class MapsService {
  constructor(private http: HttpClient) { }

  getRestaurants(lat: number, lng: number) {
    return this.http.get(`${environment.apiUrl}/api/maps`, { params: { keyword: 'restaurant', lat, lng } });
  }
}
