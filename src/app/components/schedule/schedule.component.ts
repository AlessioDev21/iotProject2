import { Router } from '@angular/router';
import { ViaggioService } from './../../services/viaggio.service';
import { VectorService } from './../../services/vector.service';
import { Route } from './../../models/route';
import { ViaggioRoute } from '../../models/viaggio-route';
import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { ViaggioRouteService } from 'src/app/services/viaggio-route.service';
import { RouteService } from 'src/app/services/route.service';
import { DatePipe } from '@angular/common';
import { Vector } from 'src/app/models/vector';
import { Viaggio } from 'src/app/models/viaggio';
import * as Mapbloxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import { environment } from 'src/environments/environment';
import * as mapboxgl from 'mapbox-gl';
import * as polyline from "@mapbox/polyline"

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],

})


export class ScheduleComponent implements OnInit {

  mapboxKey='pk.eyJ1IjoiYW5kcmVhcGFuaWNvMTAiLCJhIjoiY2tyNmh2aTJuM2Y3MjJ6cWFjZmRldDFwOCJ9.jWTClD21Yr5Jjc6zH1OFsw'
  viaggioId : number = 0;
  viaggioRouteList : ViaggioRoute[] = [] as ViaggioRoute[];
  days : number[] = [];
  dates : Date[] = [];
  now : string = "";
  now2 : Date = {} as Date;
  nowFormatted : string = "";
  vector : Vector = {} as Vector;
  viaggio : Viaggio = {} as Viaggio;
  occupiedCapacity : number[] = [] as number[];
  map : Mapbloxgl.Map = {} as Mapbloxgl.Map;
  coordinates : any[] =  [];
  totalDistance : number = 0;
  cities : string[] = [] as string[];


  constructor(public dialogRef: MatDialogRef<ScheduleComponent>,
              private router : Router,
              private viaggioRouteService : ViaggioRouteService,
              private datepipe: DatePipe,
              private routeService : RouteService,
              private vectorService : VectorService,
              private viaggioService : ViaggioService) { }

  ngOnInit(): void {

     this.now2 = new Date();
    this.nowFormatted =String(this.datepipe.transform(this.now2, 'yyyy-MM-dd HH:mm'));

    this.viaggioId = JSON.parse(String(localStorage.getItem("viaggio")));
    this.getRoutesOfAVector();
    this.getDays();
    setTimeout(()=>{console.log(this.viaggioRouteList), console.log(this.days); console.log(this.datesFilter)},3000)




  }

  async createMarker(lng : number, lat : number, color : string, city : string, i : number){

    if(i == 0)
      city = '1) Starting city : '+city;
    if(i == this.cities.length - 1)
      city = String(i+1)+') Ending city: '+city;
    if(i != 0 && i != this.cities.length -1 )
      city = String(i+1)+'. '+city

    var popup = new mapboxgl.Popup({ offset: 25 }).setText(
      city
      )
      await new Promise<void> ((resolve, reject) => {

    const marker = new Mapbloxgl.Marker({
      color : color,
      scale : 0.7

    }).setLngLat([lng,lat])
      .addTo(this.map)
      .setPopup(popup);
      resolve();
  });

  }

  async getRoutesOfAVector(){
    this.viaggioService.getById(this.viaggioId).subscribe(viaggio=>{
      this.viaggio = viaggio;
        //mi serve per acquisire la capacità del veicolo
        this.vectorService.getById(viaggio.vectorId).subscribe(vector =>{
          this.vector = vector;
        })
    });


    await new Promise<void> ((resolve, reject) => {

    this.viaggioRouteService.getByViaggioId(this.viaggioId).subscribe(async lista=>{
      this.viaggioRouteList = lista;
      resolve();


      await new Promise<void> (async (resolve, reject) => {

      for (const viaggioRoute of this.viaggioRouteList) {

        viaggioRoute.route = {} as Route;
        viaggioRoute.startDateString =String(this.datepipe.transform(viaggioRoute.startDate, 'yyyy-MM-dd hh:mm' ));
        viaggioRoute.endDateString  =String(this.datepipe.transform(viaggioRoute.endDate, 'yyyy-MM-dd hh:mm'));
        viaggioRoute.dayStart =  (Number(String(viaggioRoute.startDate).substring(8,10)));
        viaggioRoute.dayEnd =  (Number(String(viaggioRoute.endDate).substring(8,10)));

        //problema del pm /am nelle 2 stringhe che non si risolve, non riconosce le ore del PM per il confronto di > (le tratta come se fossero semplici AM)

        await new Promise<void> ((resolve, reject) => {

        this.routeService.getById(viaggioRoute.routeId).subscribe( async route =>{
          viaggioRoute.route = route;
          viaggioRoute.distance = route.distanceKm;
          this.totalDistance = this.totalDistance + route.distanceKm;

          await new Promise<void> ((resolve, reject) => {

            this.routeService.getCoordinates(viaggioRoute.route.startCity).subscribe(async (data : any) =>{
              this.cities.push(viaggioRoute.route.startCity)
              this.coordinates.push( data.features[0].center );
              resolve();
            });
          });

          if(viaggioRoute == this.viaggioRouteList[this.viaggioRouteList.length - 1]){
            await new Promise<void> ((resolve, reject) => {

              this.routeService.getCoordinates(viaggioRoute.route.endCity).subscribe(async (data : any) =>{
                this.cities.push(viaggioRoute.route.endCity)
                this.coordinates.push( data.features[0].center );
                resolve();
              });
            });



          }
          resolve();


        });
      });
      }
      resolve();
    });
  });

    setTimeout(async ()=>{


      var zoom : number = 3;

      if(this.totalDistance < 100){
        zoom = 7.8;
      }
      if(this.totalDistance< 500 && this.totalDistance >= 100)
      zoom = 5.8;

      if(this.totalDistance< 800 && this.totalDistance >= 500)
          zoom = 4.5;
      if(this.totalDistance< 1000 && this.totalDistance >= 800)
          zoom = 4.2;
      if(this.totalDistance< 2000 && this.totalDistance >= 1000)
        zoom = 3.2;
      if(this.totalDistance< 4000 && this.totalDistance >= 2000)
        zoom = 2.2;

      (Mapbloxgl as any).accessToken = this.mapboxKey;
      this.map = new Mapbloxgl.Map({
        container:'mapa-mapbox',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [(this.coordinates[0][0] + this.coordinates[this.coordinates.length - 1][0])/2
                , (this.coordinates[0][1] + this.coordinates[this.coordinates.length -1][1])/2],
        zoom : zoom

      });

      const nav = new mapboxgl.NavigationControl();
      this.map.addControl(nav);

      for(var i = 0; i<this.coordinates.length; i++){

        if(i == 0 )
        this.createMarker(this.coordinates[i][0], this.coordinates[i][1],'red',this.cities[i],i);
        if(i == this.coordinates.length -1)
        this.createMarker(this.coordinates[i][0], this.coordinates[i][1],'red',this.cities[i],i);
      if(i != 0 && i != this.coordinates.length - 1 )
      this.createMarker(this.coordinates[i][0], this.coordinates[i][1],'',this.cities[i],i);
      }


      this.map.on('load', async ()=>{
        for(var i = 0; i < this.coordinates.length - 1; i++){

          await new Promise<void> ((resolve, reject) => {

        this.routeService.getPath(this.coordinates[i][0], this.coordinates[i][1],
                                  this.coordinates[i + 1][0], this.coordinates[i + 1][1])
                                  .subscribe((data : any) =>{
                                    var coords = polyline.decode(data.routes[0].geometry); // Get the geometry of the request  and convert it from a Google string to coordinates
                                    coords.forEach(coordinate => {
                                      [coordinate[0], coordinate[1]] = [coordinate[1], coordinate[0]];

                                    });
                                    var path = turf.lineString(coords);


                                    this.map.addLayer({
                                      "id": "path"+String(i),
                                      "type": "line",
                                      "source": {
                                          "type": "geojson",
                                          "data": path
                                      },

                                      })

                                      var color : string;
                                      color = 'rgb(24, 0, 255)';
                                      if(i == this.coordinates.length - 2 || i == 0) // questo qui andrebbe fatto solo per i tratti di EMPTY RETURN, adesso invece sta fatto a prescindere per l'ultima tratta
                                        color = 'rgb(255, 0, 0)';
                                      this.map.setPaintProperty('path'+String(i), 'line-color', color );
                                      this.map.setPaintProperty('path'+String(i), 'line-width', 2.5);

                                      resolve();
                                    });

                          });

                        }
      })


  /*      var popupStart = new mapboxgl.Popup({ offset: [0, -35] })
  .setLngLat(this.coordinates[0])
  .setHTML(
    '<div class"card" style="color : blue">'+'<h1>' + 'Start'+ '</h1> </div>'
           )
  .addTo(this.map);

  var popupEnd = new mapboxgl.Popup({ offset: [0, -35] })
  .setLngLat(this.coordinates[this.coordinates.length -1])
  .setHTML(
    '<div class"card" style="color : blue">'+'<h3>' + 'End '+ '</h3> </div>'
           )
  .addTo(this.map);
  */


    },1500);
    });

  }

  datesFilter:Date[]=[];

  getDays(){
    this.datesFilter=[];
    this.viaggioService.getById(this.viaggioId).subscribe(viaggio=>{

      //mi serve per acquisire la capacità del veicolo
        this.vectorService.getById(viaggio.vectorId).subscribe(vector =>{

    this.viaggioRouteService.getByViaggioId(this.viaggioId).subscribe(lista=>{

      for (const viaggioRoute of lista) {

        this.days.push(Number(String(viaggioRoute.startDate).substring(8,10)));
        this.days.push(Number(String(viaggioRoute.endDate).substring(8,10)));

        console.log("queste è la data che inserisco " +viaggioRoute.startDate)

        this.dates.push(viaggioRoute.startDate);
        this.dates.push(viaggioRoute.endDate);

        var somma : number = ((vector.capacity - viaggioRoute.availableCapacity) / vector.capacity )*100;
        this.occupiedCapacity.push(Number(somma.toFixed(1)));
      }

      //elimino i doppioni

      this.days = this.days.filter(function(elem, index, self) {
        return index === self.indexOf(elem);
    })

    for(let j=0; j<this.days.length;j++){
      for(let i=0; i<this.dates.length;i++){
        let d1=new Date(this.dates[i]);
        if(d1.getDate()==this.days[j] ){
          this.datesFilter.push(this.dates[i]);
          break;
        }
      }
    }


  //************************** */

    })


  })
});
  }

  // If the user clicks the cancel button a.k.a. the go back button, then\
  // just close the modal
  closeModal() {
    this.dialogRef.close();
  }

  goTo(id : number){

    this.router.navigateByUrl('/viaggioRoute/'+id);
    this.closeModal();
  }

}
