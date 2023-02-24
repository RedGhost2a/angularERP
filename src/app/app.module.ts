import {NgModule, OnInit} from '@angular/core';
import {ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule, Routes} from '@angular/router';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ClientsComponent} from './clients/clients.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from "@angular/material/button";
import {DialogComponent} from './dialogListOuvrage/dialog.component';
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
import {MatNativeDateModule, MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {SuperAdminComponent} from './super-admin/super-admin.component';
import {ErrorInterceptor, JwtInterceptor} from "./_helpers";
import {CoutComponent} from './cout/cout.component';
import {DetailOuvrageComponent} from './detail-ouvrage/detail-ouvrage.component';
import {FormCoutComponent} from './form-cout/form-cout.component';
import {FormOuvrageComponent} from './form-ouvrage/form-ouvrage.component';
import {ListCoutComponent} from './list-cout/list-cout.component';
import {ListOuvrageComponent} from './list-ouvrage/list-ouvrage.component';
import {OuvrageAddCoutComponent} from './ouvrage-add-cout/ouvrage-add-cout.component';
import {FormDevisComponent} from './form-devis/form-devis.component';
import {SuperAdminListComponent} from './super-admin-list/super-admin-list.component';
import {ListFournisseurComponent} from './list-fournisseur/list-fournisseur.component';
import {ListTypeCoutComponent} from './list-type-cout/list-type-cout.component';
import {FormFournisseurComponent} from './form-fournisseur/form-fournisseur.component';
import {FormTypeCoutComponent} from './form-type-cout/form-type-cout.component';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {ListDevisComponent} from './devis/list-devis/list-devis.component';
import {EditDevisComponent} from './devis/edit-devis/edit-devis.component';
import {FormComponent} from './form/form.component';
import {HomeComponent} from './home/home.component';
import {MatListModule} from "@angular/material/list";
import {UniquePipe} from "./_helpers/FiltreUnique";
import {DetailDevisComponent} from './detail-devis/detail-devis.component';
import {CreateDevisComponent} from './create-devis/create-devis.component';
import {MatTabsModule} from "@angular/material/tabs";
import {MatRadioModule} from "@angular/material/radio";
import {DialogConfirmSuppComponent} from './dialog-confirm-supp/dialog-confirm-supp.component';
import {SousDetailPrixComponent} from './sous-detail-prix/sous-detail-prix.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {DialogNotesComponent} from './dialog-notes/dialog-notes.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatTooltipModule} from "@angular/material/tooltip";
import { DialogListCoutComponent } from './dialog-list-cout/dialog-list-cout.component';
import { DialogFormCoutComponent } from './dialog-form-cout/dialog-form-cout.component';
import {LoggerModule, NgxLoggerLevel, TOKEN_LOGGER_SERVER_SERVICE} from "ngx-logger";
import {LogsComponent} from './logs/logs.component';
import {CustomErrorHandler} from "./_helpers/errorHandler";
import {CustomBodyForNGXLoggerService} from "./_service/customBodyForNGXLogger.service";
import {MatBadgeModule} from "@angular/material/badge";
import {MatPaginatorModule} from "@angular/material/paginator";


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
    HomeComponent,
    UniquePipe,
    DetailDevisComponent,
    CreateDevisComponent,
    DialogConfirmSuppComponent,
    SousDetailPrixComponent,
    DialogNotesComponent,
    DialogListCoutComponent,
    DialogFormCoutComponent,
    LogsComponent,


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
    MatListModule,
    MatTabsModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatPaginatorModule,
    LoggerModule.forRoot({
      serverLoggingUrl: 'http://localhost:4000/logs',
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.DEBUG,
      disableConsoleLogging: false
    }, {
      serverProvider: {
        provide: TOKEN_LOGGER_SERVER_SERVICE,
        useClass: CustomBodyForNGXLoggerService
      }
    }),
    MatBadgeModule,
    MatPaginatorModule


  ],
  providers: [{
    provide: TOASTR_TOKEN,
    useValue: toastr,


  },
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: ErrorHandler, useClass: CustomErrorHandler}


  ],
  bootstrap: [AppComponent],

})

export class AppModule {

}
