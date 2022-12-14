import {Component, Input, OnInit} from '@angular/core';

import {Entreprise} from "../../_models/entreprise";
import {EntrepriseService} from 'src/app/_service/entreprise.service';
import {UserService} from "../../_service/user.service";

@Component({
  selector: 'app-entreprise-list',
  templateUrl: './entreprise-list.component.html',
  styleUrls: ['./entreprise-list.component.scss']
})
export class EntrepriseListComponent implements OnInit {

  @Input() entreprise!: Entreprise;
  // @Output() deleteEntreprise: EventEmitter<any> = new EventEmitter()

  listEntreprise !: Entreprise[];
  userEntreprise!: Entreprise;
  curentUser !: string;


  constructor(private entrepriseService: EntrepriseService, private userService: UserService) {
    this.userEntreprise = new Entreprise;
  }

  ngOnInit(): void {
    // this.getAll()
    this.getCurrentUser()
    this.getBYId(this.curentUser)
  }

  delete(id: any): void {
    this.entrepriseService.deleteByID(id).subscribe(() => this.ngOnInit())
  }

  getCurrentUser(): string {
    this.curentUser = this.userService.userValue.EntrepriseId;
    return this.curentUser
  }

  getBYId(id: any): void {
    this.entrepriseService.getById(id)
      .subscribe(data => {
        this.userEntreprise = data;
        console.log("ENTREPRISE LIST TS GETBYID: ",data)

        console.log(this.userEntreprise.Adresse)
        return this.userEntreprise
      })

  }

  getAll(): void {
    this.entrepriseService.getAll().subscribe(data => this.listEntreprise = data)

  }
}
