import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EditComponent} from "./clients/edit/edit.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
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
import {DetailOuvrageComponent} from "./detail-ouvrage/detail-ouvrage.component";
import {ListOuvrageComponent} from "./list-ouvrage/list-ouvrage.component";
import {ListCoutComponent} from "./list-cout/list-cout.component";
import {OuvrageAddCoutComponent} from "./ouvrage-add-cout/ouvrage-add-cout.component";
import {ListFournisseurComponent} from "./list-fournisseur/list-fournisseur.component";
import {ListTypeCoutComponent} from "./list-type-cout/list-type-cout.component";
import {EditDevisComponent} from "./devis/edit-devis/edit-devis.component";
import {ListDevisComponent} from "./devis/list-devis/list-devis.component";
import {FormComponent} from "./form/form.component";
import {SuperAdminListComponent} from "./super-admin-list/super-admin-list.component";
import {HomeComponent} from "./home/home.component";
import {DetailDevisComponent} from "./detail-devis/detail-devis.component";
import {CreateDevisComponent} from "./create-devis/create-devis.component";
import {SousDetailPrixComponent} from "./sous-detail-prix/sous-detail-prix.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {title: 'Home',}
  },
  // {path: 'notes', component: NotesComponent},

  // {path: 'cout/:id', component: FormCoutComponent},
  // {path: 'cout',  component: FormCoutComponent,},
  // {path: 'ouvrage/:id', component: FormOuvrageComponent,},
  // {path: 'ouvrage',  component: FormOuvrageComponent,},
  {path: 'ouvrageDetail/:id', component: DetailOuvrageComponent,},
  {path: 'listCout', component: ListCoutComponent},
  {path: 'listOuvrage', component: ListOuvrageComponent},
  {path: 'ajoutCout/:id', component: OuvrageAddCoutComponent},
  {path: 'listFournisseur', component: ListFournisseurComponent},
  // {path:'fournisseur',component:FormFournisseurComponent},
  // {path:'fournisseur/:id',component:FormFournisseurComponent},
  {path: 'listTypeCout', component: ListTypeCoutComponent},
  // {path:'typeCout',component:FormTypeCoutComponent},
  // {path:'typeCout/:id',component:FormTypeCoutComponent},


  {path: 'cout', component: FormComponent},
  {path: 'cout/:id', component: FormComponent},
  {path: 'fournisseur', component: FormComponent},
  {path: 'fournisseur/:id', component: FormComponent},
  {path: 'typeCout', component: FormComponent},
  {path: 'typeCout/:id', component: FormComponent},
  {path: 'ouvrage', component: FormComponent},
  {path: 'ouvrage/:id', component: FormComponent},
  {path: 'devisDetail/:id', component: DetailDevisComponent},
  {path: 'devisCreate/:id', component: CreateDevisComponent},


  {path: 'dashboard', canActivate: [AuthGuard], component: DashboardComponent, data: {title: 'Dashboard'}},

  {path: 'clients', component: ListClientComponent, data: {title: 'Liste des clients'}},
  {path: 'clients/new', component: EditComponent, data: {title: 'Creation des clients'}},
  {path: 'clients/:id', component: EditComponent, data: {title: 'Details du clients'}},
  {path: 'clients/:id', component: ClientsComponent, data: {title: 'Details du clients'}},
  /*
    {path: 'clients/detail/:id', component: UserComponent, data: {title: 'Detail des utilisateurs'}},
  */

  {
    path: 'users',

    component: UserListComponent,
    data: {title: 'Liste des utilisateurs', roles: [Role.SuperAdmin, Role.Admin]}
  },
  {
    path: 'users/new',
    // canActivate: [AuthGuard],
    component: UserEditComponent,
    data: {title: 'Création des utilisateurs', roles: [Role.SuperAdmin, Role.Admin]}
  },
  {
    path: 'users/:id',

    component: UserEditComponent,
    data: {title: 'Detail des utilisateurs', roles: [Role.SuperAdmin, Role.Admin]}
  },
  {path: 'mon_profile', canActivate: [AuthGuard], component: UserComponent, data: {title: 'Profil utilisateurs'}},

  {
    path: 'entreprises',

    component: EntrepriseListComponent,
    data: {title: 'Liste des entreprise'}
  },
  {
    path: 'entreprises/new',

    data: {roles: [Role.SuperAdmin], title: 'Création des entreprises'},
    component: EntrepriseEditComponent,
  },
  {
    path: 'entreprises/:id',

    component: EntrepriseEditComponent,
    data: {roles: [Role.SuperAdmin], title: 'Détails des entreprises'}
  },

  {path: 'devis', component: ListDevisComponent, data: {title: 'Liste des devis'}},
  {path: 'devis/new', component: EditDevisComponent, data: {title: 'Devis'}},
  {path: 'devis/:id', component: EditDevisComponent, data: {title: 'Devis'}},
  {path: 'sousDetailPrix/:id', component: SousDetailPrixComponent, data: {title: 'Sous détail de prix'}},

  {
    path: 'bibliotheque',

    component: BibliothequesComponent,
    data: {title: 'Bibiothèque de prix'}
  },
  {path: 'parametre', component: ParametresComponent, data: {title: 'Paramètres'}},
  {
    path: 'admin', component: SuperAdminComponent, data: {roles: [Role.SuperAdmin]}
  },
  {
    path: 'admin/entreprise/:id',
    component: SuperAdminListComponent,
    data: {title: 'Administration',}
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
