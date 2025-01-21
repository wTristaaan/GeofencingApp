// src/app/components/map/map/map.component.ts
import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: false
})
export class MapComponent implements OnInit, AfterViewInit {
  private map: any = L.Map;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map(this.elementRef.nativeElement.querySelector('#map')).setView([46.603354, 1.888334], 6); // Coordonnées de la France
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  
    // Ajouter un délai de 50 millisecondes avant d'appeler invalidateSize
    setTimeout(() => {
      this.map.invalidateSize();
    }, 50);
  }  
}
