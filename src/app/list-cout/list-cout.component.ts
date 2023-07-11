import {Component, OnInit} from '@angular/core';
import {CoutService} from "../_service/cout.service";
import {Cout} from "../_models/cout";
import {UserService} from "../_service/user.service";
import {MatTableDataSource} from "@angular/material/table";
import {DialogConfirmSuppComponent} from "../dialog-confirm-supp/dialog-confirm-supp.component";
import {MatDialog} from "@angular/material/dialog";
import {Entreprise} from "../_models/entreprise";
import {DataSharingService} from "../_service/data-sharing-service.service";


@Component({
  selector: 'app-list-cout',
  templateUrl: './list-cout.component.html',
  styleUrls: ['./list-cout.component.scss']
})
export class ListCoutComponent implements OnInit {
  columnsToDisplay = ["type", "categorie", "designation", "unite", "prixUnitaire", "fournisseur","entreprise", "boutons"];
  dataSource!: MatTableDataSource<Cout> ;


  constructor(private coutService: CoutService, private userService: UserService, private dialog: MatDialog,
              private dataSharingService:DataSharingService) {

  }


  ngOnInit(): void {
    this.getUserEntreprise();
  }

  private getFilterPredicate(): (data: any, filter: string) => boolean {
    return (data: any, filter: string) => {
      const searchText = filter.trim().toLowerCase();
      const designation = data.designation.toLowerCase();
      const type = data.TypeCout.type.toLowerCase();
      const categories = data.TypeCout.categorie.toLowerCase();
      const fournisseurs = data.Fournisseur.commercialName.toLowerCase();
      const entreprises = data.Entreprise.denomination.toLowerCase();
      const valuesToSearch = [type, designation,categories, fournisseurs, entreprises];
      return valuesToSearch.some(value => value.includes(searchText));
    };
  }

  applyFilter(event: Event) {

    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = this.getFilterPredicate();
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAllCouts(entrepriseId: number): void {
    this.coutService.getAllForList(entrepriseId).subscribe((listCout : Cout []) => {
      this.coutService.couts = this.coutService.couts.concat(listCout);
      this.dataSource = new MatTableDataSource(this.coutService.couts );
      console.log(this.coutService.couts)
    });
  }


  deleteItem(id: number) {
    const dialogRef = this.dialog.open(DialogConfirmSuppComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.coutService.deleteByID(id).subscribe(() => this.ngOnInit())
      }
    });
  }

  getUserEntreprise(): void {
    this.userService.currentUser.Entreprises.forEach((entreprise : Entreprise ) =>{
      this.getAllCouts(entreprise.id)
    })
  }

  openDialogCreate(cout:Cout | null) {
    this.coutService.openDialogCreate(cout, ()=>{
      this.getUserEntreprise()
    })
  }


}
