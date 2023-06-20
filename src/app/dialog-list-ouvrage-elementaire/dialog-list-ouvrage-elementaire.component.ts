import {Component, Inject, OnInit} from '@angular/core';
import {OuvrageElementaireService} from "../_service/ouvrage-elementaire.service";
import {OuvrageOuvragesElementairesService} from "../_service/ouvrage-ouvrages-elementaires.service";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../_service/user.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogComponent} from "../dialogListOuvrage/dialog.component";
import {OuvrageElementaire} from "../_models/ouvrage-elementaire";
import {User} from "../_models/users";
import {OuvrageCoutDuDevis} from "../_models/ouvrageCoutDuDevis";
import {CoutDuDevis} from "../_models/cout-du-devis";
import {CoutService} from "../_service/cout.service";
import {OuvrageElementaireCoutService} from "../_service/ouvrage-elementaire-cout.service";
import {DataSharingService} from "../_service/data-sharing-service.service";

@Component({
  selector: 'app-dialog-list-ouvrage-elementaire',
  templateUrl: './dialog-list-ouvrage-elementaire.component.html',
  styleUrls: ['./dialog-list-ouvrage-elementaire.component.scss']
})
export class DialogListOuvrageElementaireComponent implements OnInit {
  ouvrageElementaire: OuvrageElementaire[] = [];
  columnsToDisplay = ["checkBox", "designation",
    "proportion",
    "unite",
    "prix",
    "uniteproportionOE",
    "remarques",
  ]
  currentUser!: User;
  currentOuvrageId!: number;
  selectedOuvrageElemIds: number[] = [];
  isChecked: boolean = false;
  coutDuDevis!: CoutDuDevis;



  constructor(private ouvrageElemnentaireService: OuvrageElementaireService,
              private ouvrageOuvrageElemService: OuvrageOuvragesElementairesService,
              private route: ActivatedRoute,
              private userService: UserService,
              private dialogRef: MatDialogRef<DialogComponent>,
              private coutService: CoutService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private ouvrageElementaireCoutService : OuvrageElementaireCoutService
    , private dataSharingService: DataSharingService,
  ) {this.currentOuvrageId= this.data
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log("params", params)
      // this.currentOuvrageId = +params['id']
    })
       console.log("current ouvrage id ",this.data)
    this.currentUser = this.userService.userValue;
    this.userService.getById(this.currentUser.id).subscribe(data => {
      console.log("user by id ", data)
      // this.getAll(data.Entreprises[0].id)
      this.getAll(data.Entreprises[0].id)
    })
  }


  getAll(entrepriseId: number): void {
    this.ouvrageElemnentaireService.getAll(entrepriseId).subscribe(data => {
      this.ouvrageElementaire = data
      console.log("OuvrageElementaire", this.ouvrageElementaire)
    })
  }


  onCheck(idCout: number): void {
    if (this.selectedOuvrageElemIds.indexOf(idCout) !== -1) {
      this.selectedOuvrageElemIds.forEach((element, index) => {
        if (element == idCout) this.selectedOuvrageElemIds.splice(index, 1);
      });
    } else {
      this.selectedOuvrageElemIds.push(idCout)
    }
    console.log(this.selectedOuvrageElemIds);
  }


  createOuvrageElementaireDuDevis() {
    let prixOuvrage = 0;
    //boucle sur tous les ouvrages selectionner dans la modal
    this.selectedOuvrageElemIds.forEach((ouvrageElemId: any) => {
      //recupere les ouvrages grace a leurs id
      this.ouvrageElemnentaireService.getById(ouvrageElemId).subscribe(data => {
        //creer un ouvrageDuDevis avec les données de l'ouvrage
        const allDataOuvrageDevis = {...data}
        this.ouvrageElemnentaireService.createOuvrageElementaireDuDevis(allDataOuvrageDevis).subscribe(response => {
          //recupere l'id de l'ouvrageElemDuDevis qui viens d'etre creer, et
           data.OuvrageDuDeviId = response.OuvrageDuDevis?.id
          console.log(data.OuvrageDuDeviId)
          const ouvrageOuvrageElemDuDevis = {
            OuvrageDuDeviId: this.currentOuvrageId,
            OuvrElemDuDeviId: data.OuvrageDuDeviId,
          }
          console.log("OUVRAGECOUT",ouvrageOuvrageElemDuDevis)
          this.ouvrageElementaireCoutService.createOuvrageOuvrageElemDuDevis(ouvrageOuvrageElemDuDevis).subscribe()

          //boucle sur tous les couts qui appartiennent au ouvrage
          data.Couts.forEach((cout: any) => {
            //   //creer un coutDuDevis avec les données du cout
            //
            //   prixOuvrage += cout.prixUnitaire * (cout.OuvrageCout.ratio)
            //   console.log("prix de l'ouvrage ", prixOuvrage)
            //
               this.coutDuDevis = cout;
              this.coutDuDevis.fournisseur = cout.Fournisseur.commercialName
              this.coutDuDevis.remarque = cout.Fournisseur.remarque !== null ? cout.Fournisseur.remarque : ""
              //donne comme valeur undefined a l'id sinon le coutDuDevis sera creer avec l'id du Cout
              this.coutDuDevis.id = undefined
              this.coutDuDevis.type = cout.TypeCout.type
              this.coutDuDevis.categorie = cout.TypeCout.categorie
            //   //creer le coutDuDevis
              this.coutService.createCoutDuDevis(this.coutDuDevis).subscribe(responseCout => {
                const uRatio = `${cout.unite}/${this.dataSharingService.ouvrage.unite}`

                //     //creer l'OuvrageCoutDuDevis grace au reponse des requetes de creation des couts et de l'ouvrage
                const ouvrageCout = {
                  OuvrElemDuDeviId: response.OuvrageDuDevis?.id,
                  CoutDuDeviId: responseCout?.id,
                  ratio: 1,
                  uRatio: uRatio,

                }

            //     //creer l'ouvrageCoutDuDevis
              this.ouvrageElementaireCoutService.createOuvrageElemCoutDuDevis(ouvrageCout).subscribe()

          })
        })

      })


    })
  })
  }

  closeDialog() {
    // Renvoyez la valeur de selectedOuvrageIds lors de la fermeture du dialogListOuvrage
    this.dialogRef.close();
  }
}

