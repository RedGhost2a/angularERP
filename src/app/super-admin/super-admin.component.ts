import {Component, OnInit} from '@angular/core';
import {EntrepriseService} from "../_service/entreprise.service";
import {Entreprise} from "../_models/entreprise";
import {SuperAdminService} from "../_service/superAdmin.service";
import {User} from "../_models/users";
import {StorageService} from "../_service/storage.service";


@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.scss']
})
export class SuperAdminComponent implements OnInit {

  // @Input() entreprise!: Entreprise;
  // @Output() deleteEntreprise: EventEmitter<any> = new EventEmitter()

  listEntreprise !: Entreprise[];
  listUser !: User[];
  user!: string;
  devis: any;
  nbDevisByCompany: any;


  constructor(private entrepriseService: EntrepriseService, private superAdminService: SuperAdminService, private storageService: StorageService) {

  }

  ngOnInit(): void {
    this.getAll()
    // this.getDevisByCompany()
  }


  getAll(): void {
    this.entrepriseService.getAll().subscribe((data: any) => {
        this.listEntreprise = data
        const nbDevisByCompany = this.listEntreprise.map((value: any, index) => {
          return value.Devis.length
        })
      
        this.devis = nbDevisByCompany
        console.log(this.listEntreprise)
        console.log(nbDevisByCompany)
        console.log(this.devis)
      }
    )
  }

  getAllUserByEntreprise(id: any): void {
    this.superAdminService.getById(id).subscribe(data => this.listUser = data)

  }


}
