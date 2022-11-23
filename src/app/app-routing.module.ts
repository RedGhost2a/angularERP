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
import {EntrepriseListComponent} from "./parametres/entreprise-list/entreprise-list.component";
import {EntrepriseEditComponent} from "./parametres/entreprise-edit/entreprise-edit.component";
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./_helpers";
import {UserComponent} from "./parametres/user/user.component";
import {SuperAdminComponent} from "./super-admin/super-admin.component";
import {Role} from "./_models/role";

const routes: Routes = [
  {path: 'dashboard', canActivate: [AuthGuard], component: DashboardComponent, data: {title: 'Dashboard'}},

  {path: 'clients', canActivate: [AuthGuard], component: ListClientComponent, data: {title: 'Liste des clients'}},
  {path: 'clients/new', component: EditComponent, data: {title: 'Creation des clients'}},
  {path: 'clients/:id', component: EditComponent, data: {title: 'Details du clients'}},
  {path: 'clients/:id', component: ClientsComponent, data: {title: 'Details du clients'}},
  /*
    {path: 'clients/detail/:id', component: UserComponent, data: {title: 'Detail des utilisateurs'}},
  */

  {path: 'users', canActivate: [AuthGuard], component: UserListComponent, data: {title: 'Liste des utilisateurs'}},
  {path: 'users/new', canActivate: [AuthGuard], component: UserEditComponent, data: {roles: [Role.SuperAdmin]}},
  {path: 'users/:id', component: UserEditComponent, data: {title: 'Detail des utilisateurs'}},
  {path: 'mon_profile', canActivate: [AuthGuard], component: UserComponent, data: {title: 'Profil utilisateurs'}},

  {
    path: 'entreprises',
    canActivate: [AuthGuard],
    component: EntrepriseListComponent,
    data: {title: 'Liste des entreprise'}
  },
  {
    path: 'entreprises/new',
    canActivate: [AuthGuard],
    data: {roles: [Role.SuperAdmin], title: 'Création des entreprises'},
    component: EntrepriseEditComponent,
  },
  {path: 'entreprises/:id', component: EntrepriseEditComponent, data: {title: 'Detail des entreprises'}},

  {path: 'devis', canActivate: [AuthGuard], component: DevisComponent, data: {title: 'Devis'}},
  {
    path: 'bibliotheque',
    canActivate: [AuthGuard],
    component: BibliothequesComponent,
    data: {title: 'Bibiothèque de prix'}
  },
  {path: 'parametre', canActivate: [AuthGuard], component: ParametresComponent, data: {title: 'Paramètres'}},
  {
    path: 'admin', canActivate: [AuthGuard], component: SuperAdminComponent, data: {roles: [Role.SuperAdmin]}
  },

  {path: 'login', component: LoginComponent},

  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
