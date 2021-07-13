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
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ScheduleComponent } from '../schedule/schedule.component';
import { Viaggio } from 'src/app/models/viaggio';

@Component({
  selector: 'app-company-home',
  templateUrl: './company-home.component.html',
  styleUrls: ['./company-home.component.scss']
})
export class CompanyHomeComponent implements OnInit {

  constructor(
              private companyVectorService : CompanyVectorService,
              private vectorService : VectorService,
              private routeService : RouteService,
              private viaggioRouteService : ViaggioRouteService,
              private datepipe: DatePipe,
              private matDialog : MatDialog,
              private viaggioService : ViaggioService
  ) { }

  loggedUser : User = {} as User;
  vectorsOfCompany : CompanyVector[] = [] as CompanyVector[];
  vectors : Vector[] = [] as Vector[];
  offers : Offer[] = [] as Offer[];
  availableSum : number = 0;
  //devo tenere traccia della distanza totale
  totalDistance : number = 0;
  addMenu : boolean = false;

  newOffer : Offer = {} as Offer;
  cities : string[] = [] as string[];
  treatsCity : string[] = [] as string[];
  query : string = "";
  myVectors : Vector[]= [] as Vector[];
  selectedVector : Vector = {} as Vector;

  startDates : string[] = [] as string[];
  endDates : string[] = [] as string[];
  startTimes : string[] = [] as string[];
  endTimes : string[] = [] as string[];

  partialLoads : number[] = [] as number[];

  ngOnInit(): void {

    this.loggedUser = JSON.parse(String(localStorage.getItem("loggedUser")));

    this.getAllVectors(); // faccio la getAll perchè tanto so che nel sistema saranno relativamente pochi
    this.getCompanyVectors();
    this.getAllCities();

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


              var offer : Offer = {} as Offer;

            this.viaggioRouteService.getByViaggioId(viaggio.id).subscribe(viaggi => {

              offer.vectorId = vector.id;
              offer.vectorBrand = vector.brand;
              offer.vectorType = vector.name;
              offer.licensePlate = vector.licensePlate;

              offer.viaggioId = viaggio.id;
              offer.costoPerKm = viaggio.costoPerKm;
              setTimeout(()=>{ offer.occupiedCapacity = (vector.capacity - viaggio.initialFreeCapacity) / vector.capacity *100 ;
                offer.occupiedCapacity =  Number(offer.occupiedCapacity.toFixed(1));});

              offer.startingDate = viaggi[0].startDate;
              offer.endingDate = viaggi[viaggi.length-1].endDate;

              var now : Date = new Date();
              var tomorrow = new Date()
              tomorrow.setDate(tomorrow.getDate() + 1)
              var date =this.datepipe.transform(now, 'yyyy-MM-dd hh:mm');
              var tomorrowDate =this.datepipe.transform(tomorrow, 'yyyy-MM-dd hh:mm');


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

              for (const vectorRoute of viaggi) {
                // somma =           storico    +         capacità del vettore - carico libero alla fine della tratta
                this.availableSum = this.availableSum + vector.capacity - vectorRoute.availableCapacity;
                this.routeService.getById(vectorRoute.routeId).subscribe(route =>{
                  offer.routes.push(route);

                });
              }
              setTimeout(()=>{
                for (const route of offer.routes) {

                this.totalDistance = this.totalDistance + route.distanceKm;
                offer.length = this.totalDistance;

              }              this.totalDistance = 0;
              },80);



                //aggiorno la percentuale di carico occupata
                offer.occupiedCapacity = (vector.capacity - element.initialFreeCapacity + this.availableSum) / (vector.capacity *(viaggi.length+1)) *100 ;
                offer.occupiedCapacity =  Number(offer.occupiedCapacity.toFixed(1));

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
  dialogConfig.height = "700px";
  dialogConfig.width = "800px";
  // https://material.angular.io/components/dialog/overview
  const modalDialog = this.matDialog.open(ScheduleComponent, dialogConfig);
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
  this.selectedVector = {} as Vector;
}

addTreats(){

  this.treatsCity.push("");
}

removeTreats(id : number){
  this.treatsCity.splice(id,1);
}

addNewOffer(){

  if(this.newOffer.vector.capacity < this.newOffer.initialLoad){
    alert('The load('+this.newOffer.initialLoad+' Kg) is greater than allowed('+ this.newOffer.vector.capacity+' Kg), please correct your offer');
  }
  else{
  var route : Route = {} as Route;
    route.startCity = this.newOffer.startingCity;
    route.endCity = this.newOffer.endingCity;

  this.routeService.getByCities(this.newOffer.startingCity, this.newOffer.endingCity).subscribe(route =>{


    var viaggio : Viaggio = {} as Viaggio;
    viaggio.vectorId = this.newOffer.vector.id;
    viaggio.initialFreeCapacity = this.newOffer.vector.capacity - this.newOffer.initialLoad;
    viaggio.costoPerKm = this.newOffer.costoPerKm;
    this.viaggioService.save(viaggio).subscribe(viaggioSaved =>{

      var viaggioRoute : ViaggioRoute = {} as ViaggioRoute;
      viaggioRoute.availableCapacity = viaggio.initialFreeCapacity;

      //start date
      var dateStart : Date = new Date();

      this.newOffer.startDate.setHours(Number(String(this.newOffer.startTime).substring(0,2)));
      this.newOffer.startDate.setMinutes(Number(String(this.newOffer.startTime).substring(3,5)));

      dateStart.setDate(this.newOffer.startDate.getDate());
      dateStart.setMonth(this.newOffer.startDate.getMonth());
      dateStart.setFullYear(this.newOffer.startDate.getFullYear());
      dateStart.setHours(this.newOffer.startDate.getHours());
      dateStart.setMinutes(this.newOffer.startDate.getMinutes());

      let dateStartString =  this.datepipe.transform(dateStart,'yyyy-MM-dd hh:mm');
      dateStart = new Date(String(dateStartString));

      viaggioRoute.startDate = dateStart ;


      //end date
      var dateEnd : Date = new Date();

      this.newOffer.endDate.setHours(Number(String(this.newOffer.endTime).substring(0,2)));
      this.newOffer.endDate.setMinutes(Number(String(this.newOffer.endTime).substring(3,5)));

      dateEnd.setDate(this.newOffer.endDate.getDate());
      dateEnd.setMonth(this.newOffer.endDate.getMonth());
      dateEnd.setFullYear(this.newOffer.endDate.getFullYear());
      dateEnd.setHours(this.newOffer.endDate.getHours());
      dateEnd.setMinutes(this.newOffer.endDate.getMinutes());

      let dateEndString =  this.datepipe.transform(dateEnd,'yyyy-MM-ddThh:mm');
      dateEnd = new Date(String(dateEndString));

       viaggioRoute.endDate = dateEnd ;

       viaggioRoute.routeId = route.id;
       viaggioRoute.viaggioId = viaggioSaved.id;

      this.viaggioRouteService.save(viaggioRoute).subscribe(savedViaggioRoute =>{
      })
    });




  },
  err =>{
    //non esiste ancora questa route nel DB, la aggiungiamo

      var viaggio : Viaggio = {} as Viaggio;
      viaggio.vectorId = this.newOffer.vector.id;
      viaggio.initialFreeCapacity = this.newOffer.vector.capacity - this.newOffer.initialLoad;
      viaggio.costoPerKm = this.newOffer.costoPerKm;
      this.viaggioService.save(viaggio).subscribe(viaggioSaved =>{



    var newRoute : Route = {} as Route;
      newRoute.startCity = this.newOffer.startingCity;
      newRoute.endCity = this.newOffer.endingCity;

      //qui andrebbe messo tutto il sistema delle API di google

    this.routeService.save(newRoute).subscribe(route=>{
      console.log('nuova route', route);
      var viaggioRoute : ViaggioRoute = {} as ViaggioRoute;
      viaggioRoute.availableCapacity = viaggio.initialFreeCapacity;

      //start date
      var dateStart : Date = new Date();
      console.log(dateStart)

      this.newOffer.startDate.setHours(Number(String(this.newOffer.startTime).substring(0,2)));
      this.newOffer.startDate.setMinutes(Number(String(this.newOffer.startTime).substring(3,5)));

      dateStart.setDate(this.newOffer.startDate.getDate());
      dateStart.setMonth(this.newOffer.startDate.getMonth());
      dateStart.setFullYear(this.newOffer.startDate.getFullYear());
      dateStart.setHours(this.newOffer.startDate.getHours());
      dateStart.setMinutes(this.newOffer.startDate.getMinutes());

      let dateStartString =  this.datepipe.transform(dateStart,'yyyy-MM-dd hh:mm');
      dateStart = new Date(String(dateStartString));

      viaggioRoute.startDate = dateStart ;


      //end date
      var dateEnd : Date = new Date();

      this.newOffer.endDate.setHours(Number(String(this.newOffer.endTime).substring(0,2)));
      this.newOffer.endDate.setMinutes(Number(String(this.newOffer.endTime).substring(3,5)));

      dateEnd.setDate(this.newOffer.endDate.getDate());
      dateEnd.setMonth(this.newOffer.endDate.getMonth());
      dateEnd.setFullYear(this.newOffer.endDate.getFullYear());
      dateEnd.setHours(this.newOffer.endDate.getHours());
      dateEnd.setMinutes(this.newOffer.endDate.getMinutes());

      let dateEndString =  this.datepipe.transform(dateEnd,'yyyy-MM-ddThh:mm');
      dateEnd = new Date(String(dateEndString));

       viaggioRoute.endDate = dateEnd ;

       viaggioRoute.routeId = route.id;
       viaggioRoute.viaggioId = viaggioSaved.id;

      this.viaggioRouteService.save(viaggioRoute).subscribe(savedViaggioRoute =>{
      });
    });//fine aggiunta route
  });//fine aggiunta viaggio
});
  }

  }

}
