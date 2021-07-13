import { PendingRegistrationComponent } from './components/pending-registrations/pending-registrations.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ModalComponent } from './components/modal/modal.component';
import { MyVectorsComponent } from './components/my-vectors/my-vectors.component';

const routes: Routes = [
  {path: '',component:LoginComponent},
  //{path: 'errors', component:NotFound404Component},
  {path :'login', component:LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'admin/pendingRegistration', component : PendingRegistrationComponent},
  {path: 'modal', component : ModalComponent},
  {path: 'myVectors/:id', component : MyVectorsComponent}



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
