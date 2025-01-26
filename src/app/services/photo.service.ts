import { Injectable } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor() { }

  async getPhotos(){
    await Camera.requestPermissions()
    const images = await Camera.pickImages({
      quality: 90,
      limit: 5
    });

    console.log(images)
  }
}
