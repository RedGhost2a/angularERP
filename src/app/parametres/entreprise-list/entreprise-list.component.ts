import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Entreprise} from "../../_models/entreprise";
import {EntrepriseService} from 'src/app/_service/entreprise.service';

@Component({
  selector: 'app-entreprise-list',
  templateUrl: './entreprise-list.component.html',
  styleUrls: ['./entreprise-list.component.scss']
})
export class EntrepriseListComponent implements OnInit {

  @Input() entreprise!: Entreprise;
  @Output() deleteEntreprise: EventEmitter<any> = new EventEmitter()

  listEntreprise !: Entreprise[];


  constructor(private entrepriseService: EntrepriseService) {
  }

  ngOnInit(): void {
    this.getAll()
  }

  delete(id: any): void {
    this.entrepriseService.deleteByID(id).subscribe(() => this.ngOnInit())
  }

  getAll(): void {
    this.entrepriseService.getAll().subscribe(data => this.listEntreprise = data)

  }
}
