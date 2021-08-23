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
import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
import { FormControl } from '@angular/forms';
const _MS_PER_DAY = 1000 * 60 * 60 * 24;
import 'moment/locale/it';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';


@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  providers:[
    {provide: MAT_DATE_LOCALE, useValue: 'it'}
  ]
})
export class HistoryComponent implements OnInit {
  allViaggioInfo: ViaggioInfo[]=[];
  loggedUser: Affittuario={} as Affittuario;
  filterDate: any;


  constructor( private viaggioService: ViaggioService, private routeService: RouteService,
    private viaggioRouteService: ViaggioRouteService,private spinnerService : NgxSpinnerService,
     private companyService: CompanyService,private matDialog : MatDialog,
     private vectorService: VectorService, private affBookRoute: AffituarioPrenotaRouteService) {
     }

  ngOnInit(): void {
    this.loggedUser=JSON.parse(String(localStorage.getItem('loggedUser')));
    this.loadViaggioInfo();
    this.spinnerService.show();
    setTimeout(() => {
      /** spinner ends after 1500 milliseconds */
     this.spinnerService.hide()
     console.log(this.allViaggioInfo);
    }, 1500);
    setTimeout(()=>{
      this.allViaggioInfo.sort((x, y) =>- +new Date(x.prenotationDate)+  +new Date(y.prenotationDate));
    },1000)

  }

  applyFilter(){
    if(this.filterDate==null){this.reset();}
    else{
      this.allViaggioInfo=[];
      this.loadViaggioInfo();
      this.spinnerService.show();
      setTimeout(()=>{
        let filterAllViaggioInfo: ViaggioInfo[]=[];
      this.allViaggioInfo.forEach(element => {
        let d1= new Date(element.prenotationDate);

        let d2= new Date(Date.UTC(this.filterDate.getFullYear(), this.filterDate.getMonth(), this.filterDate.getDate(),
        this.filterDate.getHours(), this.filterDate.getMinutes(), this.filterDate.getSeconds() ))

        if(d1 <d2){
          filterAllViaggioInfo.push(element);
        }
      });
      this.allViaggioInfo=filterAllViaggioInfo;
      this.allViaggioInfo.sort((x, y) =>- +new Date(x.prenotationDate)+  +new Date(y.prenotationDate));
      this.spinnerService.hide()


      },1000)
    }
  }

 dateDiffInDays(dat:any) {
    // Discard the time and time-zone information.
    if(dat == null){return false;}
    const now=new Date();
    const maxWithDrawl=new Date(dat);
    if(now < maxWithDrawl)return true;
    else return false;

  }


  deleteBooking( item: ViaggioInfo){

    this.spinnerService.show();

    this.affBookRoute.deleteBooking(item.bookingId).toPromise().then(
      deleted=>{console.log(deleted);
        this.viaggioRouteService.updateCapacity(item.avaibleCapacityViaggio+item.bookedCapacity,item.idViaggio_Route).toPromise().then(
          fatto=>{
            console.log(fatto)
            this.spinnerService.hide();
            this.openModal("Your cancellation request has been realized");
          }
        )
    }
    )


  }

  openModal(modalText: string) {

    localStorage.setItem('ModalText', JSON.stringify(modalText));
     const dialogConfig = new MatDialogConfig();
     // The user can't close the dialog by clicking outside its body
     dialogConfig.disableClose = true;
     dialogConfig.height = "160px";
     dialogConfig.width = "550px";
     // https://material.angular.io/components/dialog/overview
     const modalDialog = this.matDialog.open(ModalConfirmComponent, dialogConfig);
   }

  loadViaggioInfo(){

    this.affBookRoute.getByAffittuario(this.loggedUser.id).toPromise().then(
      bookingList=>{
        // for each travels , get :
        // all routes, the company, the vector of that travel
        for (let i=0 ; i< bookingList.length;i++){
          let viaggioInfo: ViaggioInfo={} as ViaggioInfo;
          viaggioInfo.idViaggio_Route=bookingList[i].viaggioRouteId;
          viaggioInfo.bookedCapacity=bookingList[i].bookedCapacity;
          viaggioInfo.bookingId=bookingList[i].id;
          viaggioInfo.prenotationDate=bookingList[i].prenotationDate;
          this.viaggioRouteService.getById(bookingList[i].viaggioRouteId).toPromise().then(
            viaggioRoutes=>{
              viaggioInfo.avaibleCapacityViaggio=viaggioRoutes.availableCapacity;
              viaggioInfo.maximum_WithDrawl=viaggioRoutes.maximumWithdrawal;
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

  reset(){
    this.allViaggioInfo=[];
    this.loadViaggioInfo();
    this.spinnerService.show();
    setTimeout(()=>{
      this.spinnerService.hide()

      this.allViaggioInfo.sort((x, y) =>- +new Date(x.prenotationDate)+  +new Date(y.prenotationDate));
    },1000)
    this.filterDate = null;
  }

}
