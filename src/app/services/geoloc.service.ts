import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Geolocation, Position } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class GeolocService {
  private positionUpdates = new Subject<Position>();
  private coordinatesList: Position[] = [];
  //private fastapiUrl = 'http://127.0.0.1:8000/coordinates';
  private fastapiUrl = 'https://geofencingapp.onrender.com/coordinates';


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
    if (this.coordinatesList.length >= 15) {
      console.log('15 coordonnées atteintes!');
      this.sendCoordinatesToFastAPI();
      this.coordinatesList = []; 
    }
  }

  public sendCoordinatesToFastAPI(): void {
    var coordinates = this.coordinatesList;
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

  getCoordinates(): Observable<any> {
    return this.http.get(`${this.fastapiUrl}`);
  }
}
