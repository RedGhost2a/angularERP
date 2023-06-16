import {Component, OnInit} from '@angular/core';
import {FournisseurService} from "../_service/fournisseur.service";
import {Fournisseur} from "../_models/fournisseur";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {DialogConfirmSuppComponent} from "../dialog-confirm-supp/dialog-confirm-supp.component";
import {UserService} from "../_service/user.service";
import {Entreprise} from "../_models/entreprise";
import {DataSharingService} from "../_service/data-sharing-service.service";


@Component({
  selector: 'app-list-fournisseur',
  templateUrl: './list-fournisseur.component.html',
  styleUrls: ['./list-fournisseur.component.scss']
})
export class ListFournisseurComponent implements OnInit {
  columnsToDisplay = ["commercialName", "remarque", "entreprise", "boutons"];
  dataSource!: MatTableDataSource<Fournisseur>;

  constructor(private fournisseurService: FournisseurService, private dialog: MatDialog,
              private userService : UserService, private dataSharingService : DataSharingService) {
  }

  ngOnInit(): void {
    this.getAllFournisseur()
  }


  applyFilter(event: Event) {
    this.dataSharingService.applyFilter(event, this.dataSource)
  }

  getAllFournisseur(): void {
    this.userService.currentUser.Entreprises.forEach((entreprise : Entreprise) =>{
    this.fournisseurService.getAllForList(entreprise.id).subscribe((listFournisseur : Fournisseur []) => {
      this.fournisseurService.fournisseurs = this.fournisseurService.fournisseurs.concat(listFournisseur)
      this.dataSource = new MatTableDataSource(this.fournisseurService.fournisseurs);
    })

    })
  }

  deleteItem(id: number) {
    const dialogRef = this.dialog.open(DialogConfirmSuppComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fournisseurService.deleteFournisseurById(id).subscribe(() => this.ngOnInit())
      }
    });
  }

  openDialogCreate(fournisseur:Fournisseur | null) {
    this.fournisseurService.openDialogCreate(fournisseur, ()=>{
      this.getAllFournisseur()
    })
  }

}
