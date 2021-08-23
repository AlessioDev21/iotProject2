import { AffituarioPrenotaRouteService } from 'src/app/services/affituario-prenota-route.service';
import { environment } from './../../../environments/environment';
import { ViaggioRoute } from './../../models/viaggio-route';
import { Route } from './../../models/route';
import { Vector } from 'src/app/models/vector';
import { ViaggioService } from './../../services/viaggio.service';
import { CompanyVector } from './../../models/company-vector';
import { User } from './../../models/user';
import { Component, OnInit } from '@angular/core';
import { CompanyVectorService } from 'src/app/services/company-vector.service';
import { VectorService } from 'src/app/services/vector.service';
import { Offer } from 'src/app/models/offer';
import { ViaggioRouteService } from 'src/app/services/viaggio-route.service';
import { RouteService } from 'src/app/services/route.service';
import { DatePipe, Time } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ScheduleComponent } from '../schedule/schedule.component';
import { Viaggio } from 'src/app/models/viaggio';

import { Units } from '@turf/turf';
import { ModalErrorComponent } from '../modal-error/modal-error.component';
import { ModalTimeErrorComponent } from '../modal-time-error/modal-time-error.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-company-home',
  templateUrl: './company-home.component.html',
  styleUrls: ['./company-home.component.scss']
})
export class CompanyHomeComponent implements OnInit {

  constructor(
              private spinnerService : NgxSpinnerService,
              private companyVectorService : CompanyVectorService,
              private vectorService : VectorService,
              private routeService : RouteService,
              private viaggioRouteService : ViaggioRouteService,
              private datepipe: DatePipe,
              private matDialog : MatDialog,
              private viaggioService : ViaggioService,
              private bookingService : AffituarioPrenotaRouteService
  ) { }

  loggedUser : User = {} as User;
  vectorsOfCompany : CompanyVector[] = [] as CompanyVector[];
  vectors : Vector[] = [] as Vector[];
  offers : Offer[] = [] as Offer[];
  availableSum : number = 0;
  //devo tenere traccia della distanza totale
  totalDistance : number = 0;
  addMenu : boolean = false;

  newOffer : Offer = {} as Offer;
  cities : string[] = [] as string[];
  treatsCity : string[] = [] as string[];
  query : string = "";
  myVectors : Vector[]= [] as Vector[];
  selectedVector : Vector = {} as Vector;

  startDates : Date[] = [] as Date[];
  endDates : Date[] = [] as Date[];
  startTimes : Time[] = [] as Time[];
  endTimes : Time[] = [] as Time[];

  partialLoads : number[] = [] as number[];

  startCoordinates : any = {};
  endCoordinates : any = {};
  spinner: boolean = false;
  paginations : number = 0;
  selectedPaginations : number = 0;
  show : boolean = false;

  ngOnInit(): void {
    this.loggedUser = JSON.parse(String(localStorage.getItem("loggedUser")));
    this.offers = [];
    this.newOffer = {} as Offer;
    this.treatsCity = [];
    this.startDates = [];
    this.startTimes = [];
    this.endDates = [];
    this.endTimes = [];
    this.treatsCity = [];
    this.partialLoads = [];
    this.selectedVector = {} as Vector;
    this.vectorsOfCompany = [];
    this.vectors = [];
    this.availableSum = 0;
    this.totalDistance = 0;
    this.cities = [];
    this.myVectors = [];
    this.startCoordinates = {};
    this.endCoordinates = {};

    this.getAllVectors(); // faccio la getAll perchè tanto so che nel sistema saranno relativamente pochi
    this.getCompanyVectors();
    this.getAllCities();

  }

  loadNewOffer(){
    if(this.addMenu)
      this.addMenu = false;
    else{
    this.spinnerService.show();

    setTimeout(() => {
      /** spinner ends after 600 milliseconds */
      this.addMenu = true;
      this.spinnerService.hide()
    }, 600);


  }
  }
  getAllVectors(){

    this.vectorService.getAll().subscribe(allVectors =>{
      this.vectors = allVectors;
    })

  }

  getCompanyVectors(){

    // prendo tutti i vettori di una azienda
    this.companyVectorService.getByCompanyId(this.loggedUser.id).subscribe(list =>{
      this.vectorsOfCompany = list;
      list.forEach(element => {

        //singolo vettore
        this.vectorService.getById(element.vectorId).subscribe(vector =>{
          this.totalDistance = 0;
          this.myVectors.push(vector);


          //trovo i viaggi per vettore
          this.viaggioService.getByVectorId(vector.id).subscribe(viaggiList =>{

            viaggiList.forEach(viaggio => {


              var offer : Offer = {} as Offer;

            this.viaggioRouteService.getByViaggioId(viaggio.id).subscribe(async viaggi => {

              offer.vectorId = vector.id;
              offer.vectorBrand = vector.brand;
              offer.vectorType = vector.name;
              offer.licensePlate = vector.licensePlate;

              offer.viaggioId = viaggio.id;
              offer.costoPerKm = viaggio.costoPerKm;
              offer.maximumWithdrawal = viaggio.maximumWithdrawal;
              offer.occupiedCapacity = (vector.capacity - viaggio.initialFreeCapacity) / vector.capacity *100 ;
                offer.occupiedCapacity =  Number(offer.occupiedCapacity.toFixed(1));


              offer.startingDate = viaggi[0].startDate;
              offer.endingDate = viaggi[viaggi.length-1].endDate;

              var now : Date = new Date();
              var tomorrow = new Date()
              tomorrow.setDate(tomorrow.getDate() + 1)
              var date =this.datepipe.transform(now, 'yyyy-MM-dd hh:mm');
              var tomorrowDate =this.datepipe.transform(tomorrow, 'yyyy-MM-dd hh:mm');

              //ordinamento
          this.offers.sort((v1,v2) => {
            if (v1.endingDate < v2.endingDate) {
                return 1;
            }

            if (v1.endingDate > v2.endingDate) {
                return -1;
            }

            return 0;
          });

              //se l'offerta è scaduta mostro il badge rosso "expired"
              if(String(date) > String(offer.endingDate)){
                offer.available = false;
                offer.lastDay = false;
              }
              else{
                offer.available = true;
                // se l'offerta è di domani, mostro il badge giallo "hurry up"
                if(String(tomorrowDate) > String(offer.startingDate)){
                  offer.lastDay = true;
                }
              }

              this.routeService.getById(viaggi[0].routeId).subscribe(route =>{
                offer.startingCity = route.startCity;
              });

              this.routeService.getById(viaggi[viaggi.length - 1 ].routeId).subscribe(route =>{
                offer.endingCity = route.endCity;
              });

              //aggiungo tutte le sottorotte di una MEGAROTTA

              offer.routes = [];

              for (const viaggioRoute of viaggi) {


                // somma =           storico    +         capacità del vettore - carico libero alla fine della tratta
                this.availableSum = Number(this.availableSum) +vector.capacity - Number(viaggioRoute.availableCapacity);
                this.routeService.getById(viaggioRoute.routeId).subscribe(route =>{
                  offer.routes.push(route);

                });



              }
              setTimeout(()=>{
                for (const route of offer.routes) {

                this.totalDistance = this.totalDistance + route.distanceKm;
                offer.length = Number((this.totalDistance).toFixed(1));

              }  this.totalDistance = 0;
              },150);


                //aggiorno la percentuale di carico occupata
                offer.occupiedCapacity = Number(((this.availableSum) / (vector.capacity *(viaggi.length )) *100).toFixed(1)) ;
                this.availableSum = 0;

            });

            this.offers.push(offer);
          });
        });
      });
    });

  });

}



openModal(id : number) {
  localStorage.setItem('viaggio', JSON.stringify(id));
  const dialogConfig = new MatDialogConfig();
  // The user can't close the dialog by clicking outside its body
  dialogConfig.disableClose = true;
  dialogConfig.id = "modal-component";
  dialogConfig.height = "700px"; // alessio non ha le dimensioni del pc mac percui ha cambiato il parametro
  dialogConfig.width = "900px";
  // https://material.angular.io/components/dialog/overview
  const modalDialog = this.matDialog.open(ScheduleComponent, dialogConfig);
}


openModalError() {
  const dialogConfig = new MatDialogConfig();
  // The user can't close the dialog by clicking outside its
  dialogConfig.disableClose = true;
  dialogConfig.id = "modal-component";
  dialogConfig.height = "300px";
  dialogConfig.width = "400px";
  // https://material.angular.io/components/dialog/overview
  const modalDialog = this.matDialog.open(ModalErrorComponent, dialogConfig);
}

openModalTimeError() {
  const dialogConfig = new MatDialogConfig();
  // The user can't close the dialog by clicking outside its body
  dialogConfig.disableClose = true;
  dialogConfig.id = "modal-component";
  dialogConfig.height = "300px";
  dialogConfig.width = "400px";
  // https://material.angular.io/components/dialog/overview
  const modalDialog = this.matDialog.open(ModalTimeErrorComponent, dialogConfig);
}
getAllCities(){
  this.routeService.getAll().subscribe( routes => {
    routes.forEach(route => {

      this.cities.push(route.startCity);
      this.cities.push(route.endCity);
    });
    //elimino i doppioni
    this.cities = this.cities.filter(function(elem, index, self) {
      return index === self.indexOf(elem);
    });
  })
}


getItems(ev : any) {
  this.query = ev.target.value;
}

onChange(ev : any){

  //devo prendere l'ultima parole (la targa)
  var length = ev.split(' ').length;
  ev = ev.split(' ')[length - 1];

  for (let i = 0; i < this.vectors.length; i++) {
    if(this.myVectors[i].licensePlate == ev){
      this.newOffer.vector = this.myVectors[i];
      }

    }

}

removeVector(){
  this.newOffer.vector = {}  as Vector;
  this.selectedVector = {} as Vector;
}

addTreats(){

  this.treatsCity.push("");
}

removeTreats(id : number){
  this.treatsCity.splice(id,1);
}

async addNewOffer(){

      var invalid : boolean = false;
      var invalidTime : boolean = false;

      for(var i = 0; i<=this.treatsCity.length; i++){

        if(i == 0){
          if(this.newOffer.startingCity == this.treatsCity[i])
            invalid = true;
        }
        else{
          if(i == this.treatsCity.length){
            if(this.newOffer.endingCity == this.treatsCity[i])
            invalid = true;
          }
          else{
            if(this.treatsCity[i] == this.treatsCity[i -1])
            invalid = true;
          }
        }
      }

      for(var i = 0; i< this.startDates.length; i++){

        if(i == 0){
          if(this.newOffer.startDate > this.startDates[i])
            invalidTime = true;
        }
        else{
          if(i == this.startDates.length-1){
            if(this.newOffer.endDate < this.startDates[i])
            invalidTime = true;
          }
          else{
            if(this.startDates[i] < this.startDates[i -1] || this.endDates[i] < this.endDates[i - 1])
            invalidTime = true;
          }
        }
      }

      if(!invalid && !invalidTime){
    //aggiungo il viaggio
     var viaggio : Viaggio = {} as Viaggio;
     viaggio.vectorId = this.newOffer.vector.id;
     viaggio.initialFreeCapacity = this.newOffer.vector.capacity - this.newOffer.initialLoad;
     viaggio.costoPerKm = this.newOffer.costoPerKm;
     viaggio.companyId = this.loggedUser.id;
     viaggio.maximumWithdrawal = this.newOffer.maximumWithdrawal;

     await new Promise<void> ((resolve, reject) => {
     this.viaggioService.save(viaggio).subscribe(async viaggioSaved =>{

      //  VIAGGIO DIRETTO
    if(this.treatsCity.length == 0){ // viaggio diretto
      var route : Route = {} as Route;

      route.startCity = this.newOffer.startingCity;
      route.endCity = this.newOffer.endingCity;

      await new Promise<void> ((resolve, reject) => {

      this.routeService.getByCities(route.startCity, route.endCity).subscribe(async route =>{

        var viaggioRoute : ViaggioRoute = {} as ViaggioRoute;

        //gestione del carico libero
        //prima lo setto alla capacità iniziale
        viaggioRoute.availableCapacity = viaggioSaved.initialFreeCapacity;


          this.newOffer.startDate.setHours(Number(String(this.newOffer.startTime).substring(0,2)));
          this.newOffer.startDate.setMinutes(Number(String(this.newOffer.startTime).substring(3,5)));

          viaggioRoute.startDate =  this.newOffer.startDate ;
          viaggioRoute.maximumBookingDate = this.convertBookingDate(this.newOffer.startDate);
          if(this.newOffer.enableCancelation)
            viaggioRoute.maximumWithdrawal = this.convertDate(this.newOffer.startDate);

           //end date
           this.newOffer.endDate.setHours(Number(String(this.newOffer.endTime).substring(0,2)));
           this.newOffer.endDate.setMinutes(Number(String(this.newOffer.endTime).substring(3,5)));

           viaggioRoute.endDate = this.newOffer.endDate ;

           viaggioRoute.routeId = route.id;
           viaggioRoute.viaggioId = viaggioSaved.id;

           await new Promise<void> ((resolve, reject) => {

           this.viaggioRouteService.save(viaggioRoute).subscribe(savedViaggioRoute =>{
           });
           resolve();
          });


       },
      async err =>{

        await new Promise<void> ((resolve, reject) => {

        this.routeService.getCoordinates(route.startCity).subscribe(async (data : any) =>{
          this.startCoordinates = data.features[0].center;
          resolve();
        });
      });

      await new Promise<void> ((resolve, reject) => {

        this.routeService.getCoordinates(route.endCity).subscribe(async (data : any) =>{
          this.endCoordinates = data.features[0].center;
          resolve();
        });
      });

        await new Promise<void> ((resolve, reject) => {


          this.routeService.getPath(this.startCoordinates[0], this.startCoordinates[1],
            this.endCoordinates[0], this.endCoordinates[1])
            .subscribe((data : any) =>{
              route.distanceKm = Number(((data.routes[0].distance)/1000).toFixed(1));

                resolve();
              });

      });


      await new Promise<void> ((resolve, reject) => {

       this.routeService.save(route).subscribe(route=>{

        var viaggioRoute : ViaggioRoute = {} as ViaggioRoute;

        //gestione del carico libero
        //prima lo setto alla capacità iniziale
        viaggioRoute.availableCapacity = viaggioSaved.initialFreeCapacity;


          this.newOffer.startDate.setHours(Number(String(this.newOffer.startTime).substring(0,2)));
          this.newOffer.startDate.setMinutes(Number(String(this.newOffer.startTime).substring(3,5)));


          viaggioRoute.startDate = this.newOffer.startDate ;
          viaggioRoute.maximumBookingDate = this.convertBookingDate(this.newOffer.startDate)
          if(this.newOffer.enableCancelation)
            viaggioRoute.maximumWithdrawal = this.convertDate(this.newOffer.startDate);

           //end date
           this.newOffer.endDate.setHours(Number(String(this.newOffer.endTime).substring(0,2)));
           this.newOffer.endDate.setMinutes(Number(String(this.newOffer.endTime).substring(3,5)));

           viaggioRoute.endDate = this.newOffer.endDate ;

           viaggioRoute.routeId = route.id;
           viaggioRoute.viaggioId = viaggioSaved.id

           this.viaggioRouteService.save(viaggioRoute).subscribe(savedViaggioRoute =>{
           });

        });
      resolve();
      });

      });
    resolve();
    });




    }
    else {
       //viaggio NON DIRETTO

       for(var i = 0; i <= this.treatsCity.length ; i++ ){

        //creo una rotta con start "i" ed end "i + 1"    ROMA BOLOGNA Milano Torino
        var route : Route = {} as Route;


          if(i == 0){
            route.startCity = this.newOffer.startingCity;
          }
          else
            route.startCity = this.treatsCity[i - 1];

          if(i == this.treatsCity.length){
            route.endCity = this.newOffer.endingCity;
          }else
            route.endCity = this.treatsCity[i];


        await new Promise<void> ((resolve, reject) => {

        this.routeService.getByCities(route.startCity, route.endCity).subscribe(async route =>{

          console.log(route,' già esistente');
          var viaggioRoute : ViaggioRoute = {} as ViaggioRoute;
          //gestione del carico libero
          //prima lo setto alla capacità iniziale
          viaggioRoute.availableCapacity = viaggio.initialFreeCapacity;
          //poi "aggiungo" al carico libero il carico che deve essere consegnato in quella tratta

          for(var j = 0; j< i; j ++){
              viaggioRoute.availableCapacity = Number(viaggioRoute.availableCapacity) + Number(this.partialLoads[j]);
          }


          //prima rotta,abbiamo l'informazione della starting Date
        if(i == 0){

          //start date
          this.newOffer.startDate.setHours(Number(String(this.newOffer.startTime).substring(0,2)));
          this.newOffer.startDate.setMinutes(Number(String(this.newOffer.startTime).substring(3,5)));

          viaggioRoute.startDate = this.newOffer.startDate ;
          viaggioRoute.maximumBookingDate = this.convertBookingDate(this.newOffer.startDate)
          if(this.newOffer.enableCancelation)
            viaggioRoute.maximumWithdrawal = this.convertDate(this.newOffer.startDate);

          //end date
            this.endDates[0].setHours(Number(String(this.endTimes[0]).substring(0,2)));
            this.endDates[0].setMinutes(Number(String(this.endTimes[0]).substring(3,5)));

            viaggioRoute.endDate = this.endDates[0] ;

            viaggioRoute.routeId = route.id;
            viaggioRoute.viaggioId = viaggioSaved.id;

            await new Promise<void> ((resolve, reject) => {

            this.viaggioRouteService.save(viaggioRoute).subscribe(async savedViaggioRoute =>{
              resolve();
            })
          });

        }//fine if tappa 0


        //rotta qualsiasi
        else{

          if(i > 0){

          this.startDates[i - 1].setHours(Number(String(this.startTimes[i - 1]).substring(0,2)));
          this.startDates[i - 1].setMinutes(Number(String(this.startTimes[i - 1]).substring(3,5)));


          viaggioRoute.startDate = this.startDates[i - 1];
          viaggioRoute.maximumBookingDate = this.convertBookingDate(this.startDates[i - 1])
          if(this.newOffer.enableCancelation)
 /////////////////////////////// pericolo !!!!!!   this.stardDates[i-1]
          // riga precedente  da sostituire a questa se qualcos non va
          /*
          viaggioRoute.maximumWithdrawal = this.convertDate(this.newOffer.startDate);
          */
            viaggioRoute.maximumWithdrawal = this.convertDate(this.startDates[i-1]);
////////////////////////////////////////////

          if(i != this.treatsCity.length){
            //end date
            this.endDates[i].setHours(Number(String(this.endTimes[i]).substring(0,2)));
            this.endDates[i].setMinutes(Number(String(this.endTimes[i]).substring(3,5)));

            viaggioRoute.endDate = this.endDates[i] ;

            viaggioRoute.routeId = route.id;
            viaggioRoute.viaggioId = viaggioSaved.id;

            this.viaggioRouteService.save(viaggioRoute).subscribe(savedViaggioRoute =>{
            })
          }
          else{

          this.newOffer.endDate.setHours(Number(String(this.newOffer.endTime).substring(0,2)));
          this.newOffer.endDate.setMinutes(Number(String(this.newOffer.endTime).substring(3,5)));

          viaggioRoute.endDate = this.newOffer.endDate ;

          viaggioRoute.routeId = route.id;
          viaggioRoute.viaggioId = viaggioSaved.id;

          await new Promise<void> ((resolve, reject) => {
          this.viaggioRouteService.save(viaggioRoute).subscribe(async savedViaggioRoute =>{
            resolve();
          });
        });
          }
        }
          }
          resolve();
      },

        async err =>{
          console.log(route);

        //non esiste ancora questa route nel DB, la aggiungiamo

          //qui andrebbe messo tutto il sistema delle API di google

          var turfOptions = { units: 'kilometers' as Units };

          await new Promise<void> ((resolve, reject) => {

          this.routeService.getCoordinates(route.startCity).subscribe( (data : any) =>{
            this.startCoordinates = data.features[0].center;
            resolve();
          });
        });


          await new Promise<void> ((resolve, reject) => {

          this.routeService.getCoordinates(route.endCity).subscribe((data : any) =>{
            this.endCoordinates = data.features[0].center;
            resolve();
          });
        });


        await new Promise<void> (async (resolve, reject) => {

          await new Promise<void> (async (resolve, reject) => {

          // route.distanceKm = Number(turf.distance(this.startCoordinates ,this.endCoordinates,turfOptions).toFixed(1));
          // console.log(route.distanceKm)
          this.routeService.getPath(this.startCoordinates[0], this.startCoordinates[1],
            this.endCoordinates[0], this.endCoordinates[1])
            .subscribe((data : any) =>{
              route.distanceKm = Number(((data.routes[0].distance)/1000).toFixed(1));

                resolve();
              });
            });



          await new Promise<void> ((resolve, reject) => {
        this.routeService.save(route).subscribe(async route=>{

          var viaggioRoute : ViaggioRoute = {} as ViaggioRoute;

          //gestione del carico libero
          //prima lo setto alla capacità iniziale
          viaggioRoute.availableCapacity = viaggio.initialFreeCapacity;
          //poi "aggiungo" al carico libero il carico che deve essere consegnato in quella tratta
          for(var j = 0; j< i; j ++){
              viaggioRoute.availableCapacity = Number(viaggioRoute.availableCapacity) + Number(this.partialLoads[j]);
          }


          //prima rotta,abbiamo l'informazione della starting Date
        if(i == 0){

          this.newOffer.startDate.setHours(Number(String(this.newOffer.startTime).substring(0,2)));
          this.newOffer.startDate.setMinutes(Number(String(this.newOffer.startTime).substring(3,5)));

          viaggioRoute.startDate = this.newOffer.startDate ;
          viaggioRoute.maximumBookingDate = this.convertBookingDate(this.newOffer.startDate)
          if(this.newOffer.enableCancelation)
            viaggioRoute.maximumWithdrawal = this.convertDate(this.newOffer.startDate);


          //end date
          this.endDates[0].setHours(Number(String(this.endTimes[0]).substring(0,2)));
          this.endDates[0].setMinutes(Number(String(this.endTimes[0]).substring(3,5)));

          viaggioRoute.endDate = this.endDates[0] ;

          viaggioRoute.routeId = route.id;
          viaggioRoute.viaggioId = viaggioSaved.id;

          await new Promise<void> ((resolve, reject) => {

          this.viaggioRouteService.save(viaggioRoute).subscribe(savedViaggioRoute =>{
            resolve();
          });
        });

        }//fine if tappa 0


        //rotta qualsiasi
        else{

          if(i > 0){

          this.startDates[i - 1].setHours(Number(String(this.startTimes[i - 1]).substring(0,2)));
          this.startDates[i - 1].setMinutes(Number(String(this.startTimes[i - 1]).substring(3,5)));

          viaggioRoute.startDate = this.startDates[i - 1] ;
          viaggioRoute.maximumBookingDate = this.convertBookingDate(this.startDates[i - 1]);
          if(this.newOffer.enableCancelation)
            viaggioRoute.maximumWithdrawal = this.convertDate(this.startDates[i-1]);


          if(i != this.treatsCity.length){
            //end date
            this.endDates[i].setHours(Number(String(this.endTimes[i]).substring(0,2)));
            this.endDates[i].setMinutes(Number(String(this.endTimes[i]).substring(3,5)));

            viaggioRoute.endDate = this.endDates[i] ;

            viaggioRoute.routeId = route.id;
            viaggioRoute.viaggioId = viaggioSaved.id;

            this.viaggioRouteService.save(viaggioRoute).subscribe(savedViaggioRoute =>{
            })
          }
          else{

          this.newOffer.endDate.setHours(Number(String(this.newOffer.endTime).substring(0,2)));
          this.newOffer.endDate.setMinutes(Number(String(this.newOffer.endTime).substring(3,5)));

          viaggioRoute.endDate = this.newOffer.endDate ;

          viaggioRoute.routeId = route.id;
          viaggioRoute.viaggioId = viaggioSaved.id;

          this.viaggioRouteService.save(viaggioRoute).subscribe(savedViaggioRoute =>{
          })

                   }
                 }
               }
               resolve();
              });
            });
           resolve();});
          resolve();

          });
        });


        }
      }
   });
  resolve();
  });

  this.spinnerService.show();

  this.newOffer.startDates = this.startDates;
    this.newOffer.endDates = this.endDates;
    this.newOffer.startTimes = this.startTimes;
    this.newOffer.endTimes = this.endTimes;
    this.newOffer.treatsCity = this.treatsCity;

  setTimeout(() => {


    localStorage.setItem('offer', JSON.stringify(this.newOffer));

    this.spinnerService.hide();
    this.addMenu = false;
    window.location.reload();
  }, 8000);



}
      else{
        if(invalid)
        this.openModalError();
        if(invalidTime)
        this.openModalTimeError();
      }

}


    isInvalid() : boolean{

      if(this.newOffer.startingCity == this.newOffer.endingCity ||
         this.newOffer.initialLoad > this.newOffer.vector.capacity ||
         this.newOffer.startDate > this.newOffer.endDate)
        return true;

      else
        return false;

      }

async deleteViaggio(offer : Offer){

  var result = confirm('Are you sure you want to delete this trip?');
  if(result){
  this.spinnerService.show();
// qui inizia il pezzo "pericoloso"
console.log("cancello booking")

await new Promise<void> ((resolve, reject) => {
this.viaggioRouteService.getByViaggioId(offer.viaggioId).subscribe(async viaggioRoutes =>{

  await new Promise<void>( (resolve,reject)=>{
   viaggioRoutes.forEach( async viaggioRoute=>{
     await this.bookingService.getByViaggioRouteId(viaggioRoute.id).toPromise().then(
       booking=>{
         booking.forEach(element => {
           this.bookingService.deleteBooking(element.id).toPromise().then(data=>{})
         });
       }
     )
   })
   resolve();
  })
// qui finiscel il pezzo "pericoloso", se qualcosa non va cancella questo pezzo di sopra e torni tutto ok




  console.log("cancello viaggio-route")

  await new Promise<void> ((resolve, reject) => {
  viaggioRoutes.forEach(viaggioRoute => {
    this.viaggioRouteService.delete(viaggioRoute).subscribe(()=>{
      resolve();
        });
      });
    });

  resolve();
    });

  });

  console.log("cancello viaggio")

    await new Promise<void> ((resolve, reject) => {
    this.viaggioService.delete(offer.viaggioId).subscribe(()=>{
      resolve();
      });
    });

    setTimeout(() => {
      this.spinnerService.hide();
      window.location.reload();

    }, 1200);

    }
}




selectPage(pagina : number){
  this.selectedPaginations = pagina;

}

selectPrevious(){
  if(this.selectedPaginations != 0)
    this.selectedPaginations = this.selectedPaginations - 1;

}
selectNext(){

  if(this.selectedPaginations != (Math.trunc(this.offers.length/10)))
    this.selectedPaginations = this.selectedPaginations + 1;

}


convertDate(date : Date ) : Date{

  var newDate : Date = new Date();
  if(this.newOffer.maximumWithdrawal == '1 hour'){

    newDate.setTime(date.getTime() - (60*60*1000));
    return newDate;
  }


  if(this.newOffer.maximumWithdrawal == '2 hours'){
    newDate.setTime(date.getTime() - (2*60*60*1000));
    return newDate;
  }

  if(this.newOffer.maximumWithdrawal == '6 hours'){
    newDate.setTime(date.getTime() - (6*60*60*1000));
    return newDate;
  }

  if(this.newOffer.maximumWithdrawal == '12 hours'){
    newDate.setTime(date.getTime() - (12*60*60*1000));
    return newDate;
  }

  if(this.newOffer.maximumWithdrawal == '1 day'){
    newDate.setTime(date.getTime() - (24*60*60*1000));
    return newDate;
  }

  if(this.newOffer.maximumWithdrawal == '2 days'){
    newDate.setTime(date.getTime() - (2*24*60*60*1000));
    return newDate;
  }

  if(this.newOffer.maximumWithdrawal == '3 days'){
    newDate.setTime(date.getTime() - (3*24*60*60*1000));
    return newDate;
  }

  if(this.newOffer.maximumWithdrawal == '5 days'){
    newDate.setTime(date.getTime() - (5*24*60*60*1000));
    return newDate;
  }

  if(this.newOffer.maximumWithdrawal == '10 days'){
    newDate.setTime(date.getTime() - (10*24*60*60*1000));
    return newDate;
  }

  return newDate;

}

convertBookingDate(date : Date ) : Date{

  var newDate : Date = new Date();

 if(this.newOffer.maximumBookingDate == '1 hour'){
   newDate.setTime(date.getTime() - (60*60*1000));
   return newDate;
 }


 if(this.newOffer.maximumBookingDate == '2 hours'){
   newDate.setTime(date.getTime() - (2*60*60*1000));
   return newDate;
 }

 if(this.newOffer.maximumBookingDate == '6 hours'){
   newDate.setTime(date.getTime() - (6*60*60*1000));
   return newDate;
 }

 if(this.newOffer.maximumBookingDate == '12 hours'){
   newDate.setTime(date.getTime() - (12*60*60*1000));
   return newDate;
 }

 if(this.newOffer.maximumBookingDate == '1 day'){
   newDate.setTime(date.getTime() - (24*60*60*1000));
   return newDate;
 }

 if(this.newOffer.maximumBookingDate == '2 days'){
   newDate.setTime(date.getTime() - (2*24*60*60*1000));
   return newDate;
 }

 if(this.newOffer.maximumBookingDate == '3 days'){
   newDate.setTime(date.getTime() - (3*24*60*60*1000));
   return newDate;
 }

 if(this.newOffer.maximumBookingDate == '5 days'){
   newDate.setTime(date.getTime() - (5*24*60*60*1000));
   return newDate;
 }

 if(this.newOffer.maximumBookingDate == '10 days'){
   newDate.setTime(date.getTime() - (10*24*60*60*1000));
   return newDate;
 }

 return newDate;

}
customTrackBy(index: number, obj: any): any {
  return index;
}
}
