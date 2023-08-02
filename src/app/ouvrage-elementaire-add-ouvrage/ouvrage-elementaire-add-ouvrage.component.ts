import {Component, Inject, OnInit} from '@angular/core';
import {OuvrageElementaireService} from "../_service/ouvrage-elementaire.service";
import {OuvrageElementaire} from "../_models/ouvrage-elementaire";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../_service/user.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {User} from "../_models/users";
import {OuvrageElementaireCout} from "../_models/ouvrage-elementaire-cout";
import {OuvrageOuvragesElementairesService} from "../_service/ouvrage-ouvrages-elementaires.service";
import {DialogComponent} from "../dialogListOuvrage/dialog.component";

@Component({
  selector: 'app-ouvrage-elementaire-add-ouvrage',
  templateUrl: './ouvrage-elementaire-add-ouvrage.component.html',
  styleUrls: ['./ouvrage-elementaire-add-ouvrage.component.scss']
})
export class OuvrageElementaireAddOuvrageComponent implements OnInit {
  ouvrageElementaire:OuvrageElementaire[]=[];
  columnsToDisplay = ["checkBox","designation",
    "proportion",
    "unite",
    "prix",
    "uniteproportionOE",
    "remarques"
]
  initialData!: OuvrageElementaire;
  currentUser!:User;
  currentOuvrageId!:number;
  ouvrageElemChecked: number[] = [];
  ouvrageElemOuvrage !: any ;



  constructor(private ouvrageElemnentaireService:OuvrageElementaireService,
              private ouvrageOuvrageElemService:OuvrageOuvragesElementairesService,
              private route: ActivatedRoute,
              private userService : UserService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<DialogComponent>,
) {
    this.initialData = this.data;

  }

  ngOnInit(): void {
    console.log(this.initialData)
    this.route.params.subscribe(params =>{
      console.log("params",params)
      this.currentOuvrageId =  +params['id']
      // console.log("current ouvrage id ",this.currentOuvrageId)
    })
    this.currentUser = this.userService.userValue;
    this.userService.getById(this.currentUser.id).subscribe(data =>{
      console.log("user by id ", data)
      // this.getAll(data.Entreprises[0].id)
    this.getAll(data.Entreprises[0].id)
    })
  }



  getAll(entrepriseId:number):void
  {
    this.ouvrageElemnentaireService.getAll(entrepriseId).subscribe(data=>{
      this.ouvrageElementaire=data
      console.log("OuvrageElementaire",this.ouvrageElementaire)
      this.ouvrageElemnentaireService.getPriceOuvragesElementaire(this.ouvrageElementaire)
    })
  }



  addOuvrageElemToOuvrage() {
    console.log("id de l'ouvrage courant",this.initialData.id )
    this.ouvrageElemChecked.forEach(cout => {
      console.log("valeur de cout", cout)
      this.ouvrageElemOuvrage = {
        OuvragesElementaireId:cout,
        OuvrageId:  this.initialData.id,
        // uRatio: `${this.initialData.unite}`
      }
      console.log("this.ouvrageCout",this.ouvrageElemOuvrage)
      this.ouvrageOuvrageElemService.create(this.ouvrageElemOuvrage).subscribe()
    })

  }
  closeDialog() {
    // Renvoyez la valeur de selectedOuvrageIds lors de la fermeture du dialogListOuvrage
    this.dialogRef.close();
  }

  onCheck(idOuvrage: number): void {
    if (this.ouvrageElemChecked.indexOf(idOuvrage) !== -1) {
      this.ouvrageElemChecked.forEach((element, index) => {
        if (element == idOuvrage) this.ouvrageElemChecked.splice(index, 1);
      });
    } else {
      this.ouvrageElemChecked.push(idOuvrage)
    }
    console.log(this.ouvrageElemChecked);
  }
}
