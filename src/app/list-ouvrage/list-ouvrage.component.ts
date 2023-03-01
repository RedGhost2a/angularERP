import {Component, Input, OnInit} from '@angular/core';
import {OuvrageService} from "../_service/ouvrage.service";
import {Ouvrage} from "../_models/ouvrage";
import {CoutDuDevis} from "../_models/cout-du-devis";
import {OuvrageCoutService} from "../_service/ouvrageCout.service";
import {UserService} from "../_service/user.service";
import {User} from "../_models/users";
import {DialogConfirmSuppComponent} from "../dialog-confirm-supp/dialog-confirm-supp.component";
import {MatDialog} from "@angular/material/dialog";
import {Cout} from "../_models/cout";
import {FormCoutComponent} from "../form-cout/form-cout.component";
import {FormOuvrageComponent} from "../form-ouvrage/form-ouvrage.component";
import {MatTableDataSource} from "@angular/material/table";


@Component({
  selector: 'app-list-ouvrage',
  templateUrl: './list-ouvrage.component.html',
  styleUrls: ['./list-ouvrage.component.scss']
})
export class ListOuvrageComponent implements OnInit {
  listOuvrage!: Ouvrage[];
  currentUser!: User;
  dataSource!: any;
  columnsToDisplay = ["designation", "benefice", "aleas", "unite", "ratio", "uRatio", "prixUnitaire", "boutons"];

  constructor(private ouvrageService: OuvrageService, private ouvrageCoutService: OuvrageCoutService,
              private dialog: MatDialog, private userService: UserService) {
  }

  ngOnInit(): void {
    this.currentUser = this.userService.userValue;
    this.userService.getById(this.currentUser.id).subscribe(data => {
      console.log("user by id ", data)
      this.getAll(data.Entreprises[0].id)
    })

  }
  applyFilter(event: Event) {
    console.log(event)
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAll(entrepriseId:number): void {
    this.ouvrageService.getAll(entrepriseId).subscribe(data => {
      this.listOuvrage = data;
      this.dataSource = new MatTableDataSource(this.listOuvrage);
      data.forEach((ouvrage : Ouvrage) =>{
        ouvrage.prix = 0 ;
        ouvrage.Couts?.forEach((cout:Cout)=>{
          ouvrage.prix += cout.prixUnitaire
        })
      })
    })
  }

  delete(id: number): void {
    this.ouvrageService.deleteByID(id).subscribe(() => this.ngOnInit())
  }

  deleteItem(id: number) {
    const dialogRef = this.dialog.open(DialogConfirmSuppComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Appeler la fonction de suppression ici
        this.ouvrageService.deleteByID(id).subscribe(() => this.ngOnInit())
      }
    });
  }


  openDialogCreate(ouvrage:Ouvrage | null) {
    this.dialog.open(FormOuvrageComponent, {
      data: ouvrage,
      width: '70%',
      height: '35%'
    }).afterClosed().subscribe(async result => {
      console.log("result ? list cout: ", result)
      // this.ngOnInit()
      this.ngOnInit()

    });
  }


}
