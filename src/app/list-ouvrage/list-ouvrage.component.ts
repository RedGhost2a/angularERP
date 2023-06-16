import {Component, OnInit} from '@angular/core';
import {OuvrageService} from "../_service/ouvrage.service";
import {Ouvrage} from "../_models/ouvrage";
import {OuvrageCoutService} from "../_service/ouvrageCout.service";
import {UserService} from "../_service/user.service";
import {DialogConfirmSuppComponent} from "../dialog-confirm-supp/dialog-confirm-supp.component";
import {MatDialog} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {DataSharingService} from "../_service/data-sharing-service.service";
import {Entreprise} from "../_models/entreprise";
import {UniteForFormService} from "../_service/uniteForForm.service";


@Component({
  selector: 'app-list-ouvrage',
  templateUrl: './list-ouvrage.component.html',
  styleUrls: ['./list-ouvrage.component.scss']
})
export class ListOuvrageComponent implements OnInit {
  dataSource!: MatTableDataSource<Ouvrage>;
  columnsToDisplay = ["designation", "benefice", "aleas", "unite", "rendement", "uRatio", "prixUnitaire","entreprise", "boutons"];

  constructor(private ouvrageService: OuvrageService, private ouvrageCoutService: OuvrageCoutService, private uniteForFormService: UniteForFormService,
              private dialog: MatDialog, private userService: UserService, private dataSharingService: DataSharingService) {
  }

  ngOnInit(): void {
    this.getCurrentUser()
  }

  getCurrentUser() {
    this.userService.currentUser.Entreprises.forEach((entreprise: Entreprise) => {
      this.ouvrageService.getAll(entreprise.id).subscribe((listOuvrage: Ouvrage []) => {
        console.log("listouvrage",listOuvrage)
        this.ouvrageService.ouvrages = this.ouvrageService.ouvrages.concat(listOuvrage);
        this.dataSource = new MatTableDataSource(this.ouvrageService.ouvrages);
        this.getPriceOuvrage()
      })
    });
  }

  getPriceOuvrage() {
    this.ouvrageService.getPriceOuvrages()
  }

  applyFilter(event: Event) {
    this.dataSharingService.applyFilter(event, this.dataSource)
  }

  openUniteForFormDialog(): void {
    this.uniteForFormService.openCreateUniteForFormDialog()
  }

  deleteItem(id: number) {
    const dialogRef = this.dialog.open(DialogConfirmSuppComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ouvrageService.deleteByID(id).subscribe(() => this.ngOnInit())
      }
    });
  }


  openDialogCreateOuvrage(ouvrage:  null) {
    this.ouvrageService.openDialogCreate(ouvrage, () => {
      this.getCurrentUser()
    })
  }

}
