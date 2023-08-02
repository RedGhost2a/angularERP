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
import {Entreprise} from "../_models/entreprise";

@Component({
  selector: 'app-list-ouvrage-elementaire',
  templateUrl: './list-ouvrage-elementaire.component.html',
  styleUrls: ['./list-ouvrage-elementaire.component.scss']
})
export class ListOuvrageElementaireComponent implements OnInit {
  ouvrageElementaire:OuvrageElementaire[]=[]
  dataSource!: any;
  currentUser!: User;
  columnsToDisplay = ["designation", "proportion", "unite", "prix", "uniteProportionOE",
    "remarques","entreprise", "boutons"];




  constructor(private ouvrageElementaireService:OuvrageElementaireService,
              private userService: UserService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.currentUser = this.userService.userValue;
    this.userService.getById(this.currentUser.id).subscribe(data => {
      console.log("user by id ", data)
      this.getAllOuvrageElementaire()
    })
  }
  getPriceOuvragesElementaire(){
    this.ouvrageElementaire.forEach((ouvrageElem: OuvrageElementaire) => {
      if (ouvrageElem.Couts && ouvrageElem.Couts?.length >= 1) {
        ouvrageElem.prix = ouvrageElem.Couts.reduce((total, cout) => {
          if (cout.OuvragesElementairesCouts?.ratio) {
            return total + cout.prixUnitaire * cout.OuvragesElementairesCouts.ratio;
          } else {
            return total;
          }
        }, 0);
      }
    });
  }
  getAllOuvrageElementaire() {
        this.ouvrageElementaire = []
    this.userService.currentUser.Entreprises.forEach((entreprise: Entreprise) => {
      this.ouvrageElementaireService.getAll(entreprise.id).subscribe((listOuvrageElem: OuvrageElementaire []) => {
        console.log("listOuvrageElem",listOuvrageElem)
        this.ouvrageElementaire = this.ouvrageElementaire.concat(listOuvrageElem);
        this.dataSource = new MatTableDataSource(this.ouvrageElementaire);
      this.getPriceOuvragesElementaire()
      })
    });
  }

  // getAllOuvrageElementaire(entrepriseId:number){
  //   this.ouvrageElementaireService.getAll(entrepriseId).subscribe((listOuvrageElem : OuvrageElementaire []) => {
  //     this.ouvrageElementaire = []
  //     this.ouvrageElementaire = this.ouvrageElementaire.concat(listOuvrageElem);
  //     console.log("liste ouvrage elementaire",listOuvrageElem)
  //     this.dataSource = new MatTableDataSource(this.ouvrageElementaire);
  //
  //     // console.log(this.dataSource)
  // })
  // }
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
