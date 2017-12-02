import { SaveVehicle } from './../Models/Vehicle';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class VehicleService {
  private readonly vehiclesEndPoint = '/api/vehicles/';

  constructor(private http : Http, private authHttp: AuthHttp) { }

  getMakes() {
    return this.http.get('/api/makes')
      .map(res => res.json());
  }

  getFeatures() {
    return this.http.get('/api/features')
      .map(res => res.json());
  }

  getVehicle(id : any) {
    return this.http.get(this.vehiclesEndPoint + id)
      .map(res => res.json());
  }

  getVehicles(filter : any) {
    return this.http.get(this.vehiclesEndPoint + "?" + this.toQueryString(filter))
      .map(res => res.json());
  }

  toQueryString(obj : any) {
    var parts = [];

    for(var property in obj) {
      var value = obj[property];
      if (value != null && value != undefined)
        parts.push(encodeURIComponent(property) + "=" + encodeURIComponent(value));      
    }

    return parts.join('&');
  }

  create(vehicle : any) {
    return this.authHttp.post(this.vehiclesEndPoint, vehicle)
      .map(res => res.json());
  }

  update(vehicle : SaveVehicle) {
    return this.authHttp.put(this.vehiclesEndPoint + vehicle.id, vehicle)
      .map(res => res.json());
  }

  delete(id : number) {
    return this.authHttp.delete(this.vehiclesEndPoint + id)
      .map(res => res.json());
  }

}
