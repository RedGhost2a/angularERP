import {ChangeDetectorRef, Component, Inject, Injectable, OnInit,} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LotService} from "../_service/lot.service"
import {ActivatedRoute, Router} from "@angular/router";
import {Toastr, TOASTR_TOKEN} from "../_service/toastr.service";
import {SousLotService} from "../_service/sous-lot.service";
import {DevisService} from "../_service/devis.service";
import {DataSharingService} from "../_service/data-sharing-service.service";
import {OuvrageService} from "../_service/ouvrage.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../dialogListOuvrage/dialog.component";
import {Lot} from "../_models/lot";
import {SousLot} from "../_models/sous-lot";
import {Ouvrage} from "../_models/ouvrage";
import {SousLotOuvrage} from "../_models/sousLotOuvrage";
import {SousLotOuvrageService} from "../_service/sous-lot-ouvrage.service";
import {CoutService} from "../_service/cout.service";
import {CoutDuDevis} from "../_models/cout-du-devis";
import {SousDetailPrixService} from "../_service/sous-detail-prix.service";
import {OuvrageCoutService} from "../_service/ouvrageCout.service";
import {OuvrageCoutDuDevis} from "../_models/ouvrageCoutDuDevis";
import {Devis} from "../_models/devis";
import {DevisExport} from "../_models/devisExport";
import {FormOuvrageComponent} from "../form-ouvrage/form-ouvrage.component";

// import {Json2CsvTransform} from "json2csv";

@Component({
  selector: 'app-create-devis',
  templateUrl: './create-devis.component.html',
  styleUrls: ['./create-devis.component.scss']
})
//, AfterContentChecked
@Injectable()
export class CreateDevisComponent implements OnInit {
  isFocused: boolean = false;

  lotFraisDeChantier!: Lot;
  form!: FormGroup;
  testLots!: Lot[];
  showForm = false;
  isLot: boolean = false;
  devisId!: number;
  devis = new Devis;
  curentLotId!: number;
  currentSousLotId!: number;
  listOuvrage!: Ouvrage[];
  listOuvrageFraisDeChantier!: Ouvrage[];
  selectedOuvrageIds: number [] = [];
  hiddenChildren = new Map<number, boolean>();
  expandedLotId!: number | undefined;
  prixOuvrage: { prix: any; id: any }[] = [];
  prixOuvrageFraisDeChantier: { prix: any; id: any }[] = [];
  myFormGroup!: FormGroup;
  myFormGroupPrix!: FormGroup;
  sommeLot: { prixLot: any; idLot: any }[] = [];
  prixDevis: number = 0;
  coutDuDevis!: CoutDuDevis;
  sousLotOuvrageDuDevis!: SousLotOuvrage
  resultBeneficeLots!: number;
  resultAleasLots!: number;
  resultBeneficeFraisDeChantier!: number;
  resultAleasFraisDeChantier!: number;
  dataLoad: boolean = false;
  prixUnitaireCalculeHt: number = 0;
  prixVenteHt!: number;
  prixEquilibre!: number;
  prixEquilibres: number[] = [];
  coefEqui!: number;
  fraisDeChantier = new Devis()
  devisExport: DevisExport[] = []
  // fraisDeChantier = new Devis()


//TODO ON NE PEUT METTRE QUE UN SEUL ET MEME OUVRAGE PAR SOUS_LOT; //

  constructor(private lotService: LotService,
              private route: ActivatedRoute,
              private router: Router,
              @Inject(TOASTR_TOKEN) private toastr: Toastr,
              private sousLotService: SousLotService,
              private devisService: DevisService,
              private changeDetectorRef: ChangeDetectorRef,
              private ouvrageService: OuvrageService,
              private sousLotOuvrageService: SousLotOuvrageService,
              public dialog: MatDialog,
              private coutService: CoutService,
              private sousDetailPrixService: SousDetailPrixService,
              private ouvrageCoutService: OuvrageCoutService,
              public sharedData: DataSharingService,
              private changeDetector: ChangeDetectorRef,
  ) {
    this.expandedLotId = undefined;
  }

  ngOnInit() {

    // this.sousDetailPrixService.setCoefEqui(this.coutTotal() / this.prixDevis)
    this.route.params.subscribe(params => {
      this.devis.id = +params['id'];
      this.devisId = +params['id']
      this.form = new FormGroup({
        designation: new FormControl("", [Validators.required, Validators.minLength(3)]),
        devisId: new FormControl(this.devisId)
      });
    });
    this.formQuantityOuvrage()
    this.formPrixArrondiOuvrage()
    this.getLotFraisDeChantier();
    this.getAllLots();
    this.dataLoad = false;

    this.getDevisExport()


    // quantityCout(quantityOuvrage: number, sousLot: SousLot): void {
    //   console.log("quantityCout")
    //   if (quantityOuvrage) {
    //     console.log("quantityCout dans le premier IF")
    //     sousLot.OuvrageDuDevis.forEach(sousLot => {
    //       sousLot.CoutDuDevis?.forEach(coutDuDevis => {
    //         if (coutDuDevis.OuvrageCoutDuDevis && coutDuDevis.OuvrageCoutDuDevis.ratio !== undefined) {
    //           console.log("cout du devis", coutDuDevis)
    //           console.log("RATIO OUVRAGECOUTDUDEVIS", coutDuDevis.OuvrageCoutDuDevis.ratio)
    //           coutDuDevis.quantite = coutDuDevis.OuvrageCoutDuDevis.ratio * quantityOuvrage
    //           // this.getAllLots()
    //         }
    //       })
    //     })
    //
    //   }
  }

  fraisGeneraux(): void {
    if (this.lotFraisDeChantier.prix !== undefined) {
      this.devis.fraisGeneraux = (this.lotFraisDeChantier.prix + this.devis.debourseSecTotal) * 0.2
      // return (this.lotFraisDeChantier.prix + this.prixDevis) * 0.2
      this.coutTotal();
      this.totalDepense()
    }
    // return 0
  }

  moyenneBenefice(): void {
    this.devis.moyenneBenefice = (this.resultBeneficeFraisDeChantier + this.resultBeneficeLots) / 2
    // return (this.resultBeneficeFraisDeChantier + this.resultBeneficeLots) / 2
  }

  moyenneAleas(): void {
    // return (this.resultAleasLots + this.resultAleasFraisDeChantier) / 2
    this.devis.moyenneAleas = (this.resultAleasLots + this.resultAleasFraisDeChantier) / 2
  }

  totalDepense(): void {
    // if (this.fraisGeneraux() !== 0) {
    this.devis.totalDepense = this.devis.fraisGeneraux + this.devis.debourseSecTotal
    // return this.fraisGeneraux() + this.prixDevis
  }

  // return 0
  // }

  moyenneBeneficeAleasTotal(): void {
    this.devis.moyenneBeneficeAleas = this.devis.moyenneAleas + this.devis.moyenneBenefice
    // const beneficeTotal = this.resultBeneficeFraisDeChantier + this.resultBeneficeLots
    // const aleasTotal = this.resultAleasLots + this.resultAleasFraisDeChantier
    // return (beneficeTotal + aleasTotal) / 2
  }


  coutTotal(): void {
    // <p>cout total total debourses sec + frais de chantier + frais generaux</p>
    if (this.lotFraisDeChantier.prix !== undefined) {
      this.devis.coutTotal = this.lotFraisDeChantier.prix + this.devis.debourseSecTotal + this.devis.fraisGeneraux
      // return this.lotFraisDeChantier.prix + this.prixDevis + this.fraisGeneraux()
      this.coefEquilibre()
    }
    // return 0
  }

  coefEquilibre(): void {
    console.log("this.devis.coutTotal", this.devis.coutTotal)
    console.log("this.devis.debourseSecTotal", this.devis.debourseSecTotal)
    if (this.lotFraisDeChantier.prix) {
      this.devis.coeffEquilibre = this.devis.coutTotal / this.devis.debourseSecTotal
      localStorage.setItem("coef", this.devis.coeffEquilibre.toString())
    }
    // return 0
  }


  formQuantityOuvrage(): void {
    this.myFormGroup = new FormGroup({
      quantityOuvrage: new FormControl(),
    });
  }

  formPrixArrondiOuvrage(): void {
    this.myFormGroupPrix = new FormGroup({
      prixArrondi: new FormControl(),
    });
  }

  getSommeDevis(): void {
    this.sommeLot = this.testLots
      .map(lot => ({
        idLot: lot.id,
        prixLot: lot.prix
      }))
    // this.prixDevis = this.sommeLot.reduce(function (acc, obj) {
    this.devis.debourseSecTotal = this.sommeLot.reduce(function (acc, obj) {
      return acc + obj.prixLot;
    }, 0);

    this.fraisGeneraux()
    this.allCalculOuvrage();
    this.allCalculOuvrageFraisDeChantier()
  }

  allCalculOuvrage(): void {
    this.devis.prixEquiHT = 0;
    this.devis.beneficeInEuro = 0;
    this.devis.aleasInEuro = 0;
    this.devis.prixCalcHT = 0;
    this.devis.prixVenteHT = 0;
    this.devis.beneficeAleasTotal = 0;
  console.log('test lot ',this.testLots)
    this.testLots.forEach(lot => {
      lot.SousLots.forEach(sousLot => {
        sousLot.OuvrageDuDevis.forEach(async ouvrageDuDevis => {
          if (ouvrageDuDevis.SousLotOuvrage) {
            // ouvrageDuDevis.SousLotOuvrage.prixUniArrondi = 0;
            await this.sharedData.prixEquilibreHT(ouvrageDuDevis.SousLotOuvrage)
            await this.sharedData.prixUnitaireHT(ouvrageDuDevis.SousLotOuvrage)
            await this.sharedData.prixCalculeHT(ouvrageDuDevis.SousLotOuvrage, ouvrageDuDevis.benefice, ouvrageDuDevis.aleas)
            await this.sharedData.prixUnitaireCalculeHT(ouvrageDuDevis.SousLotOuvrage)
            await this.sharedData.beneficePercentToEuro(ouvrageDuDevis.SousLotOuvrage, ouvrageDuDevis.benefice)
            await this.sharedData.aleasPercentToEuro(ouvrageDuDevis.SousLotOuvrage, ouvrageDuDevis.aleas)
            // await this.sharedData.
            //ouvrageDuDevis.SousLotOuvrage.prixUniArrondi = ouvrageDuDevis.SousLotOuvrage.prixUniCalcHT

            await this.testAsync(ouvrageDuDevis)

            // console.log("prix unitaire arrondi ", ouvrageDuDevis.SousLotOuvrage.prixUniVenteHT)
            // console.log("prix unitaire calcule ", ouvrageDuDevis.SousLotOuvrage.prixUniCalcHT)
            // console.log("prix arrondi ", ouvrageDuDevis.SousLotOuvrage.prixVenteHT)
            // this.sommePrixArrondi(ouvrageDuDevis.SousLotOuvrage)
            this.devis.prixVenteHT += ouvrageDuDevis.SousLotOuvrage.prixVenteHT
            this.devis.prixEquiHT += ouvrageDuDevis.SousLotOuvrage.prixEquiHT
            this.devis.beneficeInEuro += ouvrageDuDevis.SousLotOuvrage.beneficeInEuro
            this.devis.aleasInEuro += ouvrageDuDevis.SousLotOuvrage.aleasInEuro
            this.devis.prixCalcHT += ouvrageDuDevis.SousLotOuvrage.prixCalcHT
            this.devis.beneficeAleasTotal = this.devis.prixVenteHT - this.devis.prixEquiHT
          }

        })

      })
    })
    console.log("this.devis", this.devis)
  }

  allCalculOuvrageFraisDeChantier(): void {
    this.fraisDeChantier.prixEquiHT = 0;
    this.fraisDeChantier.beneficeInEuro = 0;
    this.fraisDeChantier.aleasInEuro = 0;
    this.fraisDeChantier.prixCalcHT = 0;
    this.fraisDeChantier.prixVenteHT = 0;
    this.fraisDeChantier.beneficeAleasTotal = 0;

    this.lotFraisDeChantier.SousLots.forEach(sousLot => {
      sousLot.OuvrageDuDevis.forEach(async ouvrageDuDevis => {
        if (ouvrageDuDevis.SousLotOuvrage) {
          // ouvrageDuDevis.SousLotOuvrage.prixUniArrondi = 0;
          await this.sharedData.prixEquilibreHT(ouvrageDuDevis.SousLotOuvrage)
          await this.sharedData.prixUnitaireHT(ouvrageDuDevis.SousLotOuvrage)
          await this.sharedData.prixCalculeHT(ouvrageDuDevis.SousLotOuvrage, ouvrageDuDevis.benefice, ouvrageDuDevis.aleas)
          await this.sharedData.prixUnitaireCalculeHT(ouvrageDuDevis.SousLotOuvrage)
          await this.sharedData.beneficePercentToEuro(ouvrageDuDevis.SousLotOuvrage, ouvrageDuDevis.benefice)
          await this.sharedData.aleasPercentToEuro(ouvrageDuDevis.SousLotOuvrage, ouvrageDuDevis.aleas)
          //ouvrageDuDevis.SousLotOuvrage.prixUniArrondi = ouvrageDuDevis.SousLotOuvrage.prixUniCalcHT

          await this.testAsync(ouvrageDuDevis)

          // console.log("prix unitaire arrondi ", ouvrageDuDevis.SousLotOuvrage.prixUniVenteHT)
          // console.log("prix unitaire calcule ", ouvrageDuDevis.SousLotOuvrage.prixUniCalcHT)
          // console.log("prix arrondi ", ouvrageDuDevis.SousLotOuvrage.prixVenteHT)
          // this.sommePrixArrondi(ouvrageDuDevis.SousLotOuvrage)
          this.fraisDeChantier.prixVenteHT += ouvrageDuDevis.SousLotOuvrage.prixVenteHT
          this.fraisDeChantier.prixEquiHT += ouvrageDuDevis.SousLotOuvrage.prixEquiHT
          this.fraisDeChantier.beneficeInEuro += ouvrageDuDevis.SousLotOuvrage.beneficeInEuro
          this.fraisDeChantier.aleasInEuro += ouvrageDuDevis.SousLotOuvrage.aleasInEuro
          this.fraisDeChantier.prixCalcHT += ouvrageDuDevis.SousLotOuvrage.prixCalcHT
          this.fraisDeChantier.beneficeAleasTotal = this.fraisDeChantier.prixVenteHT - this.fraisDeChantier.prixEquiHT
        }

      })

    })
    this.devisExport.push({"coutTotal": this.devis.coutTotal})

  }

  getDevisExport() {
    this.devisService.getById(this.devisId).subscribe(value => {
      console.log(value)

      console.log(this.devisExport)
    })
  }


  async testAsync(ouvrageDuDevis: Ouvrage) {
    if (ouvrageDuDevis.SousLotOuvrage) {
      if (ouvrageDuDevis.SousLotOuvrage.prixUniVenteHT !== 0 && ouvrageDuDevis.SousLotOuvrage.prixUniVenteHT) {
        // console.log("prix de vente unitaire IF", ouvrageDuDevis.SousLotOuvrage.prixUniVenteHT)
        ouvrageDuDevis.SousLotOuvrage.prixVenteHT = ouvrageDuDevis.SousLotOuvrage.prixUniVenteHT * ouvrageDuDevis.SousLotOuvrage.quantityOuvrage

      } else {
        ouvrageDuDevis.SousLotOuvrage.prixUniVenteHT = ouvrageDuDevis.SousLotOuvrage.prixUniCalcHT
        ouvrageDuDevis.SousLotOuvrage.prixVenteHT = ouvrageDuDevis.SousLotOuvrage.prixCalcHT
        // console.log("prix de vente unitaire ELSE", ouvrageDuDevis.SousLotOuvrage.prixUniVenteHT)
      }
      // if(ouvrageDuDevis.SousLotOuvrage.prixUniVenteHT === 0){
      // console.log("test prix calcht ", ouvrageDuDevis.SousLotOuvrage.prixCalcHT)
      // this.devis.prixVenteHT += ouvrageDuDevis.SousLotOuvrage.prixArrondi
      // this.devis.beneficeAleasTotal = this.devis.prixVenteHT - this.devis.prixEquiHT
      // }
      // else{
      //   ouvrageDuDevis.SousLotOuvrage.prixVenteHT = ouvrageDuDevis.SousLotOuvrage.prixUniVenteHT * ouvrageDuDevis.SousLotOuvrage.quantityOuvrage
      // this.devis.prixVenteHT += ouvrageDuDevis.SousLotOuvrage.prixVenteHT
      // }
      // this.devis.prixVenteHT += ouvrageDuDevis.SousLotOuvrage.prixVenteHT
      // this.devis.beneficeAleasTotal = this.devis.prixVenteHT - this.devis.prixEquiHT
    }

  }

  getSommeSousLot(sousLot: SousLot, lot: Lot) {
    this.sousLotOuvrageService.getSommeSousLot(sousLot.id).subscribe(data => {
      // console.log("sousLot prix : ", sousLot.prix)
      sousLot.prix = data
      lot.prix = 0;
      for (let sub of lot.SousLots) {
        lot.prix += sub.prix
      }
      // console.log("lot.prix", lot.prix, "lot id ", lot.id)
      this.getSommeDevis()
    })
  }


  onPrixUnitaireCalculeHtChange(event: any, sousLotOuvrage: SousLotOuvrage) {
    // const id = this.SousLotOuvrage.id;
    // this.devis.prixVenteHT = 0;
    // this.prixUnitaireCalculeHt = event;
    sousLotOuvrage.prixUniVenteHT = event
    sousLotOuvrage.prixVenteHT = event * sousLotOuvrage.quantityOuvrage
    const prixArrondiSousLotOuvrage = {
      prixUniVenteHT: event
    }


    if (sousLotOuvrage.id)
      this.sousLotOuvrageService.updatedPrice(sousLotOuvrage.id, prixArrondiSousLotOuvrage).subscribe(
        data => {
          // console.log(data);
        },
        error => {
          console.error(error);
        }
      );
    this.allCalculOuvrage()
  }

//quand la valeur de l'input quantity change

  quantityChange(event: any, sousLotOuvrage: SousLotOuvrage | undefined, sousLot: SousLot, lot: Lot, prixOuvrages: { id: 0, prix: 0 }[]) {
    // this.prixOuvrage = []
    // console.log('quantity:', event);
    console.log('this prixOuvrage', this.prixOuvrage);
    //verifie que le sous lot contient au moins un ouvrage
    // this.quantityCout(event, sousLot)
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
      sousLotOuvrage.prixUniVenteHT = 0;
      // console.log("console from quantityChange", sousLotOuvrage)
      this.sousLotOuvrageService.update(sousLotOuvrage.id, sousLotOuvrage).subscribe(() => {

        this.getSommeSousLot(sousLot, lot)
      })
      // sousLotOuvrage.prixUniArrondi = sousLotOuvrage.prixUniCalcHT
      // // this.allCalculOuvrage()
      // console.log("sousLotOuvrage", sousLotOuvrage)
      // console.log("sousLotOuvrage", sousLotOuvrage.prixOuvrage)
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

    // console.log("tableau de prix des ouvrage", this.prixOuvrageFraisDeChantier)
  }

  getSommeOuvrage(): void {
    this.prixOuvrage = this.testLots
      .flatMap(lot => lot.SousLots)
      .filter(sousLot => sousLot)
      .flatMap(sousLot => sousLot.OuvrageDuDevis)
      .filter(ouvrage => ouvrage)
      .map(ouvrage => ({
        id: ouvrage?.id,
        // prix: ouvrage?.CoutDuDevis && ouvrage.CoutDuDevis.reduce((acc, ct) => acc + ct.prixUnitaire * (ct.OuvrageCoutDuDevis?.ratio || 1), 0)
        prix: ouvrage?.CoutDuDevis && ouvrage.CoutDuDevis.length > 0
        ? ouvrage.CoutDuDevis.reduce((acc, ct) => acc + ct.prixUnitaire * (ct.OuvrageCoutDuDevis?.ratio || 1), 0)
        : ouvrage?.prix

      }));
  // this.allCalculOuvrage()
    console.log("tableau de prix des ouvrage", this.prixOuvrage)
  }


  //recuperation de tous les lots du devis SAUF les lot "Frais de chantier" pour l'onglet DEVIS;
  getAllLots() {
    // this.prixDevis = 0;
    this.devisService.getByIdExceptFrais(this.devisId).subscribe(data => {
      console.log( "data get all lot " , data)

      // console.log("console log de getalllots  LOT DATA:", data.Lots)
      let nombreOuvrage = 0
      this.resultBeneficeLots = 0;
      this.resultAleasLots = 0;
      this.testLots = data.Lots;
      this.testLots.forEach(lot => {
        lot.SousLots.forEach(sousLot => {
          sousLot.prix = 0;
          this.prixVenteHt = 0
          this.getSommeSousLot(sousLot, lot)
          sousLot.OuvrageDuDevis.forEach(ouvrage => {
            nombreOuvrage++;
            this.resultBeneficeLots += ouvrage.benefice
            this.resultAleasLots += ouvrage.aleas

          })
        })
      });
      this.resultBeneficeLots = this.resultBeneficeLots / nombreOuvrage
      this.resultAleasLots = this.resultAleasLots / nombreOuvrage
      this.sharedData.entrepriseId = data.EntrepriseId;
      this.getAllOuvrageExceptFraisDeChantier(data.EntrepriseId);
      this.getAllOuvrageFraisDeChantier(data.EntrepriseId)
      this.getSommeOuvrage()

      this.moyenneAleas()
      console.log("devis : ", this.devis.moyenneAleas)
      this.moyenneBenefice()
      this.moyenneBeneficeAleasTotal()
      // this.quantityChange()
      // this.dataLoad = true
    })
  }

  prixEquilibreHT(prixOuvrage: any): number {
    this.coefEqui = this.sousDetailPrixService.coefEqui;
    const prix = prixOuvrage * this.coefEqui;
    if (prix && !this.prixEquilibres.includes(prix)) {
      this.prixEquilibres.push(prix);
      // console.log(this.prixEquilibres)
    }
    return prix;
  }

  sommePrixEquilibre(): number {
    return this.prixEquilibres.reduce((a, b) => a + b, 0);
  }

  //recuperation du lot generer automatiquement a la creation du devis, avec comme designation
  //"Frais de chantier"

  getLotFraisDeChantier(): void {
    this.devisService.getLotFraisDeChantier(this.devisId).subscribe(data => {
      console.log("GET LOT FRAIS DE CHANTIER", data);


      let nombreOuvrage = 0;
      this.resultAleasFraisDeChantier = 0;
      this.resultBeneficeFraisDeChantier = 0;
      this.lotFraisDeChantier = data.Lots[0];
      // console.log("console log frais de chantier:", data)
      this.lotFraisDeChantier.SousLots.forEach(sousLot => {
        sousLot.prix = 0;
        this.getSommeSousLot(sousLot, this.lotFraisDeChantier)
        sousLot.OuvrageDuDevis.forEach(ouvrage => {
          nombreOuvrage++;
          this.resultBeneficeFraisDeChantier += ouvrage.benefice
          this.resultAleasFraisDeChantier += ouvrage.aleas
        })
      })
      this.resultBeneficeFraisDeChantier = this.resultBeneficeFraisDeChantier / nombreOuvrage
      this.resultAleasFraisDeChantier = this.resultAleasFraisDeChantier / nombreOuvrage
      // this.getAllOuvrageExceptFraisDeChantier(data.EntrepriseId);
      this.getAllOuvrageFraisDeChantier(data.EntrepriseId)
      this.getSommeOuvrageFraisDeChantier()

    })

  }

  getAllOuvrageExceptFraisDeChantier(id: number) {
    // console.log("console log id get all ouvrage", id)
    // this.ouvrageService.getAll(id).subscribe(data => {
    this.ouvrageService.getAll(id).subscribe(data => {
      this.listOuvrage = data;
      console.log("ouvrages",data)
    })
  }

  getAllOuvrageFraisDeChantier(id: number) {
    // console.log("console log id get all ouvrage", id)
    // this.ouvrageService.getAll(id).subscribe(data => {
    // this.ouvrageService.getAllFraisDeChantier(id).subscribe(data => {
    this.ouvrageService.getAll(id).subscribe(data => {
      this.listOuvrageFraisDeChantier = data;
      // console.log('ouvrage frais de chantier', data)
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
      this.success("Lot effacer!")
      this.getAllLots()
    })
  }

  deleteOuvrageDuDevis(id: number): void {
    this.ouvrageService.deleteOuvrageDuDevisByID(id).subscribe(() => {
      this.getAllLots()
      this.success("Ouvrage effacer!")
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
      panelClass:"test",
      data: this.listOuvrage,
      width: '90%',
      height: '70%'
    }).afterClosed().subscribe(result => {
      if (result) {
        this.selectedOuvrageIds = result.selectedOuvrageIds;
        //this.createOuvrageSousLot(sousLotId)
        // console.log('debut de la fonction create ouvrage du devis')
        this.createOuvrageDuDevis(sousLotId)
        // this.getSommeOuvrage()

        // console.log('fin de la fonction create ouvrage du devis')
      } else {
        // Afficher un message d'erreur si aucun sous-lot n'est sélectionné
        this.warning("error",);
      }

    });
  }
  openDialogCreate(sousLotId: number) {
    this.dialog.open(FormOuvrageComponent, {
      data: sousLotId,
      width: '90%',
      height: '40%'
    }).afterClosed().subscribe(result => {
      this.getAllLots()
      this.getLotFraisDeChantier() ;


    });
  }


  openDialogFraisDeChantier(sousLotId: number) {
    this.dialog.open(DialogComponent, {
      data: this.listOuvrageFraisDeChantier,
      // data: this.listOuvrage,
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
    let prixOuvrage = 0 ;
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

            prixOuvrage += cout.prixUnitaire * (cout.OuvrageCout.ratio)
            console.log("prix de l'ouvrage ", prixOuvrage)

            this.coutDuDevis = cout;
            this.coutDuDevis.fournisseur = cout.Fournisseur.commercialName
            this.coutDuDevis.remarque = cout.Fournisseur.remarque !== null ? cout.Fournisseur.remarque : ""
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
            prixOuvrage: prixOuvrage,
            prixUniVenteHT: 0,
            prixVenteHT: 0,
            quantityOuvrage: 1,
            prixUniHT: 0,
            prixEquiHT: 0,
            prixUniEquiHT: 0,
            beneficeInEuro: 0,
            aleasInEuro: 0,
            prixCalcHT: 0,
            prixUniCalcHT: 0
          }
          console.log("sous lot ouvrage du devis",this.sousLotOuvrageDuDevis)
          //creer le sousLotOuvrageDuDevis
          // this.ouvrageService.createSousLotOuvrageForDevis(this.sousLotOuvrageDuDevis).subscribe(() => {
          this.sousLotOuvrageService.createSousLotOuvrage(this.sousLotOuvrageDuDevis).subscribe(() => {
            //rafraichi la data
            this.getAllLots()
            this.getLotFraisDeChantier()
          })
        })

      })

    });
    this.getSommeOuvrage()
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

  // sommePrixArrondi(sousLotOuvrage : SousLotOuvrage):void{
  //   sousLotOuvrage.prixArrondi = sousLotOuvrage.prixUniArrondi * sousLotOuvrage.quantityOuvrage
  // }

  // getPrix(ouvrage: Ouvrage) {
  //   if (!ouvrage.SousLotOuvrage) {
  //     return 0;
  //   }
  //   let arrondi = ouvrage.SousLotOuvrage.prixArrondi > 0 ? ouvrage.SousLotOuvrage.prixArrondi : this.sharedData.prixUnitaireCalculeHt;
  //
  //   return arrondi;
  // }

  public totalArray: number[] = [];

  // updateTotalArray(ouvrage: Ouvrage) {
  //   let prix = (ouvrage.SousLotOuvrage?.quantityOuvrage || 0) * this.getPrix(ouvrage)
  //   if (prix && !this.totalArray.includes(prix)) {
  //     this.totalArray.push(prix);
  //   }
  //   return prix
  // }

  calculateTotal() {
    return this.totalArray.reduce((a, b) => a + b, 0);
  }
}




