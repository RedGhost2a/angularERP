import {Component, OnInit} from '@angular/core';
import {FournisseurService} from "../_service/fournisseur.service";
import {Fournisseur} from "../_models/fournisseur";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {DialogConfirmSuppComponent} from "../dialog-confirm-supp/dialog-confirm-supp.component";
import {User} from "../_models/users";
import {UserService} from "../_service/user.service";
import {Cout} from "../_models/cout";
import {FormFournisseurComponent} from "../form-fournisseur/form-fournisseur.component";


@Component({
  selector: 'app-list-fournisseur',
  templateUrl: './list-fournisseur.component.html',
  styleUrls: ['./list-fournisseur.component.scss']
})
export class ListFournisseurComponent implements OnInit {
  listFournisseur !: Fournisseur[];
  columnsToDisplay = ["commercialName", "remarque", "boutons"];
  dataSource!: any;
  user!:User

  constructor(private fournisseurService: FournisseurService, private dialog: MatDialog,
              private userService : UserService) {
  }

  ngOnInit(): void {
    this.getUser()
    // this.getAllFournisseur()
  }
  getUser():void{
    console.log(this.userService.userValue)
    this.userService.getById(this.userService.userValue.id).subscribe( data=>{
      this.getAllFournisseur(data.Entreprises[0].id)
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAllFournisseur(entrepriseId:number): void {
    this.fournisseurService.getAllFournisseurs(entrepriseId).subscribe(data => {
      this.listFournisseur = data;
      this.dataSource = new MatTableDataSource(this.listFournisseur);
    })
  }

  deleteItem(id: number) {
    const dialogRef = this.dialog.open(DialogConfirmSuppComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Appeler la fonction de suppression ici
        this.fournisseurService.deleteFournisseurById(id).subscribe(() => this.ngOnInit())
      }
    });
  }

  openDialogCreate(fournisseur:Fournisseur | null) {
    this.dialog.open(FormFournisseurComponent, {
      data: fournisseur,
      width: '70%',
      height: '37%'
    }).afterClosed().subscribe(async result => {
      this.ngOnInit()

    });
  }

}
