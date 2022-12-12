import {Component, Input, OnInit} from '@angular/core';
import {CoutService} from "../_service/cout.service";
import {Cout} from "../_models/cout";
import {UserService} from "../_service/user.service";
import {MatTableDataSource} from "@angular/material/table";


@Component({
  selector: 'app-list-cout',
  templateUrl: './list-cout.component.html',
  styleUrls: ['./list-cout.component.scss']
})
export class ListCoutComponent implements OnInit {
  @Input() listCout!: Cout[]
  columnsToDisplay = ["type", "categorie", "designation", "unite", "prixUnitaire","fournisseur", "boutons"];
  userId = localStorage.getItem("userID");
  dataSource!:any;

  constructor(private coutService: CoutService, private userService : UserService) {
  }


  ngOnInit(): void {
    this.getUserEntreprise();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  getAllCouts(entrepriseId:number): void {
    this.coutService.getAll(entrepriseId).subscribe(data => {
      this.listCout = data;
      console.log("list cout TS getAllCouts DATA:",data)
      this.dataSource = new MatTableDataSource(this.listCout)

    });
  }

  delete(id: number): void {
    // this.coutService.deleteByID(this.listCout.map(value => value.id)).subscribe(() => this.deleteCout.emit())
    this.coutService.deleteByID(id).subscribe(() => this.ngOnInit())
  }

  getUserEntreprise():void{
    this.userService.getById(this.userId).subscribe(data => {
     this.getAllCouts(data.Entreprises[0].id)
    })
  }

}
