import {Component, Input, OnInit} from '@angular/core';
import {CoutService} from "../_service/cout.service";
import {Cout} from "../_models/cout";
import {UserService} from "../_service/user.service";
import {MatTableDataSource} from "@angular/material/table";
import {DialogConfirmSuppComponent} from "../dialog-confirm-supp/dialog-confirm-supp.component";
import {MatDialog} from "@angular/material/dialog";
import {FormCoutComponent} from "../form-cout/form-cout.component";
import {User} from "../_models/users";


@Component({
  selector: 'app-list-cout',
  templateUrl: './list-cout.component.html',
  styleUrls: ['./list-cout.component.scss']
})
export class ListCoutComponent implements OnInit {
  @Input() listCout!: Cout[]
  columnsToDisplay = ["type", "categorie", "designation", "unite", "prixUnitaire", "fournisseur", "boutons"];
  currentUser !:User ;
  dataSource!: any;

  constructor(private coutService: CoutService, private userService: UserService, private dialog: MatDialog) {

  }


  ngOnInit(): void {
    this.getUserEntreprise();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  getAllCouts(entrepriseId: number): void {
    this.coutService.getAll(entrepriseId).subscribe(data => {
      this.listCout = data;
      console.log("list cout TS getAllCouts DATA:", data)
      this.dataSource = new MatTableDataSource(this.listCout);
    });
  }

  delete(id: number): void {
    this.coutService.deleteByID(id).subscribe(() => this.ngOnInit())
  }

  deleteItem(id: number) {
    const dialogRef = this.dialog.open(DialogConfirmSuppComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Appeler la fonction de suppression ici
        this.coutService.deleteByID(id).subscribe(() => this.ngOnInit())
      }
    });
  }

  getUserEntreprise(): void {
    this.userService.getById(this.userService.userValue.id).subscribe(data => {
      this.currentUser = data;
      this.getAllCouts(data.Entreprises[0].id)
    })
  }

  openDialogCreate(cout:Cout | null) {
    this.dialog.open(FormCoutComponent, {
      data: cout,
      width: '70%',
      height: '37%'
    }).afterClosed().subscribe(async result => {
        this.ngOnInit()

    });
  }


}
