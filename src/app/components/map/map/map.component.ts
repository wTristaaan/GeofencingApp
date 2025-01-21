import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { Geolocation, Position } from '@capacitor/geolocation';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: false
})
export class MapComponent implements OnInit, AfterViewInit {
  private map: any = L.Map;
  private userMarker: L.Marker | undefined;
  private previousPosition: Position | null = null;
  private currentPosition: Position | null = null;
  private animationInterval: any;

  public latitude: number | null = null;
  public longitude: number | null = null;
  public accuracy: number | null = null;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initMap();
    this.watchUserPosition();
  }

  private initMap(): void {
    this.map = L.map(this.elementRef.nativeElement.querySelector('#map')).setView([46.603354, 1.888334], 6); // Coordonnées de la France

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    setTimeout(() => {
      this.map.invalidateSize();
    }, 50);
  }

  private watchUserPosition(): void {
    const options = {
      enableHighAccuracy: true,
    };

    const successCallback = (position: Position | null) => {
      if (position) {
        this.currentPosition = position;
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.accuracy = position.coords.accuracy;

        if (this.previousPosition) {
          this.animateMarker(this.previousPosition.coords, position.coords);
        } else {
          this.initializeMarker(position.coords);
        }
        this.previousPosition = position;
      }
    };

    console.log('Démarrage de watchPosition...');
    Geolocation.watchPosition(options, successCallback);
  }

  private initializeMarker(coords: any): void {
    const icon = L.icon({
      iconUrl: 'assets/icon/user.png',
      iconSize: [50, 50],
      iconAnchor: [25, 50],
      shadowUrl: 'assets/icon/user-shadow.png',
      shadowSize: [50, 50],
      shadowAnchor: [27, 48]
    });

    this.userMarker = L.marker([coords.latitude, coords.longitude], { icon }).addTo(this.map);
    this.map.setView([coords.latitude, coords.longitude], 18);
  }

  private animateMarker(startCoords: any, endCoords: any): void {
    const start = [startCoords.latitude, startCoords.longitude];
    const end = [endCoords.latitude, endCoords.longitude];
    const steps = 1000;
    const duration = 10000;
    const interval = duration / steps;

    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }

    let step = 0;
    this.animationInterval = setInterval(() => {
      if (step <= steps) {
        const progress = step / steps;
        const lat = start[0] + (end[0] - start[0]) * progress;
        const lng = start[1] + (end[1] - start[1]) * progress;
        this.userMarker?.setLatLng([lat, lng]);
        step++;
      } else {
        clearInterval(this.animationInterval);
      }
    }, interval);
  }
}
