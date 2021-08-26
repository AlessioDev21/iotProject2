import { DatePipe } from '@angular/common';
import { Route } from 'src/app/models/route';
import { RouteService } from 'src/app/services/route.service';
import { AffittuarioService } from 'src/app/services/affittuario.service';
import { CompanyService } from 'src/app/services/company.service';
import { User } from 'src/app/models/user';
import { Company } from './../../models/company';
import { VectorService } from 'src/app/services/vector.service';
import { Vector } from 'src/app/models/vector';
import { AffittuarioPrenotaViaggioRoute } from 'src/app/models/affittuario-prenota-viaggio-route';
import { ViaggioService } from './../../services/viaggio.service';
import { ViaggioRouteService } from './../../services/viaggio-route.service';
import { ViaggioRoute } from './../../models/viaggio-route';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Viaggio } from 'src/app/models/viaggio';
import { AffituarioPrenotaRouteService } from 'src/app/services/affituario-prenota-route.service';
import { BookingInfo } from 'src/app/models/booking-info';

@Component({
  selector: 'app-viaggio-route-progress-bar',
  templateUrl: './viaggio-route-progress-bar.component.html',
  styleUrls: ['./viaggio-route-progress-bar.component.scss']
})
export class ViaggioRouteProgressBarComponent implements OnInit {

  constructor( private route : ActivatedRoute,
               private router : Router,
               private routeService : RouteService,
               private viaggioService : ViaggioService,
               private viaggioRouteService : ViaggioRouteService,
               private bookingService : AffituarioPrenotaRouteService,
               private vectorService : VectorService,
               private companyService : CompanyService,
               private affittuarioService : AffittuarioService,
               private datepipe: DatePipe,

               ) { }

  me : User = {} as User;
  viaggioRouteId : number = 0;
  viaggioRoute : ViaggioRoute = {} as ViaggioRoute;
  viaggioId : number = 0;
  viaggio : Viaggio = {} as Viaggio;
  bookingList : AffittuarioPrenotaViaggioRoute[] = [] as AffittuarioPrenotaViaggioRoute[];
  vector : Vector = {} as Vector;
  vectorId : number = 0;
  vectorCapacity : number = 0;
  companyId : number = 0
  company : Company = {} as Company;
  companyPart : number = 0;
  companyPercentage : number = 0;
  bookingInfoList : BookingInfo [] = [];
  rotteDelViaggio : Route[] = [] as Route[];
  actualRoute : Route = {} as Route;
  IdRouteDelViaggio : number = 0;
  viaggioRoutes : ViaggioRoute[] = [] as ViaggioRoute[];
  startDate : string ="";
  endDate : string ="";
  status : string = "";
  companyTitle : string = "company";
  rentersTitle : string = "renters";
  vectorInfo : boolean = false;
  tripInfo : boolean = false;

  ngOnInit(): void {
    this.me = JSON.parse(String(localStorage.getItem("loggedUser")));
    this.viaggioRouteId = Number(this.route.snapshot.paramMap.get('id'));
    this.getViaggioRoute();


  }

  async getViaggioRoute(){

    await new Promise<void> ((resolve, reject) => {

    this.viaggioRouteService.getById(this.viaggioRouteId).subscribe(viaggioRoute =>{
      this.viaggioRoute = viaggioRoute;
      this.viaggioId = viaggioRoute.viaggioId;
      resolve();
    });
  });

  await new Promise<void> ((resolve, reject) => {

    this.routeService.getById(this.viaggioRoute.routeId).subscribe(route =>{
      this.actualRoute = route;
      resolve();
    });
  });

  await new Promise<void> ((resolve, reject) => {

    this.viaggioService.getById(this.viaggioId).subscribe(viaggio =>{
      this.viaggio = viaggio;
      this.vectorId = viaggio.vectorId;
      this.companyId = viaggio.companyId;
      resolve();
    });
  });

  await new Promise<void> ((resolve, reject) => {

    this.viaggioRouteService.getByViaggioId(this.viaggioId).subscribe(async list =>{
        this.viaggioRoutes = list;
      resolve();
    });
  });




  var i : number = 1;
  await new Promise<void> (async (resolve, reject) => {

    for (const route of this.viaggioRoutes) {

      await new Promise<void> ((resolve, reject) => {
        this.routeService.getById(route.routeId).subscribe(data =>{
            this.rotteDelViaggio.push(data);

          if(this.actualRoute.id == data.id){
            this.IdRouteDelViaggio = i}

            i ++;
            resolve();
        });

  });
      }
      resolve();



});

//parte per vedere lo stato del viaggio
var now = new Date();
this.startDate = String(this.datepipe.transform(this.viaggioRoutes[this.IdRouteDelViaggio - 1].startDate, 'yyyy-MM-dd hh:mm'));
this.endDate = String(this.datepipe.transform(this.viaggioRoutes[this.IdRouteDelViaggio - 1].endDate, 'yyyy-MM-dd hh:mm'));
var nowFormatted : string = String(this.datepipe.transform(now, 'yyyy-MM-dd hh:mm'));

if(nowFormatted < this.endDate && nowFormatted < this.startDate)
 this.status = 'active'
if(nowFormatted >= this.startDate && nowFormatted <this.endDate)
 this.status = 'in trip'

 if(nowFormatted > this.endDate)
 this.status = 'expired'

  await new Promise<void> ((resolve, reject) => {

    this.companyService.getById(this.companyId).subscribe(company =>{
      this.company = company;
      resolve();
    });
  });

  await new Promise<void> ((resolve, reject) => {

  this.vectorService.getById(this.vectorId).subscribe(vector =>{
    this.vector = vector;
    this.vectorCapacity = vector.capacity;
    resolve();
    });
  });

  await new Promise<void> ((resolve, reject) => {

  this.bookingService.getByViaggioRouteId(this.viaggioRouteId).subscribe(bookingList =>{
    this.bookingList = bookingList;
    resolve();
    });
  });

    this.companyPart = this.vector.capacity - this.viaggioRoute.availableCapacity;
    //tolta la parte di tutti gli affittuari
    for(var i = 0; i<this.bookingList.length; i++){
      this.companyPart = this.companyPart - this.bookingList[i].bookedCapacity;
    }


   this.companyPercentage = (this.companyPart/this.vector.capacity)*100;

   await new Promise<void> (async (resolve, reject) => {
     for (const booking of this.bookingList) {
      var percentage : string = "";
      percentage = ((booking.bookedCapacity)/(this.vectorCapacity) * 100).toFixed(1);

      var bookingInfo : BookingInfo = {} as BookingInfo;
      bookingInfo.affittuarioPercentage = Number(percentage);
      bookingInfo.bookedKg = booking.bookedCapacity;

      await new Promise<void> ((resolve, reject) => {
        this.affittuarioService.getById(booking.affittuarioId).subscribe(affittuario =>{
          bookingInfo.affittuario = affittuario;
          resolve();
      });
    });

      this.bookingInfoList.push(bookingInfo);
      resolve();
     }

    });



}

randomColor(index : number) : string{
  if(index == 0)
    return "warning";
  if(index == 1)
    return "danger";
  if(index == 2)
    return "info";
  if(index == 3)
    return "primary";

  return "";

}

randomColorRGB(index : number) : string{
  if(index == 0)
    return "#f0ad4e"
  if(index == 1)
    return "#d9534f"
  if(index == 2)
    return "#5bc0de";
    if(index == 2)
    return "#0275d8";

  return "";

}

goTo(id : number){
  this.router.navigateByUrl('/viaggioRoute/'+id);
  setTimeout(()=>{
    window.location.reload();

  },0.01);
}
back(){
  this.router.navigateByUrl('/home')
  }

}
