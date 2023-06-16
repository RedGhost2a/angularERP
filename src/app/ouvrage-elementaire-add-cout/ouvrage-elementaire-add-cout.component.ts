import {Component, Inject, Input, OnInit} from '@angular/core';
import {Cout} from "../_models/cout";
import {CoutDuDevis} from "../_models/cout-du-devis";
import {User} from "../_models/users";
import {OuvrageCout} from "../_models/ouvrageCout";
import {Ouvrage} from "../_models/ouvrage";
import {ActivatedRoute, Router} from "@angular/router";
import {CoutService} from "../_service/cout.service";
import {OuvrageService} from "../_service/ouvrage.service";
import {OuvrageCoutService} from "../_service/ouvrageCout.service";
import {UserService} from "../_service/user.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogComponent} from "../dialogListOuvrage/dialog.component";
import {OuvrageElementaireCoutService} from "../_service/ouvrage-elementaire-cout.service";
import {OuvrageElementaireCout} from "../_models/ouvrage-elementaire-cout";
import {OuvrageElementaire} from "../_models/ouvrage-elementaire";
import {OuvrageElementaireService} from "../_service/ouvrage-elementaire.service";

@Component({
  selector: 'app-ouvrage-elementaire-add-cout',
  templateUrl: './ouvrage-elementaire-add-cout.component.html',
  styleUrls: ['./ouvrage-elementaire-add-cout.component.scss']
})
export class OuvrageElementaireAddCoutComponent implements OnInit {

  @Input() listCout!: Cout[]
  coutOuvrage!: Cout;
  coutChecked: number[] = [];
  ouvrageId!: number
  columnsToDisplay = ["checkBox", "type", "categorie", "designation", "unite", "prixUnitaire", "fournisseur",
    // "remarque"
  ];
  coutDuDevis!: CoutDuDevis;
  currentUser!:User;
  currentOuvrageId!:number;
  ouvrageCout !: OuvrageElementaireCout ;
  initialData!: OuvrageElementaire;


  constructor(private route: ActivatedRoute, private coutService: CoutService,
              private ouvrageService: OuvrageService, private ouvrageCoutService: OuvrageElementaireCoutService,
              private userService : UserService,@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<DialogComponent>,
              private router: Router,
              private ouvrageElementaireCoutService:OuvrageElementaireCoutService,
              private ouvrageElemnentaireService: OuvrageElementaireService,
              ) {

    this.initialData = this.data;
  }


  ngOnInit(): void {
    // console.log('idi',this.initialData.OuvrageDuDevis[0].id)
    this.route.params.subscribe(params =>{
      console.log("params",params)
      this.currentOuvrageId =  +params['id']
      // console.log("current ouvrage id ",this.currentOuvrageId)
    })
    this.currentUser = this.userService.userValue;
    this.userService.getById(this.currentUser.id).subscribe(data =>{
      console.log("user by id ", data)
      this.getAll(data.Entreprises[0].id)
    })
  }

  getAll(entrepriseId: number): void {
    this.coutService.getAll(entrepriseId).subscribe(data => {
      this.listCout = data
      console.log("dATA", data)
    })
  }


  addCoutOuvrage() {

    if (this.router.url.includes('/ouvrages-elementaires-du-devis')){
    this.createOuvrageElementaireDuDevis()
  }else {
      console.log("id de l'ouvrage courant", this.currentOuvrageId)
      this.coutChecked.forEach(cout => {
        console.log("valeur de cout", cout)
        this.ouvrageCout = {
          OuvragesElementaireId: this.initialData.id,
          CoutId: cout,
          // uRatio: `${this.initialData.unite}`
        }
        console.log("this.ouvrageCout", this.ouvrageCout)

        this.ouvrageCoutService.create(this.ouvrageCout).subscribe()


      })
    }
  }
  createOuvrageElementaireDuDevis(){
    console.log()
    this.initialData.OuvrageDuDevis[0].id
    this.coutChecked.forEach((ouvrageElemId: any) => {
      this.coutService.getById(ouvrageElemId).subscribe(response=>{
          console.log("respone,",response)
        this.coutDuDevis = response;
        this.coutDuDevis.fournisseur = response.Fournisseur.commercialName
        this.coutDuDevis.remarque = response.Fournisseur.remarque !== null ? response.Fournisseur.remarque : ""
        this.coutDuDevis.type = response.TypeCout.type
        this.coutDuDevis.categorie = response.TypeCout.categorie
        this.coutService.createCoutDuDevis(response).subscribe(response=>{
          const ouvrageCout = {
                          OuvrElemDuDeviId: this.initialData.id,
                          CoutDuDeviId: response?.id,

                        }
          this.ouvrageElementaireCoutService.createOuvrageElemCoutDuDevis(ouvrageCout).subscribe(this.ngOnInit)

        })
      })



    })
  }


  // createOuvrageElementaireDuDevis() {
  //   let prixOuvrage = 0;
  //   //boucle sur tous les ouvrages selectionner dans la modal
  //   this.coutChecked.forEach((ouvrageElemId: any) => {
  //     //recupere les ouvrages grace a leurs id
  //     console.log("ouvrageElemId",ouvrageElemId)
  //     this.ouvrageElemnentaireService.getOuvrageDuDevisById(ouvrageElemId).subscribe(data => {
  //       //creer un ouvrageDuDevis avec les données de l'ouvrage
  //       const allDataOuvrageDevis = {...data}
  //       this.ouvrageElemnentaireService.createOuvrageElementaireDuDevis(allDataOuvrageDevis).subscribe(response => {
  //         //recupere l'id de l'ouvrageElemDuDevis qui viens d'etre creer, et
  //         data.OuvrageDuDeviId = response.OuvrageDuDevis?.id
  //         console.log(data.OuvrageDuDeviId)
  //         const ouvrageOuvrageElemDuDevis = {
  //           OuvrageDuDeviId: this.currentOuvrageId,
  //           OuvrElemDuDeviId: data.OuvrageDuDeviId,
  //         }
  //         console.log("OUVRAGECOUT",ouvrageOuvrageElemDuDevis)
  //         this.ouvrageElementaireCoutService.createOuvrageOuvrageElemDuDevis(ouvrageOuvrageElemDuDevis).subscribe()
  //
  //         //boucle sur tous les couts qui appartiennent au ouvrage
  //         data.Couts.forEach((cout: any) => {
  //           //   //creer un coutDuDevis avec les données du cout
  //           //
  //           //   prixOuvrage += cout.prixUnitaire * (cout.OuvrageCout.ratio)
  //           //   console.log("prix de l'ouvrage ", prixOuvrage)
  //           //
  //           this.coutDuDevis = cout;
  //           this.coutDuDevis.fournisseur = cout.Fournisseur.commercialName
  //           this.coutDuDevis.remarque = cout.Fournisseur.remarque !== null ? cout.Fournisseur.remarque : ""
  //           //donne comme valeur undefined a l'id sinon le coutDuDevis sera creer avec l'id du Cout
  //           this.coutDuDevis.id = undefined
  //           this.coutDuDevis.type = cout.TypeCout.type
  //           this.coutDuDevis.categorie = cout.TypeCout.categorie
  //           //   //creer le coutDuDevis
  //           this.coutService.createCoutDuDevis(this.coutDuDevis).subscribe(responseCout => {
  //             //     //creer l'OuvrageCoutDuDevis grace au reponse des requetes de creation des couts et de l'ouvrage
  //             const ouvrageCout = {
  //               OuvrElemDuDeviId: response.OuvrageDuDevis?.id,
  //               CoutDuDeviId: responseCout?.id,
  //
  //             }
  //
  //             //     //creer l'ouvrageCoutDuDevis
  //             this.ouvrageElementaireCoutService.createOuvrageElemCoutDuDevis(ouvrageCout).subscribe()
  //
  //           })
  //         })
  //
  //       })
  //
  //
  //     })
  //   })
  // }

  closeDialog() {
    // Renvoyez la valeur de selectedOuvrageIds lors de la fermeture du dialogListOuvrage
    this.dialogRef.close();
  }

  onCheck(idCout: number): void {
    if (this.coutChecked.indexOf(idCout) !== -1) {
      this.coutChecked.forEach((element, index) => {
        if (element == idCout) this.coutChecked.splice(index, 1);
      });
    } else {
      this.coutChecked.push(idCout)
    }
    console.log(this.coutChecked);
  }


}

