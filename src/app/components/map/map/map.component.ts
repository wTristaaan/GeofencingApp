import { Component, OnInit, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import {  Position } from '@capacitor/geolocation';
import { GeolocService } from 'src/app/services/geoloc.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: false
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  private map: any = L.Map;
  private userMarker: L.Marker | undefined;
  private previousPosition: Position | null = null;
  private currentPosition: Position | null = null;
  private animationInterval: any;
  private positionSubscription: Subscription | undefined;

  public latitude: number | null = null;
  public longitude: number | null = null;
  public accuracy: number | null = null;

  constructor(private elementRef: ElementRef, private geolocService: GeolocService) {}

  ngOnInit(): void {
    this.positionSubscription = this.geolocService.getPositionUpdates().subscribe((position: Position) => {
      this.updatePosition(position);
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.positionSubscription) {
      this.positionSubscription.unsubscribe();
    }
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

  private updatePosition(position: Position): void {
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

  private initializeMarker(coords: any): void {
    const icon = L.icon({
      iconUrl: 'assets/icon/user.png',
      iconSize: [50, 50],
      iconAnchor: [25, 50],
      shadowUrl: 'assets/icon/user-shadow.png',
      shadowSize: [50, 50],
      shadowAnchor: [25, 50]
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
