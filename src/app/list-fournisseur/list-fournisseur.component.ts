import { Component, OnInit } from '@angular/core';
import {FournisseurService} from "../_service/fournisseur.service";
import {Fournisseur} from "../_models/fournisseur";
import {MatTableDataSource} from "@angular/material/table";


@Component({
  selector: 'app-list-fournisseur',
  templateUrl: './list-fournisseur.component.html',
  styleUrls: ['./list-fournisseur.component.scss']
})
export class ListFournisseurComponent implements OnInit {
  listFournisseur !:Fournisseur[];
  columnsToDisplay = ["commercialName", "remarque", "boutons"];
  dataSource!:any;

  constructor(private fournisseurService: FournisseurService) { }

  ngOnInit(): void {
    this.getAllFournisseur()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAllFournisseur():void{
    this.fournisseurService.getAllFournisseurs().subscribe(data =>{
      this.listFournisseur = data;
      this.dataSource = new MatTableDataSource(this.listFournisseur);
    })
  }
  deleteFournisseurById(id: number): void {
    this.fournisseurService.deleteFournisseurById(id).subscribe(() => this.ngOnInit())
  }


}
