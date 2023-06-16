import { Component, OnInit } from '@angular/core';
import {OuvrageElementaire} from "../_models/ouvrage-elementaire";
import {OuvrageElementaireService} from "../_service/ouvrage-elementaire.service";
import {MatTableDataSource} from "@angular/material/table";
import {UserService} from "../_service/user.service";
import {User} from "../_models/users";
import {Ouvrage} from "../_models/ouvrage";
import {FormOuvrageComponent} from "../form-ouvrage/form-ouvrage.component";
import {MatDialog} from "@angular/material/dialog";
import {FormOuvrageElementaireComponent} from "../form-ouvrage-elementaire/form-ouvrage-elementaire.component";
import {DialogConfirmSuppComponent} from "../dialog-confirm-supp/dialog-confirm-supp.component";

@Component({
  selector: 'app-list-ouvrage-elementaire',
  templateUrl: './list-ouvrage-elementaire.component.html',
  styleUrls: ['./list-ouvrage-elementaire.component.scss']
})
export class ListOuvrageElementaireComponent implements OnInit {
  ouvrageElementaire:OuvrageElementaire[]=[]
  dataSource!: any;
  currentUser!: User;
  columnsToDisplay = ["designation", "proportion", "unite", "prix",    "uniteProportionOE",
    "remarques", "boutons"];




  constructor(private ouvrageElementaireService:OuvrageElementaireService,
              private userService: UserService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.currentUser = this.userService.userValue;
    this.userService.getById(this.currentUser.id).subscribe(data => {
      console.log("user by id ", data)
      this.getAllOuvrageElementaire(data.Entreprises[0].id)
    })
  }

  getAllOuvrageElementaire(entrepriseId:number){
    this.ouvrageElementaireService.getAll(entrepriseId).subscribe(data => {
      this.ouvrageElementaire = data;
      this.dataSource = new MatTableDataSource(this.ouvrageElementaire);
      // console.log(this.dataSource)
  })
  }
  deleteItem(id: number) {
    const dialogRef = this.dialog.open(DialogConfirmSuppComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Appeler la fonction de suppression ici
        this.ouvrageElementaireService.deleteByID(id).subscribe(() => this.ngOnInit())
      }
    });
  }
  openDialogCreate(ouvrage: Ouvrage | null) {
    this.dialog.open(FormOuvrageElementaireComponent, {
      width: '70%',
      height: '35%'
    }).afterClosed().subscribe(async result => {
      console.log( result)
      this.ngOnInit()

    });
  }
}
