import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ClientsComponent} from "./clients/clients.component";
import {EditComponent} from "./clients/edit/edit.component";
import {SidenavComponent} from "./sidenav/sidenav.component";

const routes: Routes = [
  {path:'clients',component: ClientsComponent, data: { title: 'Liste des clients' }},
  {path:'clients/:id',component: EditComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
