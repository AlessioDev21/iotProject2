import { Component, OnInit } from '@angular/core';
import { RouteService } from 'src/app/services/route.service';
import { ViaggioService } from 'src/app/services/viaggio.service';
import { Vector } from '../../models/vector';
import { User } from '../../models/user';
import { Route } from 'src/app/models/route';
import { VectorService } from 'src/app/services/vector.service';
import { UserService } from 'src/app/services/user.service';
import { CompanyVectorService } from 'src/app/services/company-vector.service';
import { ViaggioInfo } from 'src/app/models/viaggio-info';
import { ViaggioRouteService } from 'src/app/services/viaggio-route.service';
import { Company } from '../../models/company';
import { CompanyService } from 'src/app/services/company.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BookingModalComponent } from '../booking-modal/booking-modal.component';
import { ScheduleComponent } from '../schedule/schedule.component';
import { ViaggioRoute } from '../../models/viaggio-route';
import { NgxSpinnerService } from 'ngx-spinner';
import { AffittuarioPrenotaViaggioRoute } from 'src/app/models/affittuario-prenota-viaggio-route';
import { AffituarioPrenotaRouteService } from 'src/app/services/affituario-prenota-route.service';
import { Affittuario } from '../../models/affittuario';
import {Chart} from 'chart.js';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-affittuario-analitics',
  templateUrl: './affittuario-analitics.component.html',
  styleUrls: ['./affittuario-analitics.component.scss']
})
export class AffittuarioAnaliticsComponent implements OnInit {

  allViaggioInfo: ViaggioInfo[]=[];
  loggedUser: Affittuario={} as Affittuario;
  dataRouteChart: Route[]=[];
  result:any[]=[];
  numberChartRoute: number[]=[];

  dataVectorChart: Vector[]=[];
  numberChartVector:number[]=[];
  resultVector:any[]=[];

   doughnutChartLabelsRoute: string[]=[];
    doughnutChartDataRoute: number[] = []
   donutColorsRoute = [
    {
      backgroundColor: [
       ''
      ]
    }];
    doughnutChartLabelsVector: string[]=[];
    doughnutChartDataVector: number[] = []
   donutColorsVector = [
    {
      backgroundColor: [
       ''
      ],}];

    data:number[]=[0,0,0,0,0,0,0,0,0,0,0,0];
    filterYear:number=new Date().getFullYear();


    lineChartData: ChartDataSets[] = [
      { data:this.data, label: 'Booking trend of '+this.filterYear+' ' }
    ];
    lineChartLabels: Label[] = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'Dicember'
    ];

    lineChartColors: Color[] = [
      {
        borderColor: '#5677fc',
        pointHoverBorderWidth:40,
        pointBorderWidth:1,


      }
    ];
    show=false;
    // line cahrt cost
    dataCost:number[]=[0,0,0,0,0,0,0,0,0,0,0,0];

    lineChartDataCost: ChartDataSets[] = [
      { data:this.dataCost, label: 'Cost incurred in $ ' }
    ];


    lineChartColorsCost: Color[] = [
      {
        borderColor: '#e51c23',
        pointHoverBorderWidth:40,
        pointBorderWidth:1,
      }
    ];


    show2=false;


  constructor(private viaggioService: ViaggioService, private routeService: RouteService,
    private viaggioRouteService: ViaggioRouteService,private spinnerService : NgxSpinnerService,
     private companyService: CompanyService,private matDialog : MatDialog,
     private vectorService: VectorService, private affBookRoute: AffituarioPrenotaRouteService) {

      }

  ngOnInit(): void {
    this.loggedUser=JSON.parse(String(localStorage.getItem('loggedUser')));
    this.loadViaggioInfo();
    setTimeout(()=>{ this.buildDataForChart(this.filterYear);},1200);
    this.spinnerService.show();
    setTimeout(() => {
      /** spinner ends after 1500 milliseconds */
     this.spinnerService.hide()
    }, 1800);
  }

  applyFilter(){
    this.data=[0,0,0,0,0,0,0,0,0,0,0,0];
    this.dataCost=[0,0,0,0,0,0,0,0,0,0,0,0];
    let year=this.filterYear;
    for(let i=0; i<this.allViaggioInfo.length;i++){
      let d1=new Date(this.allViaggioInfo[i].prenotationDate);
      if(d1.getFullYear()==year && d1.getMonth()==0){
        this.data[0]++;
      }
      if(d1.getFullYear()==year && d1.getMonth()==1){
        this.data[1]++;
      }
      if(d1.getFullYear()==year && d1.getMonth()==2){
        this.data[2]++;
      }
      if(d1.getFullYear()==year && d1.getMonth()==3){
        this.data[3]++;
      }
      if(d1.getFullYear()==year && d1.getMonth()==4){
        this.data[4]++;
      }

      if(d1.getFullYear()==year && d1.getMonth()==5){
        this.data[5]++;
      }
      if(d1.getFullYear()==year && d1.getMonth()==6){
        this.data[6]++
      }
      if(d1.getFullYear()==year && d1.getMonth()==7){
        this.data[7]++;
      }
      if(d1.getFullYear()==year && d1.getMonth()==8){
        this.data[8]++;
      }
      if(d1.getFullYear()==year && d1.getMonth()==9){
        this.data[9]++;
      }
      if(d1.getFullYear()==year && d1.getMonth()==10){
        this.data[10]++;
      }
      if(d1.getFullYear()==year && d1.getMonth()==11){
        this.data[11]++;
      }
    }
    this.lineChartData[0].data=this.data;
    this.lineChartData[0].label='Booking trend of '+this.filterYear
    //////////////////////////////
      //code for cost chart
    for (let i=0; i< this.allViaggioInfo.length;i++){
        let d1=new Date(this.allViaggioInfo[i].prenotationDate);
        if(d1.getFullYear()==year && d1.getMonth()==0){
          //january
          this.dataCost[0]+=(this.allViaggioInfo[i].costoKm* this.allViaggioInfo[i].routes[0].distanceKm)
        }
        if(d1.getFullYear()==year && d1.getMonth()==1){
          this.dataCost[1]+=(this.allViaggioInfo[i].costoKm* this.allViaggioInfo[i].routes[0].distanceKm)
        }
        if(d1.getFullYear()==year && d1.getMonth()==2){
          this.dataCost[2]+=(this.allViaggioInfo[i].costoKm* this.allViaggioInfo[i].routes[0].distanceKm)
        }
        if(d1.getFullYear()==year && d1.getMonth()==3){
          this.dataCost[3]+=(this.allViaggioInfo[i].costoKm* this.allViaggioInfo[i].routes[0].distanceKm)

        }
        if(d1.getFullYear()==year && d1.getMonth()==4){
          this.dataCost[4]+=(this.allViaggioInfo[i].costoKm* this.allViaggioInfo[i].routes[0].distanceKm)
        }

        if(d1.getFullYear()==year && d1.getMonth()==5){
          this.dataCost[5]+=(this.allViaggioInfo[i].costoKm* this.allViaggioInfo[i].routes[0].distanceKm)
        }
        if(d1.getFullYear()==year && d1.getMonth()==6){
          this.dataCost[6]+=(this.allViaggioInfo[i].costoKm* this.allViaggioInfo[i].routes[0].distanceKm)
        }
        if(d1.getFullYear()==year && d1.getMonth()==7){
          this.dataCost[7]+=(this.allViaggioInfo[i].costoKm* this.allViaggioInfo[i].routes[0].distanceKm)

        }
        if(d1.getFullYear()==year && d1.getMonth()==8){
          this.dataCost[8]+=(this.allViaggioInfo[i].costoKm* this.allViaggioInfo[i].routes[0].distanceKm)
        }
        if(d1.getFullYear()==year && d1.getMonth()==9){
          this.dataCost[9]+=(this.allViaggioInfo[i].costoKm* this.allViaggioInfo[i].routes[0].distanceKm)
        }
        if(d1.getFullYear()==year && d1.getMonth()==10){
          this.dataCost[10]+=(this.allViaggioInfo[i].costoKm* this.allViaggioInfo[i].routes[0].distanceKm)
        }
        if(d1.getFullYear()==year && d1.getMonth()==11){
          this.dataCost[11]+=(this.allViaggioInfo[i].costoKm* this.allViaggioInfo[i].routes[0].distanceKm)
        }
    }
    for(let i=0;i<this.dataCost.length;i++){
        this.dataCost[i]=Math.round(this.dataCost[i])
    }
    this.lineChartDataCost[0].data=this.dataCost
  }

  loadViaggioInfo(){
    this.affBookRoute.getByAffittuario(this.loggedUser.id).toPromise().then(
      bookingList=>{
        // for each travels , get :
        // all routes, the company, the vector of that travel
        for (let i=0 ; i< bookingList.length;i++){
          let viaggioInfo: ViaggioInfo={} as ViaggioInfo;
          viaggioInfo.bookedCapacity=bookingList[i].bookedCapacity;
          viaggioInfo.bookingId=bookingList[i].id;
          viaggioInfo.prenotationDate=bookingList[i].prenotationDate;
          this.viaggioRouteService.getById(bookingList[i].viaggioRouteId).toPromise().then(
            viaggioRoutes=>{
              viaggioInfo.avaibleCapacityViaggio=viaggioRoutes.availableCapacity;
              viaggioInfo.startDateViaggio=viaggioRoutes.startDate;
              viaggioInfo.endDateViaggio=viaggioRoutes.endDate;
              this.routeService.getById(viaggioRoutes.routeId).toPromise().then(
                route=>{
                  viaggioInfo.routes=[];
                  viaggioInfo.routes.push(route);
                }
              )
              // get vector+company info info
              this.viaggioService.getById(viaggioRoutes.viaggioId).toPromise().then(
                viaggio=>{
                  viaggioInfo.costoKm=viaggio.costoPerKm;
                   this.vectorService.getById(viaggio.vectorId).toPromise().then(
                      vector=>{
                      viaggioInfo.vectorOwnerViaggio=vector;
                    }
                  )
                  this.companyService.getById(viaggio.companyId).toPromise().then(
                    company=>{
                      viaggioInfo.companyOwnerViaggio=company;
                    }
                  )
                }
              )
              this.allViaggioInfo.push(viaggioInfo)
            }
          )
       }
      }
    )
  }

  buildDataForChart(year:number){
    this.dataRouteChart=[];
    this.dataVectorChart=[];
    console.log(this.allViaggioInfo)
    for(let i=0; i<this.allViaggioInfo.length;i++){
        this.dataRouteChart.push(this.allViaggioInfo[i].routes[0])
    }
    this.result = [...this.dataRouteChart.reduce( (mp, o) => {
      if (!mp.has(o.id)) mp.set(o.id, { ...o, count: 0 });
      mp.get(o.id).count++;
      return mp;
  }, new Map).values()];

      console.log(this.result);
    for(let i=0; i< this.result.length;i++){
      this.doughnutChartLabelsRoute[i]=this.result[i].startCity+" "+this.result[i].endCity
      this.doughnutChartDataRoute[i]=this.result[i].count
      this.donutColorsRoute[0].backgroundColor[i]=this.getRandomColor();
    }
    //built for vector analitics
    for(let i=0; i<this.allViaggioInfo.length;i++){
      this.dataVectorChart.push(this.allViaggioInfo[i].vectorOwnerViaggio)
    }
    this.resultVector = [...this.dataVectorChart.reduce( (mp, o) => {
      if (!mp.has(o.id)) mp.set(o.id, { ...o, count: 0 });
      mp.get(o.id).count++;
      return mp;
  }, new Map).values()];
      console.log(this.resultVector);
      for(let i=0; i< this.resultVector.length;i++){
        this.doughnutChartLabelsVector[i]=this.resultVector[i].name+" "+this.resultVector[i].licensePlate;
        this.doughnutChartDataVector[i]=this.resultVector[i].count
        this.donutColorsVector[0].backgroundColor[i]=this.getRandomColor();
      }
      //code for line cahrt
      for(let i=0; i<this.allViaggioInfo.length;i++){
        let d1=new Date(this.allViaggioInfo[i].prenotationDate);
        if(d1.getFullYear()==year && d1.getMonth()==0){
          this.data[0]++;
        }
        if(d1.getFullYear()==year && d1.getMonth()==1){
          this.data[1]++;
        }
        if(d1.getFullYear()==year && d1.getMonth()==2){
          this.data[2]++;
        }
        if(d1.getFullYear()==year && d1.getMonth()==3){
          this.data[3]++;
        }
        if(d1.getFullYear()==year && d1.getMonth()==4){
          this.data[4]++;
        }

        if(d1.getFullYear()==year && d1.getMonth()==5){
          this.data[5]++;
        }
        if(d1.getFullYear()==year && d1.getMonth()==6){
          this.data[6]++
        }
        if(d1.getFullYear()==year && d1.getMonth()==7){
          this.data[7]++;
        }
        if(d1.getFullYear()==year && d1.getMonth()==8){
          this.data[8]++;
        }
        if(d1.getFullYear()==year && d1.getMonth()==9){
          this.data[9]++;
        }
        if(d1.getFullYear()==year && d1.getMonth()==10){
          this.data[10]++;
        }
        if(d1.getFullYear()==year && d1.getMonth()==11){
          this.data[11]++;
        }
      }
      this.show=true;
      console.log(this.data)

      //code for cost chart
      for (let i=0; i< this.allViaggioInfo.length;i++){
        let d1=new Date(this.allViaggioInfo[i].prenotationDate);
        if(d1.getFullYear()==year && d1.getMonth()==0){
          //january
          this.dataCost[0]+=(this.allViaggioInfo[i].costoKm* this.allViaggioInfo[i].routes[0].distanceKm)
        }
        if(d1.getFullYear()==year && d1.getMonth()==1){
          this.dataCost[1]+=(this.allViaggioInfo[i].costoKm* this.allViaggioInfo[i].routes[0].distanceKm)
        }
        if(d1.getFullYear()==year && d1.getMonth()==2){
          this.dataCost[2]+=(this.allViaggioInfo[i].costoKm* this.allViaggioInfo[i].routes[0].distanceKm)
        }
        if(d1.getFullYear()==year && d1.getMonth()==3){
          this.dataCost[3]+=(this.allViaggioInfo[i].costoKm* this.allViaggioInfo[i].routes[0].distanceKm)

        }
        if(d1.getFullYear()==year && d1.getMonth()==4){
          this.dataCost[4]+=(this.allViaggioInfo[i].costoKm* this.allViaggioInfo[i].routes[0].distanceKm)
        }

        if(d1.getFullYear()==year && d1.getMonth()==5){
          this.dataCost[5]+=(this.allViaggioInfo[i].costoKm* this.allViaggioInfo[i].routes[0].distanceKm)
        }
        if(d1.getFullYear()==year && d1.getMonth()==6){
          this.dataCost[6]+=(this.allViaggioInfo[i].costoKm* this.allViaggioInfo[i].routes[0].distanceKm)
        }
        if(d1.getFullYear()==year && d1.getMonth()==7){
          this.dataCost[7]+=(this.allViaggioInfo[i].costoKm* this.allViaggioInfo[i].routes[0].distanceKm)

        }
        if(d1.getFullYear()==year && d1.getMonth()==8){
          this.dataCost[8]+=(this.allViaggioInfo[i].costoKm* this.allViaggioInfo[i].routes[0].distanceKm)
        }
        if(d1.getFullYear()==year && d1.getMonth()==9){
          this.dataCost[9]+=(this.allViaggioInfo[i].costoKm* this.allViaggioInfo[i].routes[0].distanceKm)
        }
        if(d1.getFullYear()==year && d1.getMonth()==10){
          this.dataCost[10]+=(this.allViaggioInfo[i].costoKm* this.allViaggioInfo[i].routes[0].distanceKm)
        }
        if(d1.getFullYear()==year && d1.getMonth()==11){
          this.dataCost[11]+=(this.allViaggioInfo[i].costoKm* this.allViaggioInfo[i].routes[0].distanceKm)
        }
      }
      for(let i=0;i<this.dataCost.length;i++){
        this.dataCost[i]=Math.round(this.dataCost[i])
      }
      this.show2=true
      console.log(this.dataCost)
      ///////////////////////

  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

}
