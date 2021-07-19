import { PendingRegistrationComponent } from './components/pending-registrations/pending-registrations.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ModalComponent } from './components/modal/modal.component';
import { MyVectorsComponent } from './components/my-vectors/my-vectors.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SummaryModalComponent } from './components/summary-modal/summary-modal.component';
import { AffittuarioHomeComponent } from './components/affittuario-home/affittuario-home.component';
import { ViaggioRouteProgressBarComponent } from './components/viaggio-route-progress-bar/viaggio-route-progress-bar.component';

const routes: Routes = [
  {path: '',component:LoginComponent},
  //{path: 'errors', component:NotFound404Component},
  {path :'login', component:LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'admin/pendingRegistration', component : PendingRegistrationComponent},
  {path: 'modal', component : ModalComponent},
  {path: 'myVectors/:id', component : MyVectorsComponent},
  {path :'signup', component: SignUpComponent},
  {path: 'summary', component: SummaryModalComponent},
  {path: 'viaggioRoute/:id', component: ViaggioRouteProgressBarComponent},
  {path:'affittuarioHome', component: AffittuarioHomeComponent}




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
