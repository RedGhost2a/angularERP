import {Component, Input, OnInit} from '@angular/core';
import {CoutService} from "../_service/cout.service";
import {Cout} from "../_models/cout";


@Component({
  selector: 'app-list-cout',
  templateUrl: './list-cout.component.html',
  styleUrls: ['./list-cout.component.scss']
})
export class ListCoutComponent implements OnInit {
  @Input() listCout!: Cout[]
  // @ts-ignore
  // currentUser = JSON.parse(localStorage.getItem('user'))
  columnsToDisplay = ["type", "categorie", "designation", "unite", "prixUnitaire", "boutons"];


  constructor(private coutService: CoutService) {
  }


  ngOnInit(): void {
    this.getAllCouts()

  }


  getAllCouts(): void {
    this.coutService.getAllCouts().subscribe(data => {
      this.listCout = data;
      console.log(data)
    });
  }

  delete(id: number): void {
    // this.coutService.deleteByID(this.listCout.map(value => value.id)).subscribe(() => this.deleteCout.emit())

    this.coutService.deleteByID(id).subscribe(() => this.ngOnInit())
  }


}
