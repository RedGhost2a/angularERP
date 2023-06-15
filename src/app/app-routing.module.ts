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
import {LogsComponent} from "./logs/logs.component";
import {FormOuvrageComponent} from "./form-ouvrage/form-ouvrage.component";
import {AideComponent} from "./aide/aide.component";
import {UserService} from "./_service/user.service";
import {ListOuvrageElementaireComponent} from "./list-ouvrage-elementaire/list-ouvrage-elementaire.component";
import {DetailOuvrageElementaireComponent} from "./detail-ouvrage-elementaire/detail-ouvrage-elementaire.component";
import {
  OuvrageElementaireAddCoutComponent
} from "./ouvrage-elementaire-add-cout/ouvrage-elementaire-add-cout.component";
import {
  DetailOuvrageElementaireDuDevisComponent
} from "./detail-ouvrage-elementaire-du-devis/detail-ouvrage-elementaire-du-devis.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {title: 'Home',}
  },
  // {path: 'notes', component: NotesComponent},

  // {path: 'cout/:id', component: FormCoutComponent},
  {path: 'ouvragecss', canActivate: [AuthGuard], component: FormOuvrageComponent,},
  // {path: 'ouvrage/:id', component: FormOuvrageComponent,},
  // {path: 'ouvrage',  component: FormOuvrageComponent,},
  {path: 'ouvrageDetail/:id', canActivate: [AuthGuard], component: DetailOuvrageComponent,},
  {path: 'listCout', canActivate: [AuthGuard], component: ListCoutComponent},
  {path: 'listOuvrage', canActivate: [AuthGuard], component: ListOuvrageComponent},
  {path: 'ajoutCout/:id', canActivate: [AuthGuard], component: OuvrageAddCoutComponent},
  {path: 'listFournisseur', canActivate: [AuthGuard], component: ListFournisseurComponent},
  // {path:'fournisseur',component:FormFournisseurComponent},
  // {path:'fournisseur/:id',component:FormFournisseurComponent},
  {path: 'listTypeCout', canActivate: [AuthGuard], component: ListTypeCoutComponent},
  // {path:'typeCout',component:FormTypeCoutComponent},
  // {path:'typeCout/:id',component:FormTypeCoutComponent},


  {path: 'cout', canActivate: [AuthGuard], component: FormComponent},
  {path: 'cout/:id', canActivate: [AuthGuard], component: FormComponent},
  {path: 'fournisseur', canActivate: [AuthGuard], component: FormComponent},
  {path: 'fournisseur/:id', canActivate: [AuthGuard], component: FormComponent},
  {path: 'typeCout', canActivate: [AuthGuard], component: FormComponent, data: {title: 'Form typeCout'}},
  {path: 'typeCout/:id', canActivate: [AuthGuard], component: FormComponent},
  {path: 'ouvrage', canActivate: [AuthGuard], component: FormComponent},
  {path: 'ouvrage/:id', canActivate: [AuthGuard], component: FormComponent},
  {path: 'devisDetail/:id', canActivate: [AuthGuard], component: DetailDevisComponent},
  {path: 'devisCreate/:id', canActivate: [AuthGuard], component: CreateDevisComponent},


  {path: 'ouvrages-elementaires', canActivate: [AuthGuard], component: ListOuvrageElementaireComponent,},
  {path: 'ouvrages-elementaires-du-devis/:id', canActivate: [AuthGuard], component: DetailOuvrageElementaireDuDevisComponent,},
  {path: 'ouvrages-elementaires-detail/:id', canActivate: [AuthGuard], component: DetailOuvrageElementaireComponent,},
  {path: 'ouvrages-elementaires-detail/add/:id', canActivate: [AuthGuard], component: OuvrageElementaireAddCoutComponent,},


  {path: 'dashboard', canActivate: [AuthGuard], component: DashboardComponent, data: {title: 'Dashboard'}},

  {path: 'clients', canActivate: [AuthGuard], component: ListClientComponent, data: {title: 'Liste des clients'}},
  {path: 'clients/new', canActivate: [AuthGuard], component: EditComponent, data: {title: 'Creation des clients'}},
  {path: 'clients/:id', canActivate: [AuthGuard], component: EditComponent, data: {title: 'Details du clients'}},
  {path: 'clients/:id', canActivate: [AuthGuard], component: ClientsComponent, data: {title: 'Details du clients'}},
  /*
    {path: 'clients/detail/:id', component: UserComponent, data: {title: 'Detail des utilisateurs'}},
  */

  {
    path: 'users',
    canActivate: [AuthGuard],
    component: UserListComponent,
    data: {title: 'Liste des utilisateurs', roles: [Role.SuperAdmin, Role.Admin]}
  },
  {
    path: 'users/new',
    canActivate: [AuthGuard],
    component: UserEditComponent,
    data: {title: 'Création des utilisateurs', roles: [Role.SuperAdmin, Role.Admin]}
  },
  {
    path: 'users/:id',
    canActivate: [AuthGuard],
    component: UserEditComponent,
    data: {title: 'Detail des utilisateurs', roles: [Role.SuperAdmin, Role.Admin]}
  },
  {path: 'mon_profile', canActivate: [AuthGuard], component: UserComponent, data: {title: 'Profil utilisateurs'}},
  {path: 'logs', canActivate: [AuthGuard], component: LogsComponent, data: {title: 'log utilisateurs'}},
  {path: 'logs/:id', canActivate: [AuthGuard], component: LogsComponent, data: {title: 'log utilisateurs'}},

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
  {
    path: 'entreprises/:id',
    canActivate: [AuthGuard],
    component: EntrepriseEditComponent,
    data: {roles: [Role.SuperAdmin], title: 'Détails des entreprises'}
  },

  {path: 'devis', canActivate: [AuthGuard], component: ListDevisComponent, data: {title: 'Liste des devis'}},
  {path: 'devis/new', canActivate: [AuthGuard], component: EditDevisComponent, data: {title: 'Devis'}},
  {path: 'devis/:id', canActivate: [AuthGuard], component: EditDevisComponent, data: {title: 'Devis'}},
  {
    path: 'sousDetailPrix/:id',
    canActivate: [AuthGuard],
    component: SousDetailPrixComponent,
    data: {title: 'Sous détail de prix'}
  },

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
  {
    path: 'admin/entreprise/:id',
    canActivate: [AuthGuard],
    component: SuperAdminListComponent,
    data: {title: 'Administration',}
  },
  {path: 'login', component: LoginComponent},
  {path: 'aide', component: AideComponent},


  // {path: '**', redirectTo: ''}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[UserService]
})
export class AppRoutingModule {
}
