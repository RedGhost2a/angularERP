import {Component, Input, OnInit} from '@angular/core';
import {OuvrageService} from "../_service/ouvrage.service";
import {Ouvrage} from "../_models/ouvrage";
import {CoutDuDevis} from "../_models/cout-du-devis";
import {OuvrageCoutService} from "../_service/ouvrageCout.service";
import {UserService} from "../_service/user.service";
import {User} from "../_models/users";


@Component({
  selector: 'app-list-ouvrage',
  templateUrl: './list-ouvrage.component.html',
  styleUrls: ['./list-ouvrage.component.scss']
})
export class ListOuvrageComponent implements OnInit {
  listOuvrage!: Ouvrage[];
  currentUser!:User;
  entrepriseId!:number;
  prixOuvrage: number[] = [];
  columnsToDisplay = ["designation", "benefice", "aleas", "unite", "ratio", "uRatio", "prixUnitaire", "boutons"];

  constructor(private ouvrageService: OuvrageService, private ouvrageCoutService: OuvrageCoutService,
              private userService : UserService) {
  }

  ngOnInit(): void {
    this.currentUser = this.userService.userValue;
    this.userService.getById(this.currentUser.id).subscribe(data =>{
      console.log("user by id ", data)
      this.entrepriseId = data.Entreprises[0].id
    this.getAll()
    this.getAllPrice()
    })
      //.log("Entreprise ID",this.entrepriseId)

  }

  getAll(): void {
    // this.ouvrageService.getAll().subscribe(data => console.log(data) )
    this.ouvrageService.getAll(this.entrepriseId).subscribe(data => {
      this.listOuvrage = data;
      // console.log(data[0].cout[0].type);
      console.log("get all ouvrage list ouvrage data : ", data)
    })
  }

  delete(id: number): void {
    this.ouvrageService.deleteByID(id).subscribe(() => this.ngOnInit())
  }

  getAllPrice(): void {
    this.ouvrageCoutService.getSumAllOuvrage().subscribe(data => {
      console.log("list ouvrage get all price data : ", data)
      for (const somme of data) {
        console.log("list ouvrage getAllPrice somme : ", somme.sommeCouts)
        this.prixOuvrage.push(somme.sommeCouts);
      }
      console.log('tableau de prix', this.prixOuvrage)
    })
  }


}
