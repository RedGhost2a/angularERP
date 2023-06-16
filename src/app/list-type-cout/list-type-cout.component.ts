import {Component, OnInit} from '@angular/core';
import {TypeCoutService} from "../_service/typeCout.service";
import {TypeCout} from "../_models/type-cout";
import {MatTableDataSource} from "@angular/material/table";
import {UserService} from "../_service/user.service";
import {DialogConfirmSuppComponent} from "../dialog-confirm-supp/dialog-confirm-supp.component";
import {MatDialog} from "@angular/material/dialog";
import {FormTypeCoutComponent} from "../form-type-cout/form-type-cout.component";
import {Entreprise} from "../_models/entreprise";
import {Data} from "@angular/router";
import {DataSharingService} from "../_service/data-sharing-service.service";
import {Fournisseur} from "../_models/fournisseur";
import _default from "chart.js/dist/plugins/plugin.tooltip";
import type = _default.defaults.animations.numbers.type;


@Component({
  selector: 'app-list-type-cout',
  templateUrl: './list-type-cout.component.html',
  styleUrls: ['./list-type-cout.component.scss']
})
export class ListTypeCoutComponent implements OnInit {
  dataSource!:  MatTableDataSource<TypeCout>;
  columnsToDisplay = ["type", "categorie","entreprise", "boutons"];


  constructor(private typeCoutService: TypeCoutService, private userService: UserService, private dialog: MatDialog,
              private dataSharingService : DataSharingService) {
  }

  ngOnInit(): void {
    this.getUserEntreprise()
  }


  applyFilter(event: Event) {
    this.dataSharingService.applyFilter(event, this.dataSource)
  }

  getAllTypeCouts(entrepriseId: number): void {
    this.typeCoutService.getAllForList(entrepriseId).subscribe((listTypeCout: TypeCout[]) => {
      this.typeCoutService.typeCouts = this.typeCoutService.typeCouts.concat(listTypeCout)
      this.dataSource = new MatTableDataSource(this.typeCoutService.typeCouts);
      console.log(listTypeCout)
    })
  }



  deleteItem(id: number) {
    const dialogRef = this.dialog.open(DialogConfirmSuppComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.typeCoutService.deleteTypeCoutById(id).subscribe(() => this.ngOnInit())
      }
    });
  }

  getUserEntreprise(): void {
    this.userService.currentUser.Entreprises.forEach((entreprise: Entreprise) =>{
      this.getAllTypeCouts(entreprise.id)
    })
  }

  openDialogCreate(typeCout:TypeCout | null) {
  this.typeCoutService.openDialogCreate(typeCout, ()=>{
    this.getUserEntreprise()
  })
  }




}
