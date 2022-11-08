import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EditComponent} from "./clients/edit/edit.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {DevisComponent} from "./devis/devis.component";
import {ParametresComponent} from "./parametres/parametres.component";
import {BibliothequesComponent} from "./bibliotheques/bibliotheques.component";
import {ListClientComponent} from "./clients/list-client/list-client.component";
import {UserListComponent} from "./parametres/user-list/user-list.component";
import {UserEditComponent} from "./parametres/user-edit/user-edit.component";
import {ClientsComponent} from "./clients/clients.component";

const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent, data: {title: 'Dashboard'}},

  {path: 'clients', component: ListClientComponent, data: {title: 'Liste des clients'}},
  {path: 'clients/new', component: EditComponent, data: {title: 'Creation des clients'}},
  {path: 'clients/:id', component: EditComponent, data: {title: 'Details du clients'}},
  {path: 'clients/:id', component: ClientsComponent, data: {title: 'Details du clients'}},
  /*
    {path: 'clients/detail/:id', component: UserComponent, data: {title: 'Detail des utilisateurs'}},
  */

  {path: 'users', component: UserListComponent, data: {title: 'Liste des utilisateurs'}},
  {path: 'users/new', component: UserEditComponent, data: {title: 'Création utilisateurs'}},
  {path: 'users/:id', component: UserEditComponent, data: {title: 'Detail des utilisateurs'}},


  {path: 'devis', component: DevisComponent, data: {title: 'Devis'}},
  {path: 'bibliotheque', component: BibliothequesComponent, data: {title: 'Bibiothèque de prix'}},
  {path: 'parametre', component: ParametresComponent, data: {title: 'Paramètres'}}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
