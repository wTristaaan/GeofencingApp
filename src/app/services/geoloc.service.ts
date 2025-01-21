import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Geolocation, Position } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class GeolocService {
  private positionUpdates = new Subject<Position>();
  private coordinatesList: Position[] = [];
  private fastapiUrl = 'http://localhost:8000/coordinates';

  constructor(private http: HttpClient) {
    this.watchUserPosition();
  }

  private watchUserPosition(): void {
    const options = {
      enableHighAccuracy: true,
    };

    const successCallback = (position: Position | null) => {
      if (position) {
        console.log('Position mise à jour:', position.coords);
        this.positionUpdates.next(position);
        this.addCoordinate(position);
      }
    };

    console.log('Démarrage de watchPosition...');
    Geolocation.watchPosition(options, successCallback);
  }

  private addCoordinate(position: Position): void {
    this.coordinatesList.push(position);
    if (this.coordinatesList.length >= 1) {
      console.log('1000 coordonnées atteintes!');
      this.sendCoordinatesToFastAPI(this.coordinatesList);
      this.coordinatesList = []; 
    }
  }

  private sendCoordinatesToFastAPI(coordinates: Position[]): void {
    const coordinatesData = coordinates.map(coord => ({
      latitude: coord.coords.latitude,
      longitude: coord.coords.longitude,
      accuracy: coord.coords.accuracy,
      timestamp: coord.timestamp
    }));

    this.http.post(`${this.fastapiUrl}`, coordinatesData, {
      headers: { 'Content-Type': 'application/json' }
    }).subscribe(
      response => {
        console.log('Coordinates sent to FastAPI:', response);
      },
      error => {
        console.error('Error sending coordinates to FastAPI:', error);
      }
    );
  }

  getPositionUpdates() {
    return this.positionUpdates.asObservable();
  }
}
