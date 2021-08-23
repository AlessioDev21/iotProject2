import { VectorService } from './../../services/vector.service';
import { AffittuarioPrenotaViaggioRoute } from 'src/app/models/affittuario-prenota-viaggio-route';
import { RouteService } from 'src/app/services/route.service';
import { ViaggioService } from 'src/app/services/viaggio.service';
import { ViaggioRouteService } from './../../services/viaggio-route.service';
import { AffituarioPrenotaRouteService } from './../../services/affituario-prenota-route.service';
import { ViaggioRoute } from './../../models/viaggio-route';
import { Affittuario } from 'src/app/models/affittuario';
import { Company } from './../../models/company';
import { User } from 'src/app/models/user';
import { CompanyService } from 'src/app/services/company.service';
import { AffittuarioService } from 'src/app/services/affittuario.service';
import { UserService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { NgxSpinnerService } from 'ngx-spinner';
import { Fatturato } from 'src/app/models/fatturato';
import { PercentualeFatturato } from 'src/app/models/percentuale-fatturato';
import HC_exporting from 'highcharts/modules/exporting'
import HC_More from 'highcharts/highcharts-more'
import HCSoldGauge from 'highcharts/modules/solid-gauge';
import HC3D from 'highcharts/highcharts-3d'
import * as HighchartsMap from "highcharts/highmaps";
import cylinder from "highcharts/modules/cylinder";
import worldMap from "@highcharts/map-collection/custom/world.geo.json";
import HC_map from 'highcharts/modules/map';
import { NazioneConteggio } from 'src/app/models/nazione-conteggio';
import { RicercaDate } from 'src/app/models/ricerca-date';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  chartOptions : any = {};
  allUsers : User[] = [] as User[];
  allAffittuari : Affittuario [] = [] as Affittuario[];
  allCompanies : Company[] = [] as Company[];
  show : boolean = false;


  bubbleChart : any = {};
  chartOptions2 : any = {};
  Highcharts2 : any = Highcharts;
  HighChartsMap : any = HighchartsMap;

  chartOptions3 : any = {};
  Highcharts3 : any = Highcharts;
  mapOptions : any = {};

  miniChartOprions : any = {};
  miniChartOptions2 : any = {};
  miniChartOptions3 : any = {};
  miniChartOptions4 : any = {};

  mapChartOptions : any = {};
  allStatsChartOptions : any = {};

  pieOptions : any = {};
  pie : any = Highcharts;

  ricerca : RicercaDate = {} as RicercaDate;
  offerteRicerca : number = 0;
  soldiRicerca : number = 0;
  KgRicerca : number = 0;
  bookingsRicerca : number = 0;
  subscribersRicerca : number = 0;

  JanIncassi : number = 0;
  FebIncassi : number = 0;
  MarIncassi : number = 0;
  AprIncassi : number = 0;
  MayIncassi : number = 0;
  JunIncassi : number = 0;
  JulIncassi : number = 0;
  AugIncassi : number = 0;
  SepIncassi : number = 0;
  OctIncassi : number = 0;
  NovIncassi : number = 0;
  DecIncassi : number = 0;

  JanKg : number = 0;
  FebKg : number = 0;
  MarKg : number = 0;
  AprKg : number = 0;
  MayKg : number = 0;
  JunKg : number = 0;
  JulKg : number = 0;
  AugKg : number = 0;
  SepKg : number = 0;
  OctKg : number = 0;
  NovKg : number = 0;
  DecKg : number = 0;

  JanBook : number = 0;
  FebBook : number = 0;
  MarBook : number = 0;
  AprBook : number = 0;
  MayBook : number = 0;
  JunBook : number = 0;
  JulBook : number = 0;
  AugBook : number = 0;
  SepBook : number = 0;
  OctBook : number = 0;
  NovBook : number = 0;
  DecBook : number = 0;



  unoBook : number = 0;
  dueBook : number = 0;
  treBook : number = 0;
  quattBook : number = 0;
  cinBook : number = 0;
  seiBook : number = 0;
  setBook : number = 0;
  ottBook : number = 0;
  novBook : number = 0;
  dieciBook : number = 0;
  undiciBook : number = 0;
  dodiciBook : number = 0;
  tredBook : number = 0;
  quattordBook : number = 0;
  quindiBook : number = 0;
  sediBook : number = 0;
  diciasBook : number = 0;
  dicioBook : number = 0;
  diciaBook : number = 0;
  ventiBook : number = 0;
  ventunoBook : number = 0;
  ventidueBook : number = 0;
  ventitreBook : number = 0;
  ventiquaBook : number = 0;
  venticinBook : number = 0;
  ventiseiBook : number = 0;
  ventisettBook : number = 0;
  ventottBook : number = 0;
  ventinovBook : number = 0;
  trentaBook : number = 0;
  trentunoBook : number = 0;

  unoBookKg : number = 0;
  dueBookKg : number = 0;
  treBookKg : number = 0;
  quattBookKg : number = 0;
  cinBookKg : number = 0;
  seiBookKg : number = 0;
  setBookKg : number = 0;
  ottBookKg : number = 0;
  novBookKg : number = 0;
  dieciBookKg : number = 0;
  undiciBookKg : number = 0;
  dodiciBookKg : number = 0;
  tredBookKg : number = 0;
  quattordBookKg : number = 0;
  quindiBookKg : number = 0;
  sediBookKg : number = 0;
  diciasBookKg : number = 0;
  dicioBookKg : number = 0;
  diciaBookKg : number = 0;
  ventiBookKg : number = 0;
  ventunoBookKg : number = 0;
  ventidueBookKg : number = 0;
  ventitreBookKg : number = 0;
  ventiquaBookKg : number = 0;
  venticinBookKg : number = 0;
  ventiseiBookKg : number = 0;
  ventisettBookKg : number = 0;
  ventottBookKg : number = 0;
  ventinovBookKg : number = 0;
  trentaBookKg : number = 0;
  trentunoBookKg : number = 0;

  nOfferte : number = 0;
  nRegistrati : number = 0;

  bookings : AffittuarioPrenotaViaggioRoute[] = [] as AffittuarioPrenotaViaggioRoute[];

  JanC : number = 0;
  FebC : number = 0;
  MarC : number = 0;
  AprC : number = 0;
  MayC : number = 0;
  JunC : number = 0;
  JulC : number = 0;
  AugC : number = 0;
  SepC : number = 0;
  OctC : number = 0;
  NovC : number = 0;
  DecC : number = 0;

  JanA : number = 0;
  FebA : number = 0;
  MarA : number = 0;
  AprA : number = 0;
  MayA : number = 0;
  JunA : number = 0;
  JulA : number = 0;
  AugA : number = 0;
  SepA : number = 0;
  OctA : number = 0;
  NovA : number = 0;
  DecA : number = 0;
  searchView : boolean = false;

  actualMonth : string = "";
  prezzi : number [] = [];

  fatturati : Fatturato[] = [] as Fatturato[];
  percentuali : PercentualeFatturato[] = [] as PercentualeFatturato[];

  incassiTotali : number = 0;
  allPrezzi : number [] = [] as number[];

  Highcharts : any = Highcharts;
  constructor(private spinnerService : NgxSpinnerService,
              private userService : UserService,
              private affittuarioService : AffittuarioService,
              private companyService : CompanyService,
              private bookingService: AffituarioPrenotaRouteService,
              private viaggioRouteService : ViaggioRouteService,
              private viaggioService : ViaggioService,
              private routeService : RouteService,
              private vectorService : VectorService
            ) { }

  newUserMiniChartData : number[] = [] as number[];
  newUserIncrement : number = 0;
  bookingIncrement : number = 0;
  incassiIncrement : number = 0;
  kgIncrement : number = 0;

  finestraMesi : string[] = [] as string[];
  bookingDatiFinestra : number[] = [] as number[];
  incassiFinestra : number[] = [] as number[];
  KgFinestra : number[] = [] as number[];

  colorMini1 : string = '#5cb85c'
  colorMini2 : string = '#5cb85c'
  colorMini3 : string = '#5cb85c'
  colorMini4 : string = '#5cb85c'
  entireActualMonth : string = "";
  prezziBubble : number[][] = [] as number[][];
  nVectors : number = 0;

  nationsCount : NazioneConteggio[] = [] as NazioneConteggio[];

  italiaCount : number = 0;
  russiaCount : number = 0;
  franciaCount : number = 0;
  usaCount : number = 0;
  regnoUnitoCount : number = 0;
  spagnaCount : number = 0;
  indiaCount : number = 0;
  canadaCount : number = 0;
  cinaCount : number = 0;
  giapponeCount : number = 0;
  greciaCount : number = 0;
  svizzeraCount : number = 0;
  germaniaCount : number = 0;
  portogalloCount : number = 0;

   ngOnInit(): void {
    var now = new Date();
    this.entireActualMonth = this.switcherEntireMonth(now.getMonth())
    this.actualMonth = this.switcherMonth(now.getMonth());

    this.getVectors();
    this.getUsers();
    this.getBookings();
    this.getIncassiPerGiorno();
    this.getFatturato();
    this.getAllPrezzi();
    this.getAllCities();

    this.spinnerService.show();
    setTimeout(() => {
      this.spinnerService.hide();

    }, 2100);


}

  async getAllCities(){
  await new Promise<void> ((resolve, reject) => {
  this.viaggioRouteService.getAll().subscribe(async allList =>{
    await new Promise<void> (async (resolve, reject) => {
      for (const viaggioRoute of allList) {
        await new Promise<void> ((resolve, reject) => {
        this.routeService.getById(viaggioRoute.routeId).subscribe(async rotta =>{

          await new Promise<void> ((resolve, reject) => {
          this.routeService.getCoordinates(rotta.endCity).subscribe( (result : any) =>{
            console.log(result)
            var toAdd : boolean = true;
            var nation : string = result.features[0].context[result.features[0].context.length - 1].text;

            for(var i = 0; i<this.nationsCount.length; i++){
              if(this.nationsCount[i].nation == nation){
                toAdd = false;
                this.nationsCount[i].conteggio = this.nationsCount[i].conteggio + 1;
              }
            }

            var countToAdd : NazioneConteggio = {} as NazioneConteggio;
                countToAdd.nation = nation;
                countToAdd.conteggio = 1;

          if(toAdd)
            this.nationsCount.push(countToAdd);

            this.aggiornaConteggio(countToAdd.nation)

            resolve();
          });
          })
          resolve();
        })

        resolve();

        });
      }
    });
  });
  resolve();
});
}
getVectors(){
  this.vectorService.getAll().subscribe(all =>{
    this.nVectors = all.length;
  })
}

  async getUsers(){
  await new Promise<void> ((resolve, reject) => {

    this.userService.getAll().subscribe(async users =>{
      this.allUsers = users;

      await new Promise<void> (async (resolve, reject) => {

      for (const user of users) {

        if(user.type == 'company'){
          await new Promise<void> ((resolve, reject) => {

          this.companyService.getById(user.id).subscribe(company =>{
            this.allCompanies.push(company);
            this.nRegistrati = this.nRegistrati + 1;

            if(company.abilitationDate != null){
              this.getMese(company);
            }
            resolve();

          });
        });
        }
        if(user.type == 'affittuario'){
          await new Promise<void> ((resolve, reject) => {

          this.affittuarioService.getById(user.id).subscribe(affittuario =>{
            this.allAffittuari.push(affittuario);
            this.nRegistrati = this.nRegistrati + 1;

            if(affittuario.abilitationDate != null){
              this.getMeseAffittuario(affittuario);
            }
            resolve();
          });
        });
        }

          resolve();
      }
      var now : Date = new Date();
      var monthString = this.switcherMonth(now.getMonth());
      this.setIncrementoUser(monthString);

      if(this.newUserMiniChartData[2] != 0 )
        this.newUserIncrement = Number((((this.newUserMiniChartData[3]-this.newUserMiniChartData[2])/this.newUserMiniChartData[2])*100).toFixed(1))
      else
        this.newUserIncrement = 100;
    });


      resolve();
    });
  });

}

getMese( company : Company){

  var date = new Date(company.abilitationDate);
  var month = date.getMonth();

  if(month == 0){
    this.JanC = this.JanC + 1;
  }
  if(month == 1){
    this.FebC = this.FebC + 1;
  }
  if(month == 2){
    this.MarC = this.MarC + 1;
  }
  if(month == 3){
    this.AprC = this.AprC + 1;
  }
  if(month == 4){
    this.MayC = this.MayC + 1;
  }
  if(month == 5){
    this.JunC = this.JunC + 1;
  }
  if(month == 6){
    this.JulC = this.JulC + 1;
  }
  if(month == 7){
    this.AugC = this.AugC + 1;
  }
  if(month == 8){
    this.SepC = this.SepC + 1;
  }
  if(month == 9){
    this.OctC = this.OctC + 1;
  }
  if(month == 10){
    this.NovC = this.NovC + 1;
  }
  if(month == 11){
    this.DecC = this.DecC + 1;
  }

}

getMeseAffittuario( affittuario : Affittuario){

  var date = new Date(affittuario.abilitationDate);
  var month = date.getMonth();

  if(month == 0){
    this.JanA = this.JanA + 1;
  }
  if(month == 1){
    this.FebA = this.FebA + 1;
  }
  if(month == 2){
    this.MarA = this.MarA + 1;
  }
  if(month == 3){
    this.AprA = this.AprA + 1;
  }
  if(month == 4){
    this.MayA = this.MayA + 1;
  }
  if(month == 5){
    this.JunA = this.JunA + 1;
  }
  if(month == 6){
    this.JulA = this.JulA + 1;
  }
  if(month == 7){
    this.AugA = this.AugA + 1;
  }
  if(month == 8){
    this.SepA = this.SepA + 1;
  }
  if(month == 9){
    this.OctA = this.OctA + 1;
  }
  if(month == 10){
    this.NovA = this.NovA + 1;
  }
  if(month == 11){
    this.DecA = this.DecA + 1;
  }

}

getMeseViaggioRoute( viaggioRoute : ViaggioRoute){

  var date = new Date(viaggioRoute.startDate);
  var month = date.getMonth();

  if(month == 0){
    this.JanBook = this.JanBook + 1;
  }
  if(month == 1){
    this.FebBook = this.FebBook + 1;
  }
  if(month == 2){
    this.MarBook = this.MarBook + 1;
  }
  if(month == 3){
    this.AprBook = this.AprBook + 1;
  }
  if(month == 4){
    this.MayBook = this.MayBook + 1;
  }
  if(month == 5){
    this.JunBook = this.JunBook + 1;
  }
  if(month == 6){
    this.JulBook = this.JulBook + 1;
  }
  if(month == 7){
    this.AugBook = this.AugBook + 1;
  }
  if(month == 8){
    this.SepBook = this.SepBook + 1;
  }
  if(month == 9){
    this.OctBook = this.OctBook + 1;
  }
  if(month == 10){
    this.NovBook = this.NovBook + 1;
  }
  if(month == 11){
    this.DecBook = this.DecBook + 1;
  }

}

getDayBooking( booking : AffittuarioPrenotaViaggioRoute, prezzo : number){

  var date = new Date(booking.prenotationDate);
  var day = date.getDate();
  var monthNumber = date.getMonth();

  var monthName : string = this.switcherMonth(monthNumber);

  if(monthName == this.actualMonth){


  if(day == 1){
    this.unoBook = this.unoBook + prezzo;
    this.unoBookKg = this.unoBookKg + booking.bookedCapacity;

  }
  if(day == 2){
    this.dueBook = this.dueBook + prezzo;
    this.dueBookKg = this.dueBookKg + booking.bookedCapacity;

  }
  if(day == 3){
    this.treBook = this.treBook + prezzo;
    this.treBookKg = this.treBookKg + booking.bookedCapacity;

  }
  if(day == 4){
    this.quattBook = this.quattBook + prezzo;
    this.quattBookKg = this.quattBookKg + booking.bookedCapacity;

  }
  if(day == 5){
    this.cinBook = this.cinBook + prezzo;
    this.cinBookKg = this.cinBookKg + booking.bookedCapacity;

  }
  if(day == 6){
    this.seiBook = this.seiBook + prezzo;
    this.seiBookKg = this.seiBookKg + booking.bookedCapacity;

  }
  if(day == 7){
    this.setBook = this.setBook + prezzo;
    this.setBookKg = this.setBookKg + booking.bookedCapacity;

  }
  if(day == 8){
    this.ottBook = this.ottBook + prezzo;
    this.ottBookKg = this.ottBookKg + booking.bookedCapacity;

  }
  if(day == 9){
    this.novBook = this.novBook + prezzo;
    this.novBookKg = this.novBookKg + booking.bookedCapacity;

  }
  if(day == 10){
    this.dieciBook = this.dieciBook + prezzo;
    this.dieciBookKg = this.dieciBookKg + booking.bookedCapacity;

  }
  if(day == 11){
    this.undiciBook = this.undiciBook + prezzo;
    this.undiciBookKg = this.undiciBookKg + booking.bookedCapacity;

  }
  if(day == 12){
    this.dodiciBook = this.dodiciBook + prezzo;
    this.dodiciBookKg = this.dodiciBookKg + booking.bookedCapacity;

  }

  if(day == 13){
    this.tredBook = this.tredBook + prezzo;
    this.tredBookKg = this.tredBookKg + booking.bookedCapacity;

  }
  if(day == 14){
    this.quattordBook = this.quattordBook + prezzo;
    this.quattordBookKg = this.quattordBookKg + booking.bookedCapacity;

  }
  if(day == 15){
    this.quindiBook = this.quindiBook + prezzo;
    this.quindiBookKg = this.quindiBookKg + booking.bookedCapacity;

  }
  if(day == 16){
    this.sediBook = this.sediBook + prezzo;
    this.sediBookKg = this.sediBookKg + booking.bookedCapacity;

  }
  if(day == 17){
    this.diciasBook = this.diciasBook + prezzo;
    this.diciaBookKg = this.diciaBookKg + booking.bookedCapacity;

  }
  if(day == 18){
    this.dicioBook = this.dicioBook + prezzo;
    this.dicioBookKg = this.dicioBookKg + booking.bookedCapacity;

  }
  if(day == 19){
    this.diciaBook = this.diciaBook + prezzo;
    this.diciaBookKg = this.diciaBookKg + booking.bookedCapacity;

  }
  if(day == 20){
    this.ventiBook = this.ventiBook + prezzo;
    this.ventiBookKg = this.ventiBookKg + booking.bookedCapacity;

  }
  if(day == 21){
    this.ventunoBook = this.ventunoBook + prezzo;
    this.ventunoBookKg = this.ventunoBookKg + booking.bookedCapacity;

  }
  if(day == 22){
    this.ventidueBook = this.ventidueBook + prezzo;
    this.ventidueBookKg = this.ventidueBookKg + booking.bookedCapacity;

  }
  if(day == 23){
    this.ventitreBook = this.ventitreBook + prezzo;
    this.ventitreBookKg = this.ventitreBookKg + booking.bookedCapacity;

  }
  if(day == 24){
    this.ventiquaBook = this.ventiquaBook + prezzo;
    this.ventiquaBookKg = this.ventiquaBookKg + booking.bookedCapacity;

  }

  if(day == 25){
    this.venticinBook = this.venticinBook + prezzo;
    this.venticinBookKg = this.venticinBookKg + booking.bookedCapacity;

  }
  if(day == 26){
    this.ventiseiBook = this.ventiseiBook + prezzo;
    this.ventiseiBookKg = this.ventiseiBookKg + booking.bookedCapacity;

  }
  if(day == 27){
    this.ventisettBook = this.ventisettBook + prezzo;
    this.ventisettBookKg = this.ventisettBookKg + booking.bookedCapacity;

  }
  if(day == 28){
    this.ventottBook = this.ventottBook + prezzo;
    this.ventottBookKg = this.ventottBookKg + booking.bookedCapacity;

  }
  if(day == 29){
    this.ventinovBook = this.ventinovBook + prezzo;
    this.ventinovBookKg = this.ventinovBookKg + booking.bookedCapacity;

  }
  if(day == 30){
    this.trentaBook = this.trentaBook + prezzo;
    this.trentaBookKg = this.trentaBookKg + booking.bookedCapacity;

  }
  if(day == 31){
    this.trentunoBook = this.trentunoBook + prezzo;
    this.trentunoBookKg = this.trentunoBookKg + booking.bookedCapacity;

  }
  }

}


getMonthBooking( booking : AffittuarioPrenotaViaggioRoute, prezzo : number){

  var date = new Date(booking.prenotationDate);
  var monthNumber = date.getMonth();

  if(monthNumber == 0){
    this.JanIncassi = this.JanIncassi + prezzo;
    this.JanKg = this.JanKg + booking.bookedCapacity;
  }

  if(monthNumber == 1){
    this.FebIncassi = this.FebIncassi + prezzo;
    this.FebKg = this.FebKg + booking.bookedCapacity;

  }
  if(monthNumber == 2){
    this.MarIncassi = this.MarIncassi + prezzo;
    this.MarKg = this.MarKg + booking.bookedCapacity;

  }
  if(monthNumber == 3){
    this.AprIncassi = this.AprIncassi + prezzo;
    this.AprKg = this.AprKg + booking.bookedCapacity;

  }
  if(monthNumber == 4){
    this.MayIncassi = this.MayIncassi + prezzo;
    this.MayKg = this.MayKg + booking.bookedCapacity;
  }
  if(monthNumber == 5){
    this.JunIncassi = this.JunIncassi + prezzo;
    this.JunKg = this.JunKg + booking.bookedCapacity;

  }
  if(monthNumber == 6){
    this.JulIncassi = this.JulIncassi + prezzo;
    this.JulKg = this.JulKg + booking.bookedCapacity;

  }
  if(monthNumber == 7){
    this.AugIncassi = this.AugIncassi + prezzo;
    this.AugKg = this.AugKg + booking.bookedCapacity;

  }
  if(monthNumber == 8){
    this.SepIncassi = this.SepIncassi + prezzo;
    this.SepKg = this.SepKg + booking.bookedCapacity;

  }
  if(monthNumber == 9){
    this.OctIncassi = this.OctIncassi + prezzo;
    this.OctKg = this.OctKg + booking.bookedCapacity;

  }
  if(monthNumber == 10){
    this.NovIncassi = this.NovIncassi + prezzo;
    this.NovKg = this.NovKg + booking.bookedCapacity;

  }
  if(monthNumber == 11){
    this.DecIncassi = this.DecIncassi + prezzo;
    this.DecKg = this.DecKg + booking.bookedCapacity;

  }


}

show2(){
  this.show = !this.show;
  this.chartOptions = {
    chart: {
        type: 'column',
        heigth : 500,
        width : 1000
    },

    title: {
        text: 'New registered users / month'
    },

    xAxis: {
        categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'],
        labels: {
            skew3d: true,
            style: {
                fontSize: '16px'
            }
        }
    },

    yAxis: {
        allowDecimals: false,
        min: 0,
        title: {
            text: 'Number of new users',
            skew3d: true
        }
    },

    tooltip: {
        headerFormat: '<b>{point.key}</b><br>',
        pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: {point.y} / {point.stackTotal}'
    },

    plotOptions: {
        column: {
            stacking: 'normal',
            depth: 40
        }
    },

    series: [{
        name: 'Companies',
        data: [this.JanC, this.FebC, this.MarC, this.AprC, this.MayC, this.JunC, this.JulC, this.AugC, this.SepC, this.OctC, this.NovC, this.DecC],
        stack: 'female',
        color: 'rgb(128, 169, 245)'
    }, {
        name: 'Renters',
        data: [this.JanA, this.FebA, this.MarA, this.AprA, this.MayA, this.JunA, this.JulA, this.AugA, this.SepA, this.OctA, this.NovA, this.DecA],
        color: 'lightsalmon',
        stack: 'female'
    },
  ]
}

this.chartOptions2 = {
  chart: {

  },
  title: {
      text: 'Booking / month'
  },
  subtitle: {
      text: ''
  },
  xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },

  series: [{
      name: 'Bookings',
      type: 'cylinder',

      colorByPoint: true,
      data: [this.JanBook, this.FebBook, this.MarBook, this.AprBook, this.MayBook, this.JunBook, this.JulBook, this.AugBook, this.SepBook, this.OctBook, this.NovBook, this.DecBook],
      showInLegend: false
  }]
}

this.chartOptions3 = {
  chart: {
      type: 'area',
      width : 1000,
      heigth : 1000,

  },
  title: {
      text: '2021, $ earned and Kg rented by day '
  },
  subtitle: {
      text: 'month: July'
  },
  xAxis: {
      categories: [this.actualMonth+', 1', this.actualMonth+', 2', this.actualMonth+', 3',this.actualMonth+', 4', this.actualMonth+', 5', this.actualMonth+', 6', this.actualMonth+', 7', this.actualMonth+', 8', this.actualMonth+', 9', this.actualMonth+', 10', this.actualMonth+', 11', this.actualMonth+', 12', this.actualMonth+', 13', this.actualMonth+', 14', this.actualMonth+', 15', this.actualMonth+', 16', this.actualMonth+', 17', this.actualMonth+', 18', this.actualMonth+', 19', this.actualMonth+', 20', this.actualMonth+', 21', this.actualMonth+', 22', this.actualMonth+', 23', this.actualMonth+', 24', this.actualMonth+', 25', this.actualMonth+', 26', this.actualMonth+', 27', this.actualMonth+', 28', this.actualMonth+', 29', this.actualMonth+', 30', this.actualMonth+', 31'],
      tickmarkPlacement: 'on',
      title: {
          enabled: false
      }
  },
  yAxis: {
      title: {
        text: '$ or Kg'
      },

  },
  tooltip: {
      split: true,
  },
  plotOptions: {
      area: {
          stacking: 'normal',
          lineColor: '#666666',
          lineWidth: 1,
          marker: {
              lineWidth: 1,
              lineColor: '#666666'
          }
      }
  },
  series: [{
      name: 'Daily earnings $',
      data: [this.unoBook, this.dueBook, this.treBook, this.quattBook, this.cinBook,this.seiBook, this.setBook,this.ottBook, this.novBook,this.dieciBook,this.undiciBook,this.dodiciBook,this.tredBook,this.quattordBook,this.quindiBook,this.sediBook,this.diciasBook,this.dicioBook,this.diciaBook, this.ventiBook, this.ventunoBook, this.ventidueBook, this.ventitreBook, this.ventiquaBook,this.venticinBook, this.ventiseiBook,this.ventisettBook,this.ventottBook, this.ventinovBook,this.trentaBook,this.trentunoBook]
  },
  {
    name: 'Daily rented Kg',
    data: [this.unoBookKg, this.dueBookKg, this.treBookKg, this.quattBookKg, this.cinBookKg,this.seiBookKg, this.setBookKg,this.ottBookKg, this.novBookKg,this.dieciBookKg,this.undiciBookKg,this.dodiciBookKg,this.tredBookKg,this.quattordBookKg,this.quindiBookKg,this.sediBookKg,this.diciasBookKg,this.dicioBookKg,this.diciaBookKg, this.ventiBookKg, this.ventunoBookKg, this.ventidueBookKg, this.ventitreBookKg, this.ventiquaBookKg,this.venticinBookKg, this.ventiseiBookKg,this.ventisettBookKg,this.ventottBookKg, this.ventinovBookKg,this.trentaBookKg,this.trentunoBookKg],
    color: 'lightsalmon'

  }]

}

HC_exporting(Highcharts);
HC_More(Highcharts);
HCSoldGauge(Highcharts);
HC3D(Highcharts);
cylinder(Highcharts);
HC_map(Highcharts);


if(this.newUserMiniChartData[3] < this.newUserMiniChartData[2])
  this.colorMini1 = '#d9534f';

  if(this.bookingDatiFinestra[3] < this.bookingDatiFinestra[2])
  this.colorMini2 = '#d9534f';

  if(this.incassiFinestra[3] < this.incassiFinestra[2])
  this.colorMini3 = '#d9534f';

  if(this.KgFinestra[3] < this.KgFinestra[2])
  this.colorMini4 = '#d9534f';


this.pieOptions = {
  chart: {
      type: 'pie',

      options3d: {
          enabled: true,
          alpha: 45,
          beta: 0
      }
  },
  title: {
      text: 'Consumer\'s spending distribution'
  },
  accessibility: {
      point: {
          valueSuffix: '%'
      }
  },
  tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
  },
  plotOptions: {
      pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          depth: 35,
          dataLabels: {
              enabled: true,
              format: '{point.name} : {point.y}%'
          }
      }
  },
  series:
  [{
      type: 'pie',
      name: 'Percentage',
      data:  this.percentuali
  }],

}

this.miniChartOprions = {
  chart: {
    type : 'area',
    borderWidth : 0,
    heigth : 120,
    backGroundColor : null,
    margin : [2,2,30,2],


  },
  title : {
    text : null
  },

  exporting : {
    enabled : false
  },

  legend : {
    enabled : false
  },
  series :  [{
    name: 'New user',
    data: this.newUserMiniChartData,
    color: this.colorMini1

  }]
  ,
  xAxis: {
    categories: this.finestraMesi,
    labels: {
        skew3d: true,
        style: {
            fontSize: '16px'
        }
    }
,
    title : {
      text : null
    },
    startOnTick : false,
    endOnTick : false,
    tickOptions : []
  },
  yAxis : {
    labels : {
      enabled : false
    },
    title : {
      text : null
    },
    startOnTick : false,
    endOnTick : false,
    tickOptions : []
  },
  credits : {
    enabled : false
  },

}

this.miniChartOptions2 = {
  chart: {
    type : 'area',
    borderWidth : 0,
    heigth : 120,
    backGroundColor : null,
    margin : [2,2,30,2]

  },
  title : {
    text : null
  },

  exporting : {
    enabled : false
  },

  legend : {
    enabled : false
  },
  series :  [{
    name: 'Bookings',
    data: this.bookingDatiFinestra,
    color: this.colorMini2

  }]
  ,
  xAxis: {
    categories: this.finestraMesi,
    labels: {
        skew3d: true,
        style: {
            fontSize: '16px'
        }
    }
,
    title : {
      text : null
    },
    startOnTick : false,
    endOnTick : false,
    tickOptions : []
  },
  yAxis : {
    labels : {
      enabled : false
    },
    title : {
      text : null
    },
    startOnTick : false,
    endOnTick : false,
    tickOptions : []
  },
  credits : {
    enabled : false
  },

}

this.miniChartOptions3 = {
  chart: {
    type : 'area',
    borderWidth : 0,
    heigth : 120,
    backGroundColor : null,
    margin : [2,2,30,2]

  },
  title : {
    text : null
  },

  tooltip : {


    valueSuffix: ' $'

  },
  exporting : {
    enabled : false
  },

  legend : {
    enabled : false
  },
  series :  [{
    name: 'Money Handled',
    data: this.incassiFinestra,
    color: this.colorMini3

  }]
  ,
  xAxis: {
    categories: this.finestraMesi,
    labels: {
        skew3d: true,
        style: {
            fontSize: '16px'
        }
    }
,
    title : {
      text : null
    },
    startOnTick : false,
    endOnTick : false,
    tickOptions : []
  },
  yAxis : {
    labels : {
      enabled : false
    },
    title : {
      text : null
    },
    startOnTick : false,
    endOnTick : false,
    tickOptions : []
  },
  credits : {
    enabled : false
  },

}


this.miniChartOptions4 = {
  chart: {
    type : 'area',
    borderWidth : 0,
    heigth : 120,
    backGroundColor : null,
    margin : [2,2,30,2]

  },
  title : {
    text : null
  },

  tooltip : {

    valueSuffix: ' Kg'

  },
  exporting : {
    enabled : false
  },

  legend : {
    enabled : false
  },
  series :  [{
    name: 'Booked Kg',
    data: this.KgFinestra,
    color: this.colorMini4

  }]
  ,
  xAxis: {
    categories: this.finestraMesi,
    labels: {
        skew3d: true,
        style: {
            fontSize: '16px'
        }
    }
,
    title : {
      text : null
    },
    startOnTick : false,
    endOnTick : false,
    tickOptions : []
  },
  yAxis : {
    labels : {
      enabled : false
    },
    title : {
      text : null
    },
    startOnTick : false,
    endOnTick : false,
    tickOptions : []
  },
  credits : {
    enabled : false
  },

}

this.bubbleChart = {

  chart: {
      type: 'bubble',
      plotBorderWidth: 1,
      zoomType: 'xy',
      options3d: {
        enabled: true,
        alpha: 15,
        beta: 15,
        depth: 50,
        viewDistance: 25
    }

  },

  title: {
      text: 'Selling prices of companies\' offers'
  },

  xAxis: {
      gridLineWidth: 1,
      accessibility: {
          rangeDescription: 'Range: 0 to 100.'
      }
  },

  yAxis: {
      startOnTick: false,
      endOnTick: false,
      accessibility: {
          rangeDescription: 'Range: 0 to 100.'
      }
  },

  series: [{
    name: 'Selling price',
    tooltip : {
      pointFormat: '<b>{point.y} $/Km</b>',
    },
      data:
          this.prezziBubble,

      marker: {

          fillColor: {
              radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
              stops: [
                  [0, 'rgba(255,255,255,0.5)'],
                  [1, Highcharts.color((Highcharts as any).getOptions().colors[0]).setOpacity(0.5).get('rgba')]
              ]
          }
      }
  },
  {
    type: 'spline',
    name: 'Regression Line',
    color : 'red',

  dashStyle: 'shortdot',

    data: [this.prezziBubble[0],this.prezziBubble[this.prezziBubble.length-1]],
    marker: {
        enabled: false,
    },
    states: {
        hover: {
            lineWidth: 0
        }
    },
    enableMouseTracking: false
}]

}

this.allStatsChartOptions = {

  chart: {
      type: 'solidgauge',


  },

  title: {
      text: 'System\'s numbers',
      style: {
          fontSize: '24px'
      }
  },

  tooltip: {
      borderWidth: 0,
      backgroundColor: 'none',
      shadow: false,
      style: {
          fontSize: '16px'
      },
      pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}</span>',

  },

  pane: {
      startAngle: 0,
      endAngle: 360,
      background: [{ // Track for Move
          outerRadius: '112%',
          innerRadius: '88%',
          backgroundColor: Highcharts.color((Highcharts as any).getOptions().colors[0])
              .setOpacity(0.3)
              .get(),
          borderWidth: 0
      }, { // Track for Exercise
          outerRadius: '87%',
          innerRadius: '63%',
          backgroundColor: Highcharts.color((Highcharts as any).getOptions().colors[2])
              .setOpacity(0.3)
              .get(),
          borderWidth: 0
      }, { // Track for Stand
          outerRadius: '62%',
          innerRadius: '38%',
          backgroundColor: Highcharts.color((Highcharts as any).getOptions().colors[8])
              .setOpacity(0.3)
              .get(),
          borderWidth: 0
      }]
  },

  yAxis: {
      min: 0,
      max: Math.max(this.nOfferte,this.nRegistrati,this.nVectors),
      lineWidth: 0,
      tickPositions: []
  },

  plotOptions: {
      solidgauge: {
          dataLabels: {
              enabled: false
          },
          linecap: 'round',
          stickyTracking: false,
          rounded: true
      }
  },

  series: [{
      name: 'Registered users',
      data: [{
          color: (Highcharts as any).getOptions().colors[0],
          radius: '112%',
          innerRadius: '88%',
          y: this.nRegistrati
      }]
  }, {
      name: 'Added Offers',
      data: [{
          color: (Highcharts as any).getOptions().colors[2],
          radius: '87%',
          innerRadius: '63%',
          y: this.nOfferte
      }]
  }, {
      name: 'Inserted Vectors',
      data: [{
          color: (Highcharts as any).getOptions().colors[8],
          radius: '62%',
          innerRadius: '38%',
          y: this.nVectors
      }]
  }]
}

this.mapChartOptions ={
  chart: {
    map: 'custom/europe',
    borderWidth: 1
  },

  title: {
      text: 'Nordic countries'
  },

  subtitle: {
      text: 'Demo of drawing all areas in the map, only highlighting partial data'
  },

  legend: {
      enabled: false
  },

  series: [{
      name: 'Country',
      data: [
          ['is', 1],
          ['no', 1],
          ['se', 1],
          ['dk', 1],
          ['fi', 1]
      ],
      dataLabels: {
          enabled: true,
          color: '#FFFFFF',

      },
      tooltip: {
          headerFormat: '',
          pointFormat: '{point.name}'
      }
  }]
}

this.mapOptions = {
  chart: {
    map: worldMap,
    heigth : 700,
    width: 700
    },
  title: {
    text: 'MAP WORLD'
  },

  subtitle: {
    text:
    'Trend of world routes'
  },
  mapNavigation: {
    enabled: true,
    buttonOptions: {
      verticalAlign: 'bottom'
  }
  },
  legend: {
    enabled: true
  },
  colorAxis: {
    min: 0
  },

  xAxis: {
    visible: false,

},

yAxis: {
    visible: false,

},

  series: [
    {
      type: "map",
      name: 'Deliveries in',
      color: '#FF0000',
      states: {

        hover: {
          color: '#FF0000',
        }
      },
      dataLabels: {
        format: "{point.name}"
      },
      allAreas: true,
      data:
      [
        ['it', this.italiaCount],
        ['ru', this.russiaCount],
        ['fr', this.franciaCount],
        ['us', this.usaCount],
        ['gb', this.regnoUnitoCount],
        ['es', this.spagnaCount],
        ['in', this.indiaCount],
        ['ca', this.canadaCount],
        ['cn', this.cinaCount],
        ['jp', this.giapponeCount],
        ['gr', this.greciaCount],
        ['ch', this.svizzeraCount],
        ['de', this.germaniaCount],
        ['pt', this.portogalloCount]
      ]
    }
  ]
};

}

async getBookings(){


  await new Promise<void> ((resolve, reject) => {
  this.bookingService.getAll().subscribe(async data =>{
    this.bookings = data;

    await new Promise<void> (async (resolve, reject) => {
      for (const booking of data) {
        await new Promise<void> ((resolve, reject) => {
        this.viaggioRouteService.getById(booking.viaggioRouteId).subscribe(async viaggioRoute =>{

          this.getMeseViaggioRoute(viaggioRoute);

          resolve();
        });
      });
        resolve();
      }
      var now : Date = new Date();
      var monthString = this.switcherMonth(now.getMonth());
      this.setIncrementoBookings(monthString);
      if(this.bookingDatiFinestra[2] != 0)
      this.bookingIncrement = Number((((this.bookingDatiFinestra[3]-this.bookingDatiFinestra[2])/this.bookingDatiFinestra[2])*100).toFixed(1))
      else
        this.bookingIncrement = 100;
    });

    resolve();
  });
});
}

  async getIncassiPerGiorno(){
  await new Promise<void> ((resolve, reject) => {
    this.bookingService.getAll().subscribe(async data =>{
      this.bookings = data;

      await new Promise<void> (async (resolve, reject) => {
        for (const booking of data) {

          await new Promise<void> ((resolve, reject) => {
          this.viaggioRouteService.getById(booking.viaggioRouteId).subscribe(async viaggioRoute =>{

            var costo : number;
            var distance : number;

            await new Promise<void> ((resolve, reject) => {

            this.viaggioService.getById(viaggioRoute.viaggioId).subscribe(viaggio=>{
                costo = viaggio.costoPerKm;

                resolve();
            });
          });

          await new Promise<void> ((resolve, reject) => {

            this.routeService.getById(viaggioRoute.routeId).subscribe(route=>{
                distance = route.distanceKm;
                var prezzo : number = distance * costo;
                this.getDayBooking(booking, Number(prezzo.toFixed(1)));
                this.getMonthBooking(booking, Number(prezzo.toFixed(1)));

                resolve();
            });
          });

            resolve();
          });
        });
          resolve();
        }

        var now : Date = new Date();
        var monthString = this.switcherMonth(now.getMonth());
        this.setIncrementoPrezzi(monthString);

         if(this.incassiFinestra[2] != 0 )
           this.incassiIncrement = Number((((this.incassiFinestra[3]-this.incassiFinestra[2])/this.incassiFinestra[2])*100).toFixed(1))
         else
           this.incassiIncrement = 100;


           if(this.KgFinestra[2] != 0 )
             this.kgIncrement = Number((((this.KgFinestra[3]-this.KgFinestra[2])/this.KgFinestra[2])*100).toFixed(1))
           else
             this.kgIncrement = 100;

      });

      resolve();
    });
  });
}

async getFatturato(){
  await new Promise<void> ((resolve, reject) => {
    this.bookingService.getAll().subscribe(async data =>{
      this.bookings = data;

      await new Promise<void> (async (resolve, reject) => {
        for (const booking of data) {

          await new Promise<void> ((resolve, reject) => {
          this.viaggioRouteService.getById(booking.viaggioRouteId).subscribe(async viaggioRoute =>{

            var costo : number;
            var distance : number;
            var prezzo : number;
            var companyName : string;

            await new Promise<void> ((resolve, reject) => {

            this.viaggioService.getById(viaggioRoute.viaggioId).subscribe(async viaggio=>{
                costo = viaggio.costoPerKm;
                await new Promise<void> ((resolve, reject) => {

                this.companyService.getById(viaggio.companyId).subscribe(company=>{
                  companyName = company.name
                  resolve();
                })
              })


                resolve();
            });
          });

          await new Promise<void> ((resolve, reject) => {

            this.routeService.getById(viaggioRoute.routeId).subscribe(route=>{
                distance = route.distanceKm;
                 prezzo = distance * costo;
                var fatturato : Fatturato = {} as Fatturato;
                fatturato.companyName = companyName;
                fatturato.fatturato = Number(prezzo.toFixed(1));
                var yetPresent : boolean = false;
                for(var i = 0; i<this.fatturati.length;i++){
                  if(this.fatturati[i].companyName == fatturato.companyName){
                  yetPresent = true;
                  this.fatturati[i].fatturato = this.fatturati[i].fatturato + fatturato.fatturato;
                }
                }
                if(!yetPresent)
                  this.fatturati.push(fatturato);
                  resolve();
            });
          });
            resolve();
          });

        });
          resolve();
        }

        for(var i = 0; i< this.fatturati.length;i ++){

          this.incassiTotali = this.incassiTotali + this.fatturati[i].fatturato;
        }


        for(var i = 0; i< this.fatturati.length;i ++){

          var percFatt : PercentualeFatturato  = {} as PercentualeFatturato;

          percFatt.name = this.fatturati[i].companyName;
          percFatt.y = Number(((this.fatturati[i].fatturato / this.incassiTotali) * 100).toFixed(1));

          this.percentuali.push(percFatt);

        }

      });

      resolve();
    });
  });
}

setActualMonth(mese : string){
  this.actualMonth = mese;
  this.freeArray();
  this.getIncassiPerGiorno();

  setTimeout(()=>{
    this.chartOptions3 = {
      chart: {
          type: 'area',
          width : 1000,
          heigth : 1000
      },
      title: {
        text: '2021, $ earned and Kg rented by day '
      },
      subtitle: {
          text: 'month: '+this.actualMonth
      },
      xAxis: {
          categories: [this.actualMonth+', 1', this.actualMonth+', 2', this.actualMonth+', 3',this.actualMonth+', 4', this.actualMonth+', 5', this.actualMonth+', 6', this.actualMonth+', 7', this.actualMonth+', 8', this.actualMonth+', 9', this.actualMonth+', 10', this.actualMonth+', 11', this.actualMonth+', 12', this.actualMonth+', 13', this.actualMonth+', 14', this.actualMonth+', 15', this.actualMonth+', 16', this.actualMonth+', 17', this.actualMonth+', 18', this.actualMonth+', 19', this.actualMonth+', 20', this.actualMonth+', 21', this.actualMonth+', 22', this.actualMonth+', 23', this.actualMonth+', 24', this.actualMonth+', 25', this.actualMonth+', 26', this.actualMonth+', 27', this.actualMonth+', 28', this.actualMonth+', 29', this.actualMonth+', 30', this.actualMonth+', 31'],
          tickmarkPlacement: 'on',
          title: {
              enabled: false
          }
      },
      yAxis: {
          title: {
              text: '$ or Kg'
          },

      },
      tooltip: {
          split: true,
      },
      plotOptions: {
          area: {
              stacking: 'normal',
              lineColor: '#666666',
              lineWidth: 1,
              marker: {
                  lineWidth: 1,
                  lineColor: '#666666'
              }
          }
      },
      series: [{
        name: 'Daily earnings $',
        data: [this.unoBook, this.dueBook, this.treBook, this.quattBook, this.cinBook,this.seiBook, this.setBook,this.ottBook, this.novBook,this.dieciBook,this.undiciBook,this.dodiciBook,this.tredBook,this.quattordBook,this.quindiBook,this.sediBook,this.diciasBook,this.dicioBook,this.diciaBook, this.ventiBook, this.ventunoBook, this.ventidueBook, this.ventitreBook, this.ventiquaBook,this.venticinBook, this.ventiseiBook,this.ventisettBook,this.ventottBook, this.ventinovBook,this.trentaBook,this.trentunoBook]
    },
  {
    name: 'Daily rented Kg',
    data: [this.unoBookKg, this.dueBookKg, this.treBookKg, this.quattBookKg, this.cinBookKg,this.seiBookKg, this.setBookKg,this.ottBookKg, this.novBookKg,this.dieciBookKg,this.undiciBookKg,this.dodiciBookKg,this.tredBookKg,this.quattordBookKg,this.quindiBookKg,this.sediBookKg,this.diciasBookKg,this.dicioBookKg,this.diciaBookKg, this.ventiBookKg, this.ventunoBookKg, this.ventidueBookKg, this.ventitreBookKg, this.ventiquaBookKg,this.venticinBookKg, this.ventiseiBookKg,this.ventisettBookKg,this.ventottBookKg, this.ventinovBookKg,this.trentaBookKg,this.trentunoBookKg],
    color: 'lightsalmon',

  }]
    }
    HC_exporting(Highcharts)

  },500)


}
switcherMonth(mese : number) : string{

  if(mese == 0)
    return 'Jan'
    if(mese == 1)
    return 'Feb'
    if(mese == 2)
    return 'Mar'
    if(mese == 3)
    return 'Apr'
    if(mese == 4)
    return 'May'
    if(mese == 5)
    return 'Jun'
    if(mese == 6)
    return 'Jul'
    if(mese == 7)
    return 'Aug'
    if(mese == 8)
    return 'Sep'
    if(mese == 9)
    return 'Oct'
    if(mese == 10)
    return 'Nov'
    if(mese == 11)
    return 'Dec'

  return "";

}

switcherEntireMonth(mese : number) : string{

  if(mese == 0)
    return 'January'
    if(mese == 1)
    return 'February'
    if(mese == 2)
    return 'March'
    if(mese == 3)
    return 'April'
    if(mese == 4)
    return 'May'
    if(mese == 5)
    return 'June'
    if(mese == 6)
    return 'July'
    if(mese == 7)
    return 'August'
    if(mese == 8)
    return 'September'
    if(mese == 9)
    return 'October'
    if(mese == 10)
    return 'November'
    if(mese == 11)
    return 'December'

  return "";

}

freeArray(){
  this.unoBook = 0;
  this.dueBook = 0;
  this.treBook = 0;
  this.quattBook = 0;
  this.cinBook = 0;
  this.seiBook = 0;
  this.setBook = 0;
  this.ottBook = 0;
  this.novBook = 0;
  this.dieciBook = 0;
  this.undiciBook = 0;
  this.dodiciBook = 0;
  this.tredBook = 0;
  this.quattordBook = 0;
  this.quindiBook = 0;
  this.sediBook = 0;
  this.diciasBook = 0;
  this.dicioBook = 0;
  this.diciaBook = 0;
  this.ventiBook = 0;
  this.ventunoBook = 0;
  this.ventidueBook = 0;
  this.ventitreBook = 0;
  this.ventiquaBook = 0;
  this.venticinBook = 0;
  this.ventiseiBook = 0;
  this.ventisettBook = 0;
  this.ventottBook = 0;
  this.ventinovBook = 0;
  this.trentaBook = 0;
  this.trentunoBook = 0;

  this.unoBookKg = 0;
  this.dueBookKg = 0;
  this.treBookKg = 0;
  this.quattBookKg = 0;
  this.cinBookKg = 0;
  this.seiBookKg = 0;
  this.setBookKg = 0;
  this.ottBookKg = 0;
  this.novBookKg = 0;
  this.dieciBookKg = 0;
  this.undiciBookKg = 0;
  this.dodiciBookKg = 0;
  this.tredBookKg = 0;
  this.quattordBookKg = 0;
  this.quindiBookKg = 0;
  this.sediBookKg = 0;
  this.diciasBookKg = 0;
  this.dicioBookKg = 0;
  this.diciaBookKg = 0;
  this.ventiBookKg = 0;
  this.ventunoBookKg = 0;
  this.ventidueBookKg = 0;
  this.ventitreBookKg = 0;
  this.ventiquaBookKg = 0;
  this.venticinBookKg = 0;
  this.ventiseiBookKg = 0;
  this.ventisettBookKg = 0;
  this.ventottBookKg = 0;
  this.ventinovBookKg = 0;
  this.trentaBookKg = 0;
  this.trentunoBookKg = 0;
}

setIncrementoUser(month : string){
  if(month == 'Apr'){
  this.newUserMiniChartData.push(this.JanA + this.JanC);
  this.newUserMiniChartData.push(this.FebA + this.FebC);
  this.newUserMiniChartData.push(this.MarA + this.MarC);
  this.newUserMiniChartData.push(this.AprA + this.AprC);

  this.finestraMesi.push('Jan');
  this.finestraMesi.push('Feb');
  this.finestraMesi.push('Mar');
  this.finestraMesi.push('Apr');


  }

  if(month == 'May'){
    this.newUserMiniChartData.push(this.FebA + this.FebC);
    this.newUserMiniChartData.push(this.MarA + this.MarC);
    this.newUserMiniChartData.push(this.AprA + this.AprC);
    this.newUserMiniChartData.push(this.MayA + this.MayC);


  this.finestraMesi.push('Jan');
  this.finestraMesi.push('Feb');
  this.finestraMesi.push('Mar');
  this.finestraMesi.push('Apr');


    }

    if(month == 'Jun'){
      this.newUserMiniChartData.push(this.MarA + this.MarC);
      this.newUserMiniChartData.push(this.AprA + this.AprC);
      this.newUserMiniChartData.push(this.MayA + this.MayC);
      this.newUserMiniChartData.push(this.JunA + this.JunC);


      this.finestraMesi.push('Mar');
      this.finestraMesi.push('Apr');
      this.finestraMesi.push('May');
      this.finestraMesi.push('Jun');

      }

      if(month == 'Jul'){
        this.newUserMiniChartData.push(this.AprA + this.AprC);
        this.newUserMiniChartData.push(this.MayA + this.MayC);
        this.newUserMiniChartData.push(this.JunA + this.JunC);
        this.newUserMiniChartData.push(this.JulA + this.JulC);


        this.finestraMesi.push('Apr');
        this.finestraMesi.push('May');
        this.finestraMesi.push('Jun');
        this.finestraMesi.push('Jul');




        }
        if(month == 'Aug'){
          this.newUserMiniChartData.push(this.MayA + this.MayC);
          this.newUserMiniChartData.push(this.JunA + this.JunC);
          this.newUserMiniChartData.push(this.JulA + this.JulC);
          this.newUserMiniChartData.push(this.AugA + this.AugC);

          this.finestraMesi.push('May');
          this.finestraMesi.push('Jun');
          this.finestraMesi.push('Jul');
          this.finestraMesi.push('Aug');



          }
          if(month =='Sep'){
            this.newUserMiniChartData.push(this.JunA + this.JunC);
            this.newUserMiniChartData.push(this.JulA + this.JulC);
            this.newUserMiniChartData.push(this.AugA + this.AugC);
            this.newUserMiniChartData.push(this.SepA + this.SepC);


            this.finestraMesi.push('Jun');
            this.finestraMesi.push('Jul');
            this.finestraMesi.push('Aug');
            this.finestraMesi.push('Sep');



            }
            if(month == 'Oct'){
              this.newUserMiniChartData.push(this.JulA + this.JulC);
              this.newUserMiniChartData.push(this.AugA + this.AugC);
              this.newUserMiniChartData.push(this.SepA + this.SepC);
              this.newUserMiniChartData.push(this.OctA + this.OctC);


              this.finestraMesi.push('Jul');
              this.finestraMesi.push('Aug');
              this.finestraMesi.push('Sep');
              this.finestraMesi.push('Oct');


              }

              if(month == 'Nov'){
                this.newUserMiniChartData.push(this.AugA + this.AugC);
                this.newUserMiniChartData.push(this.SepA + this.SepC);
                this.newUserMiniChartData.push(this.OctA + this.OctC);
                this.newUserMiniChartData.push(this.NovA + this.NovC);


                this.finestraMesi.push('Aug');
                this.finestraMesi.push('Sep');
                this.finestraMesi.push('Oct');
                this.finestraMesi.push('Nov');


                }

                if(month == 'Dec'){
                  this.newUserMiniChartData.push(this.SepA + this.SepC);
                  this.newUserMiniChartData.push(this.OctA + this.OctC);
                  this.newUserMiniChartData.push(this.NovA + this.NovC);
                  this.newUserMiniChartData.push(this.DecA + this.DecC);


                  this.finestraMesi.push('Sep');
                  this.finestraMesi.push('Oct');
                  this.finestraMesi.push('Nov');
                  this.finestraMesi.push('Dec');


                  }
}
setIncrementoBookings(month : string){

  if(month == 'Apr'){

    this.bookingDatiFinestra.push(this.JanBook);
    this.bookingDatiFinestra.push(this.FebBook);
    this.bookingDatiFinestra.push(this.MarBook);
    this.bookingDatiFinestra.push(this.AprBook);


    }

    if(month == 'May'){
      this.bookingDatiFinestra.push(this.FebBook);
      this.bookingDatiFinestra.push(this.MarBook);
      this.bookingDatiFinestra.push(this.AprBook);
      this.bookingDatiFinestra.push(this.MayBook);


      }

      if(month == 'Jun'){
        this.bookingDatiFinestra.push(this.MarBook);
        this.bookingDatiFinestra.push(this.AprBook);
        this.bookingDatiFinestra.push(this.MayBook);
        this.bookingDatiFinestra.push(this.JunBook);

        }

        if(month == 'Jul'){
          this.bookingDatiFinestra.push(this.AprBook);
          this.bookingDatiFinestra.push(this.MayBook);
          this.bookingDatiFinestra.push(this.JunBook);
          this.bookingDatiFinestra.push(this.JulBook);




          }
          if(month == 'Aug'){
            this.bookingDatiFinestra.push(this.MayBook);
            this.bookingDatiFinestra.push(this.JunBook);
            this.bookingDatiFinestra.push(this.JulBook);
            this.bookingDatiFinestra.push(this.AugBook);



            }
            if(month =='Sep'){
              this.bookingDatiFinestra.push(this.JunBook);
              this.bookingDatiFinestra.push(this.JulBook);
              this.bookingDatiFinestra.push(this.AugBook);
              this.bookingDatiFinestra.push(this.SepBook);


              }
              if(month == 'Oct'){
                this.bookingDatiFinestra.push(this.JulBook);
                this.bookingDatiFinestra.push(this.AugBook);
                this.bookingDatiFinestra.push(this.SepBook);
                this.bookingDatiFinestra.push(this.OctBook);


                }

                if(month == 'Nov'){
                  this.bookingDatiFinestra.push(this.AugBook);
                  this.bookingDatiFinestra.push(this.SepBook);
                  this.bookingDatiFinestra.push(this.OctBook);
                  this.bookingDatiFinestra.push(this.NovBook);


                  }

                  if(month == 'Dec'){
                    this.bookingDatiFinestra.push(this.SepBook);
                    this.bookingDatiFinestra.push(this.OctBook);
                    this.bookingDatiFinestra.push(this.NovBook);
                    this.bookingDatiFinestra.push(this.DecBook);


                    }
}

setIncrementoPrezzi(month : string){

  if(month == 'Apr'){

    this.incassiFinestra.push(this.JanIncassi);
    this.incassiFinestra.push(this.FebIncassi);
    this.incassiFinestra.push(this.MarIncassi);
    this.incassiFinestra.push(this.AprIncassi);

    this.KgFinestra.push(this.JanKg);
    this.KgFinestra.push(this.FebKg);
    this.KgFinestra.push(this.MarKg);
    this.KgFinestra.push(this.AprKg);


    }

    if(month == 'May'){

      this.incassiFinestra.push(this.FebIncassi);
      this.incassiFinestra.push(this.MarIncassi);
      this.incassiFinestra.push(this.AprIncassi);
      this.incassiFinestra.push(this.MayIncassi);


    this.KgFinestra.push(this.FebKg);
    this.KgFinestra.push(this.MarKg);
    this.KgFinestra.push(this.AprKg);
    this.KgFinestra.push(this.MayKg);

      }

      if(month == 'Jun'){
        this.incassiFinestra.push(this.MarIncassi);
        this.incassiFinestra.push(this.AprIncassi);
        this.incassiFinestra.push(this.MayIncassi);
        this.incassiFinestra.push(this.JunIncassi);


    this.KgFinestra.push(this.MarKg);
    this.KgFinestra.push(this.AprKg);
    this.KgFinestra.push(this.MayKg);
    this.KgFinestra.push(this.JunKg);

        }

        if(month == 'Jul'){
          this.incassiFinestra.push(this.AprIncassi);
          this.incassiFinestra.push(this.MayIncassi);
          this.incassiFinestra.push(this.JunIncassi);
          this.incassiFinestra.push(this.JulIncassi);

          this.KgFinestra.push(this.AprKg);
          this.KgFinestra.push(this.MayKg);
          this.KgFinestra.push(this.JunKg);
          this.KgFinestra.push(this.JulKg);



          }
          if(month == 'Aug'){
            this.incassiFinestra.push(this.MayIncassi);
            this.incassiFinestra.push(this.JunIncassi);
            this.incassiFinestra.push(this.JulIncassi);
            this.incassiFinestra.push(this.AugIncassi);

            this.KgFinestra.push(this.MayKg);
            this.KgFinestra.push(this.JunKg);
            this.KgFinestra.push(this.JulKg);
            this.KgFinestra.push(this.AugKg);


            }
            if(month =='Sep'){
              this.incassiFinestra.push(this.JunIncassi);
              this.incassiFinestra.push(this.JulIncassi);
              this.incassiFinestra.push(this.AugIncassi);
              this.incassiFinestra.push(this.SepIncassi);

              this.KgFinestra.push(this.JunKg);
              this.KgFinestra.push(this.JulKg);
              this.KgFinestra.push(this.AugKg);
              this.KgFinestra.push(this.SepKg);



              }
              if(month == 'Oct'){
                this.incassiFinestra.push(this.JulIncassi);
                this.incassiFinestra.push(this.AugIncassi);
                this.incassiFinestra.push(this.SepIncassi);
                this.incassiFinestra.push(this.OctIncassi);

                this.KgFinestra.push(this.JulKg);
                this.KgFinestra.push(this.AugKg);
                this.KgFinestra.push(this.SepKg);
                this.KgFinestra.push(this.OctKg);


                }

                if(month == 'Nov'){
                  this.incassiFinestra.push(this.AugIncassi);
                  this.incassiFinestra.push(this.SepIncassi);
                  this.incassiFinestra.push(this.OctIncassi);
                  this.incassiFinestra.push(this.NovIncassi);

                  this.KgFinestra.push(this.AugKg);
                  this.KgFinestra.push(this.SepKg);
                  this.KgFinestra.push(this.OctKg);
                  this.KgFinestra.push(this.NovKg);


                  }

                  if(month == 'Dec'){
                    this.incassiFinestra.push(this.SepIncassi);
                    this.incassiFinestra.push(this.OctIncassi);
                    this.incassiFinestra.push(this.NovIncassi);
                    this.incassiFinestra.push(this.DecIncassi);

                    this.KgFinestra.push(this.SepKg);
                    this.KgFinestra.push(this.OctKg);
                    this.KgFinestra.push(this.NovKg);
                    this.KgFinestra.push(this.DecKg);


                    }
}

  async getAllPrezzi(){
    var i : number = 0;

  await new Promise<void> ((resolve, reject) => {
  this.viaggioService.getAll().subscribe(async viaggi =>{
    this.nOfferte = viaggi.length;

    await new Promise<void> ((resolve, reject) => {
    for (const viaggio of viaggi) {
      this.allPrezzi.push(viaggio.costoPerKm);
      i = i + 1;

              //ordinamento
              this.allPrezzi.sort((v1,v2) => {
                if (v1 > v2) {
                    return 1;
                }

                if (v1 < v2) {
                    return -1;
                }

                return 0;
              });

        resolve();
    }

    for(var j = 0; j<this.allPrezzi.length; j++){
      this.prezziBubble.push([j,this.allPrezzi[j],this.allPrezzi[j]]);
    }

  });
  });
  resolve();
  });

}

aggiornaConteggio( nation : string) {


    if(nation == 'Italy'){
      this.italiaCount = this.italiaCount + 1;
    }

      if(nation == 'France')
      this.franciaCount = this.franciaCount + 1;

      if(nation == 'Russia')
      this.russiaCount = this.russiaCount + 1;

      if(nation == 'United Kingdom')
      this.regnoUnitoCount = this.regnoUnitoCount + 1;

      if(nation == 'United States of America')
      this.usaCount = this.usaCount + 1;

      if(nation == 'Spain')
      this.spagnaCount = this.spagnaCount + 1;

      if(nation == 'China')
      this.cinaCount = this.cinaCount + 1;

      if(nation == 'India')
      this.indiaCount = this.indiaCount + 1;


      if(nation == 'Greece')
      this.greciaCount = this.greciaCount + 1;


      if(nation == 'Canada')
      this.canadaCount = this.canadaCount + 1;


      if(nation == 'Germany')
      this.germaniaCount = this.germaniaCount + 1;


      if(nation == 'Japan')
      this.giapponeCount = this.giapponeCount + 1;

      if(nation == 'Switzerland')
      this.svizzeraCount = this.svizzeraCount + 1;


      if(nation == 'Portugal')
      this.portogalloCount = this.portogalloCount + 1;


}

  async search(){
    this.spinnerService.show();
    this.KgRicerca = 0;
    this.soldiRicerca = 0;
    this.offerteRicerca = 0;
    this.bookingsRicerca = 0;
    this.subscribersRicerca = 0;
    this.percentuali = [];
    this.fatturati = [];

    this.nationsCount = [] ;

    this.italiaCount  = 0;
    this.russiaCount  = 0;
    this.franciaCount  = 0;
    this.usaCount  = 0;
    this.regnoUnitoCount  = 0;
    this.spagnaCount  = 0;
    this.indiaCount  = 0;
    this.canadaCount  = 0;
    this.cinaCount  = 0;
    this.giapponeCount  = 0;
    this.greciaCount  = 0;
    this.svizzeraCount  = 0;
    this.germaniaCount  = 0;
    this.portogalloCount  = 0;

  this.searchView = true;

  await new Promise<void> ((resolve, reject) => {
  this.bookingService.getAll().subscribe(async all =>{

    await new Promise<void> (async (resolve, reject) => {
    for (const booking of all) {
      var date : Date = new Date(booking.prenotationDate);
      if(date >= this.ricerca.dateStart && date <= this.ricerca.dateEnd ){
        this.bookingsRicerca = this.bookingsRicerca + 1;
        this.KgRicerca = this.KgRicerca + booking.bookedCapacity;

        await new Promise<void> ((resolve, reject) => {
        this.viaggioRouteService.getById(booking.viaggioRouteId).subscribe(async viaggioRoute => {

          await new Promise<void> ((resolve, reject) => {
          this.routeService.getById(viaggioRoute.routeId).subscribe(async route => {

            var costoPerKm : number  = 0;
            await new Promise<void> ((resolve, reject) => {
            this.viaggioService.getById(viaggioRoute.viaggioId).subscribe(viaggio => {
              costoPerKm = viaggio.costoPerKm;
              resolve();
            });
          });

            this.soldiRicerca = this.soldiRicerca + (route.distanceKm * costoPerKm)
            resolve();
          });
        }),

          resolve();
        });
      });
      }
      resolve();
    }
  });
    resolve();
  });
  });

  this.userService.getAll().subscribe(all =>{
    for (const user of all) {
      if(user.type == 'company'){
        this.companyService.getById(user.id).subscribe(company => {
          var date : Date = new Date(company.abilitationDate);
          if(date <= this.ricerca.dateEnd && date >= this.ricerca.dateStart ){
            this.subscribersRicerca = this.subscribersRicerca + 1;
          }
        })
      }
      if(user.type == 'affittuario'){
        this.affittuarioService.getById(user.id).subscribe(affittuario => {
          var date : Date = new Date(affittuario.abilitationDate);
          if(date <= this.ricerca.dateEnd && date >= this.ricerca.dateStart ){
            this.subscribersRicerca = this.subscribersRicerca + 1;
          }
        })
      }

    }
  });

  this.viaggioService.getAll().subscribe(all =>{
    for (const viaggio of all) {
      this.viaggioRouteService.getByViaggioId(viaggio.id).subscribe(viaggioRoutes =>{
        var date2 : Date = new Date(viaggioRoutes[viaggioRoutes.length - 1].endDate);
        if(date2 <= this.ricerca.dateEnd && date2 >= this.ricerca.dateStart){
          this.offerteRicerca = this.offerteRicerca + 1;
        }
      })

    }
  });

  await new Promise<void> ((resolve, reject) => {
    this.bookingService.getAll().subscribe(async data =>{
      this.bookings = data;

      await new Promise<void> (async (resolve, reject) => {
        for  await (const booking of data) {
          await new Promise<void> ((resolve, reject) => {
          this.viaggioRouteService.getById(booking.viaggioRouteId).subscribe(async viaggioRoute =>{

            var date3 : Date = new Date(viaggioRoute.endDate);
            if(date3 >= this.ricerca.dateStart && date3 <= this.ricerca.dateEnd){
            var costo : number;
            var distance : number;
            var prezzo : number;
            var companyName : string;

            await new Promise<void> ((resolve, reject) => {

            this.viaggioService.getById(viaggioRoute.viaggioId).subscribe(async viaggio=>{
                costo = viaggio.costoPerKm;
                await new Promise<void> ((resolve, reject) => {

                this.companyService.getById(viaggio.companyId).subscribe(company=>{
                  companyName = company.name
                  resolve();
                })
              })


                resolve();
            });
          });

          await new Promise<void> ((resolve, reject) => {

            this.routeService.getById(viaggioRoute.routeId).subscribe(route=>{
                distance = route.distanceKm;
                 prezzo = distance * costo;
                var fatturato : Fatturato = {} as Fatturato;
                fatturato.companyName = companyName;
                fatturato.fatturato = Number(prezzo.toFixed(1));
                var yetPresent : boolean = false;
                for(var i = 0; i<this.fatturati.length;i++){
                  if(this.fatturati[i].companyName == fatturato.companyName){
                  yetPresent = true;
                  this.fatturati[i].fatturato = this.fatturati[i].fatturato + fatturato.fatturato;
                }
                }
                if(!yetPresent)
                  this.fatturati.push(fatturato);
                  resolve();
            });
          });
            resolve();
            }
            else{
              resolve();
            }
          });

        });
          resolve();
        }
        console.log("fatturato")
        console.log(this.fatturati)
        for(var i = 0; i< this.fatturati.length;i ++){

          var percFatt : PercentualeFatturato  = {} as PercentualeFatturato;

          percFatt.name = this.fatturati[i].companyName;
          percFatt.y = Number(((this.fatturati[i].fatturato / this.incassiTotali) * 100).toFixed(1));

          this.percentuali.push(percFatt);

        }
      });

      resolve();
    });
  });

  await new Promise<void> ((resolve, reject) => {
    this.viaggioRouteService.getAll().subscribe(async allList =>{
      await new Promise<void> (async (resolve, reject) => {
        for (const viaggioRoute of allList) {
          var date4 : Date = new Date(viaggioRoute.endDate);

          if(date4 <= this.ricerca.dateEnd && this.ricerca.dateStart){


          await new Promise<void> ((resolve, reject) => {
          this.routeService.getById(viaggioRoute.routeId).subscribe(async rotta =>{

            await new Promise<void> ((resolve, reject) => {
            this.routeService.getCoordinates(rotta.endCity).subscribe( (result : any) =>{

              var toAdd : boolean = true;
              var nation : string = result.features[0].context[result.features[0].context.length - 1].text;

              for(var i = 0; i<this.nationsCount.length; i++){
                if(this.nationsCount[i].nation == nation){
                  toAdd = false;
                  this.nationsCount[i].conteggio = this.nationsCount[i].conteggio + 1;
                }
              }

              var countToAdd : NazioneConteggio = {} as NazioneConteggio;
                  countToAdd.nation = nation;
                  countToAdd.conteggio = 1;

            if(toAdd)
              this.nationsCount.push(countToAdd);

              this.aggiornaConteggio(countToAdd.nation)

              resolve();
            });
            })
            resolve();
          })

          resolve();

          });
        }
        }
      });
    });
    resolve();
  });

  setTimeout(()=>{
    this.mapOptions = {
      chart: {
        map: worldMap,
        heigth : 700,
        width: 700
        },
      title: {
        text: 'MAP WORLD'
      },

      subtitle: {
        text:
        'Trend of world country in witch we deliver'
      },
      mapNavigation: {
        enabled: true,
        buttonOptions: {
          verticalAlign: 'bottom'
      }
      },
      legend: {
        enabled: true
      },
      colorAxis: {
        min: 0
      },

      xAxis: {
        visible: false,

    },

    yAxis: {
        visible: false,

    },

      series: [
        {
          type: "map",
          name: 'Deliveries in',
          color: '#FF0000',
          states: {

            hover: {
              color: '#FF0000',
            }
          },
          dataLabels: {
            format: "{point.name}"
          },
          allAreas: true,
          data:
          [
            ['it', this.italiaCount],
            ['ru', this.russiaCount],
            ['fr', this.franciaCount],
            ['us', this.usaCount],
            ['gb', this.regnoUnitoCount],
            ['es', this.spagnaCount],
            ['in', this.indiaCount],
            ['ca', this.canadaCount],
            ['cn', this.cinaCount],
            ['jp', this.giapponeCount],
            ['gr', this.greciaCount],
            ['ch', this.svizzeraCount],
            ['de', this.germaniaCount],
            ['pt', this.portogalloCount]
          ]
        }
      ]
    };

    this.pieOptions = {
      chart: {
          type: 'pie',

          options3d: {
              enabled: true,
              alpha: 45,
              beta: 0
          }
      },
      title: {
          text: 'Consumer\'s spending distribution'
      },
      accessibility: {
          point: {
              valueSuffix: '%'
          }
      },
      tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
          pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              depth: 35,
              dataLabels: {
                  enabled: true,
                  format: '{point.name} : {point.percentage:.1f}%'
              }
          }
      },
      series:
      [{
          type: 'pie',
          name: 'Percentage',
          data:  this.percentuali
      }],

    }
  },2000);

  setTimeout(()=>{this.spinnerService.hide();},2000)

}

recharge(){
  window.location.reload();
}
}
