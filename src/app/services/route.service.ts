import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { Route } from './../models/route';
import { Router } from '@angular/router';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'  })
};


@Injectable({
  providedIn: 'root'
})
export class RouteService {

  constructor(private http:HttpClient, private router: Router) { }

  mapboxKey='pk.eyJ1IjoiYW5kcmVhcGFuaWNvMTAiLCJhIjoiY2tyNmh2aTJuM2Y3MjJ6cWFjZmRldDFwOCJ9.jWTClD21Yr5Jjc6zH1OFsw'

  getAllEndPoint = 'http://localhost:8080/route/getAll'
  routeByIdEndPoint = 'http://localhost:8080/route/get'
  getByCitiesEndPoint = 'http://localhost:8080/route/getByStartCityAndEndCity'
  saveEndPoint = 'http://localhost:8080/route/save'
  getAllRoutesOfViaggioIdEndPoint="http://localhost:8080/route/getRoutes"
  getRoutesByEndCityURL="http://localhost:8080/route/getByEndCity"


  getByEndCity(endCity: string):Observable<Route[]>{
    return this.http.get<Route[]>(this.getRoutesByEndCityURL+'/'+endCity)
  }

  findAllRoutes(viaggioId: Number): Observable<Route[]>{
    return this.http.get<Route[]>(this.getAllRoutesOfViaggioIdEndPoint+"/"+viaggioId)
  }

  getAll(): Observable<Route[]>{
    return this.http.get<Route[]>(this.getAllEndPoint);
}

getById(id : number): Observable<Route>{

  return this.http.get<Route>(`${this.routeByIdEndPoint}/${id}`);
}


save(route : Route) : Observable<Route>{

  return this.http.post<Route>(this.saveEndPoint, route, httpOptions);

}

getByCities(startCity : string, endCity : string): Observable<Route>{

  return this.http.get<Route>(`${this.getByCitiesEndPoint}/${startCity}/${endCity}`);
}

getCoordinates(cityName : string){
  return this.http.get("https://api.mapbox.com/geocoding/v5/mapbox.places/"+cityName+".json?access_token="+this.mapboxKey);

}

getPath(lat1 : number, lon1 : number, lat2 : number, lon2 : number ){
  return this.http.get("https://api.mapbox.com/directions/v5/mapbox/driving-traffic/"+lat1+ ',' + lon1 + ';' + lat2 + ',' + lon2 + "?access_token="+this.mapboxKey);

}
}
