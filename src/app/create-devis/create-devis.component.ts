import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LotService} from "../_service/lot.service"
import {ActivatedRoute, Router} from "@angular/router";
import {Toastr, TOASTR_TOKEN} from "../_service/toastr.service";
import {SousLotService} from "../_service/sous-lot.service";
import {DevisService} from "../_service/devis.service";
import {DataSharingService} from "../_service/data-sharing-service.service";
import {OuvrageService} from "../_service/ouvrage.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../dialog/dialog.component";
import {Lot} from "../_models/lot";
import {SousLot} from "../_models/sous-lot";
import {Ouvrage} from "../_models/ouvrage";
import {SousLotOuvrage} from "../_models/sousLotOuvrage";
import {SousLotOuvrageService} from "../_service/sous-lot-ouvrage.service";
import {CoutService} from "../_service/cout.service";
import {CoutDuDevis} from "../_models/cout-du-devis";
import {SousDetailPrixService} from "../_service/sous-detail-prix.service";
import {OuvrageCout} from "../_models/ouvrageCout";
import {OuvrageCoutService} from "../_service/ouvrageCout.service";
import {Cout} from "../_models/cout";
import {OuvrageCoutDuDevis} from "../_models/ouvrageCoutDuDevis";
import {OuvrageDuDevis} from "../_models/ouvrage-du-devis";


@Component({
  selector: 'app-create-devis',
  templateUrl: './create-devis.component.html',
  styleUrls: ['./create-devis.component.scss']
})
export class CreateDevisComponent implements OnInit {

  lotFraisDeChantier!: Lot;
  form!: FormGroup;
  testLots!: Lot[];
  showForm = false;
  isLot: boolean = false;
  devisId!: number;
  curentLotId!: number;
  currentSousLotId!: number;
  listOuvrage!: Ouvrage[];
  selectedOuvrageIds: number [] = [];
  hiddenChildren = new Map<number, boolean>();
  expandedLotId!: number | undefined;
  prixOuvrage: { prix: any; id: any }[] = [];
  prixOuvrageFraisDeChantier: { prix: any; id: any }[] = [];
  myFormGroup!: FormGroup;
  sommeLot: { prixLot: any; idLot: any }[] = [];
  prixDevis: number = 0;
  coutDuDevis!: CoutDuDevis;
  sousLotOuvrageDuDevis!: SousLotOuvrage
  resultBeneficeLots!: number;
  resultAleasLots!: number;
  resultBeneficeFraisDeChantier!: number ;
  resultAleasFraisDeChantier!: number;
  dataLoad: boolean= false;

//TODO ON NE PEUT METTRE QUE UN SEUL ET MEME OUVRAGE PAR SOUS_LOT; //

  constructor(private lotService: LotService,
              private route: ActivatedRoute,
              private router: Router,
              @Inject(TOASTR_TOKEN) private toastr: Toastr,
              private sousLotService: SousLotService,
              private devisService: DevisService,
              private dataSharingService: DataSharingService,
              private changeDetectorRef: ChangeDetectorRef,
              private ouvrageService: OuvrageService,
              private sousLotOuvrageService: SousLotOuvrageService,
              public dialog: MatDialog,
              private coutService: CoutService,
              private sousDetailPrixService : SousDetailPrixService,
              private ouvrageCoutService : OuvrageCoutService
  ) {
    this.expandedLotId = undefined;
  }

  ngOnInit() {
    // this.sousDetailPrixService.setCoefEqui(this.coutTotal() / this.prixDevis)
    this.route.params.subscribe(params => {
      this.devisId = +params['id']
      this.form = new FormGroup({
        designation: new FormControl("", [Validators.required, Validators.minLength(3)]),
        devisId: new FormControl(this.devisId)
      });
    });
    this.getLotFraisDeChantier();
    this.getAllLots();
    this.formQuantityOuvrage()


  }

  // quantityCout(quantityOuvrage:number | undefined, cout:Cout):void{
  //   if(quantityOuvrage && cout.OuvrageCoutDuDevis?.ratio){
  //     cout.quantite = cout.OuvrageCoutDuDevis.ratio * quantityOuvrage
  //   }
  // }
  //
  quantityCout(quantityOuvrage:number, sousLot:SousLot):void{
    console.log("quantityCout")
    if(quantityOuvrage){
    console.log("quantityCout dans le premier IF")
      sousLot.OuvrageDuDevis.forEach(sousLot=>{
        sousLot.CoutDuDevis?.forEach(coutDuDevis=>{
          if(coutDuDevis.OuvrageCoutDuDevis && coutDuDevis.OuvrageCoutDuDevis.ratio !== undefined){
            console.log("cout du devis", coutDuDevis)
            console.log("RATIO OUVRAGECOUTDUDEVIS",coutDuDevis.OuvrageCoutDuDevis.ratio )
            coutDuDevis.quantite = coutDuDevis.OuvrageCoutDuDevis.ratio * quantityOuvrage
            // this.getAllLots()
          }
        })
      })

    }
  }

  fraisGeneraux(): number {
    if (this.lotFraisDeChantier.prix !== undefined) {
      return (this.lotFraisDeChantier.prix + this.prixDevis) * 0.2
    }
    return 0
  }
  moyenneBenefice():number{
  return (this.resultBeneficeFraisDeChantier + this.resultBeneficeLots) / 2
  }
  moyenneAleas():number{
  return (this.resultAleasLots + this.resultAleasFraisDeChantier) / 2
  }

  totalDepense():number{
    if (this.fraisGeneraux()!==0) {
      return this.fraisGeneraux()+this.prixDevis
    }
    return 0
  }

  moyenneBeneficeAleasTotal(): number{
    const beneficeTotal = this.resultBeneficeFraisDeChantier + this.resultBeneficeLots
    const aleasTotal = this.resultAleasLots + this.resultAleasFraisDeChantier
    return (beneficeTotal + aleasTotal) / 2
  }


  coutTotal():number{
    // <p>cout total total debourses sec + frais de chantier + frais generaux</p>
    if(this.fraisGeneraux() !== 0 && this.lotFraisDeChantier.prix !== undefined){
      return this.lotFraisDeChantier.prix + this.prixDevis + this.fraisGeneraux()
    }
    return 0
  }

  coefEquilibre():number{
    if(this.coutTotal()!==0 && this.lotFraisDeChantier.prix){
      this.sousDetailPrixService.coefEqui = this.coutTotal() / this.prixDevis
      return this.coutTotal() / this.prixDevis
    }
    return 0
  }


  formQuantityOuvrage(): void {
    this.myFormGroup = new FormGroup({
      quantityOuvrage: new FormControl(),
    });
  }

  getSommeDevis(): void {
    this.sommeLot = this.testLots
      .map(lot => ({
        idLot: lot.id,
        prixLot: lot.prix
      }))
    this.prixDevis = this.sommeLot.reduce(function (acc, obj) {
      return acc + obj.prixLot;
    }, 0);
    console.log(this.prixDevis)
  }


  getSommeSousLot(sousLot: SousLot, lot: Lot) {
    this.sousLotOuvrageService.getSommeSousLot(sousLot.id).subscribe(data => {
      console.log("sousLot prix : ", sousLot.prix)
      sousLot.prix = data
      lot.prix = 0;
      for (let sub of lot.SousLots) {
        lot.prix += sub.prix
      }
      console.log("lot.prix", lot.prix, "lot id ", lot.id)
      this.getSommeDevis()
    })
  }

//quand la valeur de l'input quantity change

  quantityChange(event: any, sousLotOuvrage: SousLotOuvrage | undefined, sousLot: SousLot, lot: Lot, prixOuvrages: { id: 0, prix: 0 }[]) {
    // this.prixOuvrage = []
    console.log('quantity:', event);
    console.log('this prixOuvrage', this.prixOuvrage);
    //verifie que le sous lot contient au moins un ouvrage
    this.quantityCout(event,sousLot)
    if (sousLotOuvrage !== undefined && sousLotOuvrage.id) {
      console.log("console log de l'objet sousLotOuvrage", sousLotOuvrage)
      //si la valeur de l'input est superieur a 0
      if (event > 0) {
        //boucle dans le tableau de prixOuvrage qui correspond au prix unitaire de l'ouvrage
        // for (let element of this.prixOuvrage) {
        for (let element of prixOuvrages) {
          //verifie si l'id du tableau de prix est egale a l'id de sousLotOuvrage
          if (element.id === sousLotOuvrage.OuvrageDuDeviId) {
            //si oui on attribut le nouveau prix de l'ouvrage au sousLotOuvrage
            sousLotOuvrage.prixOuvrage = element.prix * event
          }
        }
        //on donne la quantité a l'attribut de mon model
        sousLotOuvrage.quantityOuvrage = event;
      } else {
        //si la valeur est inferieur a 0 on lui donne 1 comme valeur
        sousLotOuvrage.quantityOuvrage = 1
        //on update la nouvelle quantité et le nouveau prix de l'ouvrage au sousLotOuvrage
        this.sousLotOuvrageService.update(sousLotOuvrage.id, sousLotOuvrage).subscribe(() => {
          this.getSommeSousLot(sousLot, lot)
        })
      }

      //on update la nouvelle quantité et le nouveau prix de l'ouvrage au sousLotOuvrage
      console.log("console from quantityChange", sousLotOuvrage)
      this.sousLotOuvrageService.update(sousLotOuvrage.id, sousLotOuvrage).subscribe(() => {

        this.getSommeSousLot(sousLot, lot)
      })
      console.log("sousLotOuvrage", sousLotOuvrage)
    }
  }


  getSommeOuvrageFraisDeChantier(): void {
    console.log("console from getSommeOuvrageFraisDeChantier  ", this.lotFraisDeChantier.SousLots)
    this.prixOuvrageFraisDeChantier = this.lotFraisDeChantier.SousLots
      .flatMap(sousLot => sousLot.OuvrageDuDevis)
      .filter(ouvrage => ouvrage)
      .map(ouvrage => ({
        id: ouvrage?.id,
        prix: ouvrage?.CoutDuDevis && ouvrage.CoutDuDevis.reduce((acc, ct) => acc + ct.prixUnitaire, 0)
      }));

    console.log("tableau de prix des ouvrage", this.prixOuvrageFraisDeChantier)
  }

  getSommeOuvrage(): void {
    this.prixOuvrage = this.testLots
      .flatMap(lot => lot.SousLots)
      .filter(sousLot => sousLot)
      .flatMap(sousLot => sousLot.OuvrageDuDevis)
      .filter(ouvrage => ouvrage)
      .map(ouvrage => ({
        id: ouvrage?.id,
        prix: ouvrage?.CoutDuDevis && ouvrage.CoutDuDevis.reduce((acc, ct) => acc + ct.prixUnitaire * (ct.OuvrageCoutDuDevis?.ratio || 1), 0)
      }));

    console.log("tableau de prix des ouvrage", this.prixOuvrage)
  }


  //recuperation de tous les lots du devis SAUF les lot "Frais de chantier" pour l'onglet DEVIS;
  getAllLots() {
    // this.prixDevis = 0;
    this.devisService.getByIdExceptFrais(this.devisId).subscribe(data => {

      console.log("console log de getalllots  LOT DATA:", data.Lots)
      let nombreOuvrage = 0
      this.resultBeneficeLots = 0;
      this.resultAleasLots = 0;
      this.testLots = data.Lots;
      this.testLots.forEach(lot => {
        lot.SousLots.forEach(sousLot => {
          sousLot.prix = 0;
          console.log("sousLot", sousLot)

          this.getSommeSousLot(sousLot, lot)
          sousLot.OuvrageDuDevis.forEach(ouvrage => {
          console.log("OUVRAGE", ouvrage.SousLotOuvrage?.quantityOuvrage)
            // console.log()
            // this.quantityCout(ouvrage.SousLotOuvrage?.quantityOuvrage,ouvrage)
            nombreOuvrage++;
            this.resultBeneficeLots += ouvrage.benefice
            this.resultAleasLots += ouvrage.aleas

          })
          // this.moyenneBenefice(nombreOuvrage,this.resultBeneficeLots)
        })
        // console.log("get all lots : ", lot.prix)
      });
      // console.log("console log resultBenefice :", this.resultBeneficeLots)
      // console.log("console log nombre d ouvrage :", nombreOuvrage)
      this.resultBeneficeLots = this.resultBeneficeLots / nombreOuvrage
      this.resultAleasLots = this.resultAleasLots / nombreOuvrage
      // console.log("console log de DATA LOT : ", data)
      //recuperation de tous les ouvrages de l'entreprise
      this.getAllOuvrage(data.EntrepriseId);
      this.getSommeOuvrage()
      // this.dataLoad = true
    })
  }


  //recuperation du lot generer automatiquement a la creation du devis, avec comme designation
  //"Frais de chantier"

  getLotFraisDeChantier(): void {
    this.devisService.getLotFraisDeChantier(this.devisId).subscribe(data => {
      let nombreOuvrage = 0;
      this.resultAleasFraisDeChantier = 0;
      this.resultBeneficeFraisDeChantier = 0;
      this.lotFraisDeChantier = data.Lots[0];
      // console.log("console log frais de chantier:", data)
      this.lotFraisDeChantier.SousLots.forEach(sousLot => {
        sousLot.prix = 0;
        this.getSommeSousLot(sousLot, this.lotFraisDeChantier)
        sousLot.OuvrageDuDevis.forEach(ouvrage =>{
          nombreOuvrage++;
          this.resultBeneficeFraisDeChantier += ouvrage.benefice
          this.resultAleasFraisDeChantier += ouvrage.aleas
        })
      })
      this.resultBeneficeFraisDeChantier = this.resultBeneficeFraisDeChantier / nombreOuvrage
      this.resultAleasFraisDeChantier = this.resultAleasFraisDeChantier / nombreOuvrage
      this.getAllOuvrage(data.EntrepriseId);
      this.getSommeOuvrageFraisDeChantier()
    })
  }

  getAllOuvrage(id: number) {
    // console.log("console log id get all ouvrage", id)
    this.ouvrageService.getAll(id).subscribe(data => {
      // console.log("Ouvrage de l'entreprise : ", data)
      this.listOuvrage = data;
    })
  }

  createLOT(): void {
    //const currentLot = this.form.getRawValue();
    // console.log("console log du formulaire ", this.form.getRawValue())
    this.lotService.create(this.form.getRawValue()).subscribe(() => {
      this.getAllLots()
      this.getLotFraisDeChantier()
      this.success("Nouveau lot crée!")

    })
  }


  createSousLot(): void {
    // console.log("console expendedLotid", this.expandedLotId)
    // console.log("console.log de currentLotId", this.curentLotId)
    // console.log("console.log formulaire create sous lot", this.form.getRawValue())
    this.sousLotService.create(this.form.getRawValue(), this.curentLotId).subscribe(() => {
      this.getAllLots()
      this.getLotFraisDeChantier()
    })
  }


  deleteLot(id: number): void {
    this.lotService.deleteByID(id).subscribe(() => {
      this.getAllLots()
      this.success("Lot effacer!")
    })
  }

  deleteSousLot(id: number): void {
    this.sousLotService.deleteByID(id).subscribe(() => {
      this.getAllLots()
      this.success("sous-lot effacer!")

    });
  }


  openDialog(sousLotId: number) {
    this.dialog.open(DialogComponent, {
      data: this.listOuvrage,
      width: '90%',
      height: '70%'
    }).afterClosed().subscribe(result => {
      if (result) {
        this.selectedOuvrageIds = result.selectedOuvrageIds;
        //this.createOuvrageSousLot(sousLotId)
        // console.log('debut de la fonction create ouvrage du devis')
        this.createOuvrageDuDevis(sousLotId)
        // console.log('fin de la fonction create ouvrage du devis')
      } else {
        // Afficher un message d'erreur si aucun sous-lot n'est sélectionné
        this.warning("error",);
      }

    });
  }

  createOuvrageDuDevis(sousLotId: number) {
    //boucle sur tous les ouvrages selectionner dans la modal
    this.selectedOuvrageIds.forEach((ouvrageId: any) => {
      //recupere les ouvrages grace a leurs id
      this.ouvrageService.getById(ouvrageId).subscribe(data => {
        //creer un ouvrageDuDevis avec les données de l'ouvrage
        this.ouvrageService.createOuvrageDuDevis(data).subscribe(response => {
          //recupere l'id de l'ouvrageDuDevis qui viens d'etre creer, et
          // data.OuvrageDuDeviId = response.OuvrageDuDevis?.id
          //boucle sur tous les couts qui appartiennent au ouvrage
          data.Couts.forEach((cout: any) => {
            //creer un coutDuDevis avec les données du cout
            this.coutDuDevis = cout;
            this.coutDuDevis.fournisseur = cout.Fournisseurs[0].commercialName
            this.coutDuDevis.remarque = cout.Fournisseurs[0].remarque !== null ? cout.Fournisseurs[0].remarque : ""
            //donne comme valeur undefined a l'id sinon le coutDuDevis sera creer avec l'id du Cout
            this.coutDuDevis.id = undefined
            this.coutDuDevis.type = cout.TypeCout.type
            this.coutDuDevis.categorie = cout.TypeCout.categorie
            //creer le coutDuDevis
            this.coutService.createCoutDuDevis(this.coutDuDevis).subscribe(responseCout => {
              //creer l'OuvrageCoutDuDevis grace au reponse des requetes de creation des couts et de l'ouvrage
              const ouvrageCout: OuvrageCoutDuDevis = {
                OuvrageDuDeviId: response.OuvrageDuDevis?.id,
                CoutDuDeviId: responseCout?.id,
                ratio: cout.OuvrageCout.ratio,
                uRatio: cout.OuvrageCout.uRatio,
              }
              //creer l'ouvrageCoutDuDevis
              this.ouvrageCoutService.createOuvrageCoutDuDevis(ouvrageCout).subscribe()

            })

          })
          //creer le model de sousLotOuvrageDuDevis
          this.sousLotOuvrageDuDevis = {
            SousLotId: sousLotId,
            OuvrageDuDeviId: response.OuvrageDuDevis?.id,
            prixOuvrage: 0,
            quantityOuvrage: 0
          }

          //creer le sousLotOuvrageDuDevis
          this.ouvrageService.createSousLotOuvrageForDevis(this.sousLotOuvrageDuDevis).subscribe(() => {
            //rafraichi la data
            this.getAllLots()
            this.getLotFraisDeChantier()
          })
        })

      })

    });
  }


  success(message: string): void {
    this.toastr.success(message, "Succès");
  }

  warning(message: string): void {
    this.toastr.warning(message, "Attention");
  }


  onSubmit() {
    if (this.isLot) {
      this.createSousLot()
    } else {
      this.createLOT()
    }
    this.showForm = false;
  }


  setExpandedLotId(id: number) {
    console.log("set exp", id)
    if (this.expandedLotId === id) {
      // si l'identifiant du lot déplié est le même que celui du lot actuellement déplié, on replie le lot
      this.expandedLotId = undefined;
    } else {
      // sinon, on déplie le lot
      this.expandedLotId = id;
    }
  }

}




