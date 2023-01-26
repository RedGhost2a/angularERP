import {Component, OnInit} from '@angular/core';
import {TypeCoutService} from "../_service/typeCout.service";
import {TypeCout} from "../_models/type-cout";
import {MatTableDataSource} from "@angular/material/table";
import {UserService} from "../_service/user.service";
import {DialogConfirmSuppComponent} from "../dialog-confirm-supp/dialog-confirm-supp.component";
import {MatDialog} from "@angular/material/dialog";


@Component({
  selector: 'app-list-type-cout',
  templateUrl: './list-type-cout.component.html',
  styleUrls: ['./list-type-cout.component.scss']
})
export class ListTypeCoutComponent implements OnInit {
  listTypeCout!: TypeCout[];
  dataSource!: any;
  columnsToDisplay = ["type", "categorie", "boutons"];
  userId = this.userService.userValue.id;


  constructor(private typeCoutService: TypeCoutService, private userService: UserService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getUserEntreprise()
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAllTypeCouts(entrepriseId: number): void {
    this.typeCoutService.getAllTypeCouts(entrepriseId).subscribe(data => {
      this.listTypeCout = data;
      this.dataSource = new MatTableDataSource(this.listTypeCout);
    })
  }

  deleteTypeCoutById(id: number): void {
    this.typeCoutService.deleteTypeCoutById(id).subscribe(() => this.ngOnInit())
  }

  deleteItem(id: number) {
    const dialogRef = this.dialog.open(DialogConfirmSuppComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Appeler la fonction de suppression ici
        this.typeCoutService.deleteTypeCoutById(id).subscribe(() => this.ngOnInit())
      }
    });
  }

  getUserEntreprise(): void {
    this.userService.getById(this.userId).subscribe(data => {
      this.getAllTypeCouts(data.Entreprises[0].id)
    })
  }
}
