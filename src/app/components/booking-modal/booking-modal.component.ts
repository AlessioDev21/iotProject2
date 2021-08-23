import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { ViaggioInfo } from '../../models/viaggio-info';
import { Route } from 'src/app/models/route';
import { AffittuarioPrenotaViaggioRoute } from 'src/app/models/affittuario-prenota-viaggio-route';
import { AffituarioPrenotaRouteService } from 'src/app/services/affituario-prenota-route.service';
import { Affittuario } from 'src/app/models/affittuario';
import { ViaggioRouteService } from 'src/app/services/viaggio-route.service';
import { Router } from '@angular/router';
import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';



@Component({
  selector: 'app-booking-modal',
  templateUrl: './booking-modal.component.html',
  styleUrls: ['./booking-modal.component.scss']
})




export class BookingModalComponent implements OnInit {

  @ViewChild('Form')bookingForm:any;

  travelSelected: ViaggioInfo={} as ViaggioInfo
  routeSelected: Route={} as Route;
  requiredCapacity: number=-1;
  affittuario: Affittuario={} as Affittuario;
  startRoute: any;
  endRoute: any;
  cancellPrenotationDate:any;
  bookingPrenotationDate:any;


  constructor(public dialogRef: MatDialogRef<BookingModalComponent>,private router: Router,private matDialog : MatDialog,
    private bookingService: AffituarioPrenotaRouteService, private viaggioRouteService: ViaggioRouteService) { }

  ngOnInit(): void {
    this.affittuario=JSON.parse(String(localStorage.getItem('loggedUser')));
    this.travelSelected=JSON.parse(String(localStorage.getItem('viaggioSelected')));
    this.routeSelected=JSON.parse(String(localStorage.getItem('routeSelected')));
    console.log(this.travelSelected)
    for(let i=0; i<this.travelSelected.viaggioRouteInfo.length;i++){
      if(this.travelSelected.viaggioRouteInfo[i].routeId == this.routeSelected.id){
        this.startRoute=this.travelSelected.viaggioRouteInfo[i].startDate;
        this.endRoute=this.travelSelected.viaggioRouteInfo[i].endDate;
        this.cancellPrenotationDate=this.travelSelected.viaggioRouteInfo[i].maximumWithdrawal;
        this.bookingPrenotationDate=this.travelSelected.viaggioRouteInfo[i].maximumBookingDate;
        break;
      }
    }

  }

  closeModal() {
    this.dialogRef.close();
  }


  book(){

    if(this.requiredCapacity > 0 ){
      for(let i=0; i<this.travelSelected.viaggioRouteInfo.length;i++){
        // seleziono la particolare tupla
        if(this.travelSelected.viaggioRouteInfo[i].routeId==this.routeSelected.id){
          //se hai trovato la rotta vedi se c'è possibilità e se la puoi prenotare
          if( this.travelSelected.viaggioRouteInfo[i].availableCapacity >= this.requiredCapacity){
            if (new Date(this.travelSelected.viaggioRouteInfo[i].startDate ) > new Date()){
              //vedi se la puoi prenotare con la bookingDate
              if(new Date(this.travelSelected.viaggioRouteInfo[i].maximumBookingDate) > new Date() ){
                let toBook: AffittuarioPrenotaViaggioRoute={} as AffittuarioPrenotaViaggioRoute;
                toBook.affittuarioId=this.affittuario.id;
                let today=new Date();
                toBook.prenotationDate= new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(),
                 today.getHours(), today.getMinutes(), today.getSeconds() ))
                console.log("prenotazione data"+ toBook.prenotationDate)
                toBook.viaggioRouteId=this.travelSelected.viaggioRouteInfo[i].id;
                toBook.bookedCapacity=this.requiredCapacity;
                this.bookingService.alreadyBooked(toBook.affittuarioId, toBook.viaggioRouteId).toPromise().then(
                  getted=>{
                  this.openModal("You already booked this route !")
                  }
                ).catch(err=>{
                  this.bookingService.saveBooking(toBook).toPromise().then(saved=>{console.log(saved)
                    this.viaggioRouteService.updateCapacity(this.travelSelected.viaggioRouteInfo[i].availableCapacity-this.requiredCapacity,
                      this.travelSelected.viaggioRouteInfo[i].id).toPromise().then(ok=>{console.log(ok)
                       this.closeModal();
                      this.openModal("Booking correctly done !")
                      })

                  })
                  // aggiorniamo quantità


                })
              }
              else {
                this.closeModal();
                this.openModal("Max booking date already reached")
              }
              }
            else{
              this.closeModal();
              this.openModal("Can't complete booking, route has  begun")

            }
          }
          else{
            this.closeModal();
            this.openModal ("Unsufficied capacity for satisfied the request");
          }
            // vedere se di quella tupla la rotta NON è ancora iniziata


        }
      }
    }
    else { this.openModal("Insert a capacity to book");}
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


}
