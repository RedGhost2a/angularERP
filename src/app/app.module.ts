import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule, Routes} from '@angular/router';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ClientsComponent} from './clients/clients.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from "@angular/material/button";
import {DialogComponent} from './dialog/dialog.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatDialogModule} from "@angular/material/dialog";
import {EditComponent} from './clients/edit/edit.component';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {NavbarComponent} from './navbar/navbar.component';
import {DevisComponent} from './devis/devis.component';
import {BibliothequesComponent} from './bibliotheques/bibliotheques.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ParametresComponent} from './parametres/parametres.component';
import {ListClientComponent} from './clients/list-client/list-client.component';
import {MatTableModule} from "@angular/material/table";
import {MatListModule} from "@angular/material/list";
import {UserComponent} from './parametres/user/user.component';
import {UserEditComponent} from './parametres/user-edit/user-edit.component';
import {UserListComponent} from './parametres/user-list/user-list.component';
import {MatCardModule} from "@angular/material/card";
import {ToastrModule} from "ngx-toastr";
import {Toastr, TOASTR_TOKEN} from "./_service/toastr.service";
import {EntrepriseListComponent} from './parametres/entreprise-list/entreprise-list.component';
import {EntrepriseEditComponent} from './parametres/entreprise-edit/entreprise-edit.component';
import {LoginComponent} from './login/login.component';
import {MatExpansionModule} from "@angular/material/expansion";
import {LayoutModule} from '@angular/cdk/layout';
import {MatMenuModule} from "@angular/material/menu";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {SuperAdminComponent} from './super-admin/super-admin.component';
import {ErrorInterceptor, JwtInterceptor} from "./_helpers";
import { CoutComponent } from './cout/cout.component';
import { DetailOuvrageComponent } from './detail-ouvrage/detail-ouvrage.component';
import { FormCoutComponent } from './form-cout/form-cout.component';
import { FormOuvrageComponent } from './form-ouvrage/form-ouvrage.component';
import { ListCoutComponent } from './list-cout/list-cout.component';
import { ListOuvrageComponent } from './list-ouvrage/list-ouvrage.component';
import { OuvrageAddCoutComponent } from './ouvrage-add-cout/ouvrage-add-cout.component';
import { FormDevisComponent } from './form-devis/form-devis.component';
import { SuperAdminListComponent } from './super-admin-list/super-admin-list.component';
import { ListFournisseurComponent } from './list-fournisseur/list-fournisseur.component';
import { ListTypeCoutComponent } from './list-type-cout/list-type-cout.component';
import { FormFournisseurComponent } from './form-fournisseur/form-fournisseur.component';
import { FormTypeCoutComponent } from './form-type-cout/form-type-cout.component';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {ListDevisComponent} from './devis/list-devis/list-devis.component';
import {EditDevisComponent} from './devis/edit-devis/edit-devis.component';
import { FormComponent } from './form/form.component';


const appRoutes: Routes = [];
declare const toastr: Toastr;

@NgModule({
  declarations: [
    AppComponent,
    ClientsComponent,
    DialogComponent,
    EditComponent,
    NavbarComponent,
    DevisComponent,
    BibliothequesComponent,
    DashboardComponent,
    ParametresComponent,
    ListClientComponent,
    UserComponent,
    UserEditComponent,
    UserListComponent,
    EntrepriseListComponent,
    EntrepriseEditComponent,
    LoginComponent,
    SuperAdminComponent,
    CoutComponent,
    DetailOuvrageComponent,
    FormCoutComponent,
    FormOuvrageComponent,
    ListCoutComponent,
    ListOuvrageComponent,
    OuvrageAddCoutComponent,
    FormDevisComponent,
    SuperAdminListComponent,
    ListFournisseurComponent,
    ListTypeCoutComponent,
    FormFournisseurComponent,
    FormTypeCoutComponent,
      ListDevisComponent,
    EditDevisComponent,
    FormComponent,
  
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatButtonModule,
        RouterModule.forRoot(appRoutes),
        HttpClientModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSidenavModule,
        MatDialogModule,
        FontAwesomeModule,
        MatTableModule,
        MatListModule,
        MatCardModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        FormsModule,
        MatExpansionModule,
        LayoutModule,
        MatMenuModule,
        MatCheckboxModule,
        MatOptionModule,
        MatSelectModule,
        MatAutocompleteModule,

    ],
  providers: [{
    provide: TOASTR_TOKEN,
    useValue: toastr,

  },
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},

  ],
  bootstrap: [AppComponent],

})

export class AppModule {

}
