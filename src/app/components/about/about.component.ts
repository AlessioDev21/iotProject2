import { CompanyService } from './../../services/company.service';
import { Component, OnInit } from '@angular/core';
import { AffituarioPrenotaRouteService } from 'src/app/services/affituario-prenota-route.service';
//comment per prova su githbu
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor( private companyService : CompanyService,
               private bookingService : AffituarioPrenotaRouteService) { }

  nCompanies : number = 0;
  totKg : number = 0;

  ngOnInit(): void {

    this.getAllCompanies();
    this.getKg();
  }

  getAllCompanies(){
    this.companyService.getALL().subscribe(all =>{
      this.nCompanies = all.length;
    })


  }

  async getKg(){
    await new Promise<void> ((resolve, reject) => {

    this.bookingService.getAll().subscribe(async all =>{
      await new Promise<void> ((resolve, reject) => {

      for (const book of all) {

        this.totKg = this.totKg + book.bookedCapacity;

        resolve();
      }
    });
    });
    resolve();

});
  }

  move(valore : number){
    window.scrollTo(0, valore);

  }
}
