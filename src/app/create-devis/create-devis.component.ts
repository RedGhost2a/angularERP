import {ChangeDetectorRef, Component, ElementRef, Inject, Injectable, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
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
import {transformVirguletoPoint} from "../_helpers/transformVirguletoPoint"
import {Client} from "../_models/client";
import {Entreprise} from "../_models/entreprise";
import {DialogLotComponent} from "../dialog-lot/dialog-lot.component";
import {DialogSouslotComponent} from "../dialog-souslot/dialog-souslot.component";
import {DialogFormCoutComponent} from "../dialog-form-cout/dialog-form-cout.component";
import {Cout} from "../_models/cout";
import {FournisseurService} from "../_service/fournisseur.service";
import {TypeCoutService} from "../_service/typeCout.service";
import {DialogConfirmSuppComponent} from "../dialog-confirm-supp/dialog-confirm-supp.component";
import {DialogListCoutComponent} from "../dialog-list-cout/dialog-list-cout.component";
import {OuvrageElementaire} from "../_models/ouvrage-elementaire";
import {OuvrageElementaireService} from "../_service/ouvrage-elementaire.service";
import {OuvrageElementaireCoutService} from "../_service/ouvrage-elementaire-cout.service";
import {OuvrageOuvragesElementairesService} from "../_service/ouvrage-ouvrages-elementaires.service";
declare var introJs: any;

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
  listCout!: Cout[];
  listOuvrageFraisDeChantier!: Ouvrage[];
  selectedOuvrageIds: number [] = [];
  hiddenChildren = new Map<number, boolean>();
  expandedLotId!: number | undefined;
  prixOuvrage: { prix: any; id: any }[] = [];
  prixOuvrageFraisDeChantier: { prix: any; id: any }[] = [];
  myFormGroup!: FormGroup;
  myFormGroupPrix!: FormGroup;
  myFormFraisGeneraux!: FormGroup;
  formBAOuvrageHidden!: FormGroup;
  sommeLot: { prixLot: any; idLot: any }[] = [];
  coutDuDevis!: CoutDuDevis;
  sousLotOuvrageDuDevis!: SousLotOuvrage
  resultBeneficeLots!: number;
  resultAleasLots!: number;
  resultBeneficeFraisDeChantier!: number;
  resultAleasFraisDeChantier!: number;
  dataLoad: boolean = false;
  fraisDeChantier = new Devis()
  devisExport = new DevisExport()
  client !: Client
  entreprise !: Entreprise
  setting = {
    element: {
      dynamicDownload: null as unknown as HTMLElement,
    }
    ,
  };
  selectedIndex !: number;
  hiddenLotId2 !: number;
  hiddenCout: Cout [] = [];
  @ViewChild('aForm') aForm !: ElementRef;
  @ViewChild('aForm2') aForm2 !: ElementRef;
  @ViewChild('f') f !: NgForm;
  hidden: boolean = false;
  hiddenSousLotForOuvrageId !: number;
  hiddenSousLotForCoutId !: number;
  isEditMode: boolean = false;
  isEditMode2: boolean = false;




//TODO ON NE PEUT METTRE QUE UN SEUL ET MEME OUVRAGE PAR SOUS_LOT; //

  constructor(private lotService: LotService, private route: ActivatedRoute,
              private router: Router, @Inject(TOASTR_TOKEN) private toastr: Toastr,
              private sousLotService: SousLotService, private devisService: DevisService,
              private changeDetectorRef: ChangeDetectorRef, private ouvrageService: OuvrageService,
              private sousLotOuvrageService: SousLotOuvrageService, public dialog: MatDialog,
              private coutService: CoutService, private sousDetailPrixService: SousDetailPrixService,
              private ouvrageCoutService: OuvrageCoutService, public sharedData: DataSharingService,
              private fournisseurService: FournisseurService, private typeCoutService: TypeCoutService,
              private ouvrageElementaireService: OuvrageElementaireService, private ouvrageElementaireCoutService : OuvrageElementaireCoutService,
              private ouvrageOuvrageElementaireService : OuvrageOuvragesElementairesService
  ) {
    this.expandedLotId = undefined;
    const storedIndex = localStorage.getItem("index");
    if (storedIndex) {
      this.selectedIndex = +storedIndex;
    }

  }

  startIntro() {
    introJs().setOptions({
      tooltipClass: 'customTooltip',
      nextLabel: 'Suivant',
      prevLabel: 'Précédent',
      skipLabel: 'x',
      doneLabel: 'Terminer',
      showProgress: true,
      exitOnOverlayClick: false
    }).start()  }
  ngOnInit() {

    console.log('url', this.router.url)
    transformVirguletoPoint()
    this.route.params.subscribe(params => {
      this.devis.id = +params['id'];
      this.devisId = +params['id']
      this.sharedData.deviId = this.devisId;
      this.devisService.getById(this.devisId).subscribe((devis: Devis) => {
          //215 ms
        console.log("devis",devis.percentFraisGeneraux)
          this.formFraisGeneraux(devis.percentFraisGeneraux)
          this.devis = devis;
        //   this.devisExport.client = {
        //     denomination: devis.Client.denomination,
        //     adresses: devis.Client.Adresse.adresses,
        //     ville: devis.Client.Adresse.city
        //   }
        //   this.devisExport.entreprise = {
        //     denomination: devis.Entreprise.denomination
        //   };
        }
      )
      this.form = new FormGroup({
        designation: new FormControl("", [Validators.required, Validators.minLength(3)]),
        devisId: new FormControl(this.devisId)
      });
    });
    // this.formFraisGeneraux()

    this.formBeneAndAleasOuvrageHidden()
    this.formQuantityOuvrage()
    this.formPrixArrondiOuvrage()
    this.getLotFraisDeChantier();
    this.getAllLots();
    this.getLotFraisDeChantier()

    this.dataLoad = false;

    this.getDevisExport()
    this.setSelectedIndex()
    // this.getSousLotHiddenForOuvrageId()
    // this.getSousLotHiddenForCoutId()
  }

  updateDesignationLot(lot: Lot, id: number): void {
    const updatedLot = {...lot, };
    this.lotService.update(updatedLot, id)
      .subscribe(() => this.isEditMode = false);
  }

  updateDesignationSL(sublot: SousLot, id: number): void {
    const updatedSLot = {...sublot, };
    this.sousLotService.update(updatedSLot, id)
      .subscribe(() => this.isEditMode2 = false);
  }



  ngOnDestroy() {
    // this.updateDevisOnDestroy()
    this.updateDevisOnDestroy()
  }

  updateDevisOnDestroy() {
    let devisBDD: Devis
    devisBDD = this.devis;
    devisBDD.prixEquiHT += this.fraisDeChantier.prixEquiHT
    if (this.lotFraisDeChantier.prix)
      devisBDD.debourseSecTotal += this.lotFraisDeChantier?.prix
    devisBDD.prixVenteHT += this.fraisDeChantier.prixVenteHT
    devisBDD.prixCalcHT += this.fraisDeChantier.prixCalcHT
    this.devisService.update(devisBDD, this.devisId).subscribe()
  }

  onTabChanged(index: number) {
    localStorage.setItem("index", index.toString())
  }

  setSelectedIndex() {
    setTimeout(() => {
      const index = localStorage.getItem("index")
      this.selectedIndex = parseInt(index ?? "0")
    }, 200)
  }

  openDialogCreateCout(listTypeCout: any, listFournisseur: any, currentOuvrage: any, sousLotOuvrageDuDevisId: any) {
    console.log("create cout fournisseurs ?,", this.fournisseurService.fournisseurs)
    console.log("create cout type cout ?,", this.typeCoutService.typeCouts)
    this.dialog.open(DialogFormCoutComponent, {
      // data: 'test',
      data: [listTypeCout, listFournisseur, currentOuvrage],
      width: '55%',
      height: '60%'
    }).afterClosed().subscribe(async coutDuDevis => {
      console.log("after close souslot ouvrage ID", sousLotOuvrageDuDevisId)
      console.log("after close coutdu devis prix unitaire response", coutDuDevis)
      console.log("after close coutdu devis ratio response", coutDuDevis)
      let prixOuvrage = 0;
      prixOuvrage += coutDuDevis.prixUnitaire * (coutDuDevis.ratio)
      console.log("after close prix de l'ouvrage calculer", prixOuvrage)

      this.sousLotOuvrageService.updatedPrice(sousLotOuvrageDuDevisId, {prixOuvrage: prixOuvrage}).subscribe((response) => {
        this.getAllLots()
        this.getLotFraisDeChantier()

      })

    });
  }

  createSousLotHiddenForOuvrageInLot(lotId: number) {
    let dataForSousLot = {
      designation: `SousLotHiddenForOuvrageDuDevisInLot${this.devis.id}`,
      devisId: this.devis.id
    }
    this.sousLotService.createHiddenSouslot(dataForSousLot, lotId).subscribe((sousLotData) => {
      this.openDialogCreate(sousLotData.sousLot.id)
    }, (error) => {
      console.error('Erreur lors de la création du sous-lot: ', error);
    })

  }
  createHiddenSousLotAndOuvrageForFraisDeChantier(lotId:number){

    let dataForSousLot = {
      designation: `SousLotHiddenFraisDeChantier${this.devis.id}`,
      devisId: this.devis.id
    }
    this.sousLotService.create(dataForSousLot, lotId).subscribe(responseSousLot => {
      console.log("souslotRes",responseSousLot)


      let dataForOuvrage = {
        designation: `OuvrageHiddenFraisDeChantierForCout${this.devisId}`,
        benefice: this.devis.beneficeInPercent,
        aleas: this.devis.aleasInPercent,
        unite: 'hiddenUnite',
        ratio: 1,
        uRatio: 'hiddenUnite',
        prix: 0,
        alteredBenefOrAleas: false,
        EntrepriseId: this.sharedData.entrepriseId,
      };
      this.ouvrageService.createOuvrageDuDevis(dataForOuvrage).subscribe(response => {
        console.log("response",response)
        let sousLotFraisDeChantierOuvrageDuDevis = {
          SousLotId: responseSousLot.sousLot.id,
          OuvrageDuDeviId: response.OuvrageDuDevis?.id,
          prixOuvrage: response.prix,
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
        this.ouvrageService.createSousLotOuvrageForDevis(sousLotFraisDeChantierOuvrageDuDevis).subscribe((data) => {
          console.log("data278",data)
          this.typeCoutService.getAllTypeCouts(this.sharedData.entrepriseId).subscribe(typeCouts => {
            console.log("liste des type de couts : ", typeCouts)
            this.fournisseurService.getAllFournisseurs(this.sharedData.entrepriseId).subscribe(fournisseurs => {

              this.openDialogCreateCout(typeCouts, fournisseurs, response.OuvrageDuDevis, data[0].id)

            })
          })

        })
      })

    })

  }

  createHiddenSousLotAndOuvrageForCoutInLot(lotId: number) {
    let dataForSousLot = {
      designation: `SousLotHiddenForCoutDuDevisInLot${this.devis.id}`,
      devisId: this.devis.id
    }
    this.sousLotService.createHiddenSouslot(dataForSousLot, lotId).subscribe((sousLotData) => {

      let dataForOuvrage = {
        designation: `OuvrageHiddenForCoutInLot${this.devisId}`,
        benefice: this.devis.beneficeInPercent,
        aleas: this.devis.aleasInPercent,
        unite: 'hiddenUnite',
        ratio: 1,
        uRatio: 'hiddenUnite',
        prix: 0,
        alteredBenefOrAleas: false,
        EntrepriseId: this.sharedData.entrepriseId,
      };

      this.ouvrageService.createOuvrageDuDevis(dataForOuvrage).subscribe(response => {
        this.sousLotOuvrageDuDevis = {
          SousLotId: sousLotData.sousLot.id,
          OuvrageDuDeviId: response.OuvrageDuDevis?.id,
          prixOuvrage: response.prix,
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

        this.ouvrageService.createSousLotOuvrageForDevis(this.sousLotOuvrageDuDevis).subscribe((data) => {
          this.typeCoutService.getAllTypeCouts(this.sharedData.entrepriseId).subscribe(typeCouts => {
            this.fournisseurService.getAllFournisseurs(this.sharedData.entrepriseId).subscribe(fournisseurs => {
              this.openDialogCreateCout(typeCouts, fournisseurs, response.OuvrageDuDevis, data[0].id)
            })
          })
        })

      })
    })


  }

  importOuvrageInLot(lotId: number) {
    let dataForSousLot = {
      designation: `SousLotHiddenForOuvrageDuDevisInLot${this.devis.id}`,
      devisId: this.devis.id
    }
    this.sousLotService.createHiddenSouslot(dataForSousLot, lotId).subscribe((sousLotData) => {
      this.openDialog(sousLotData.sousLot.id)
    })
  }


  openDialogImportCouts(lotId: number | null, sousLotId: number | null) {
    this.devisService.currentDevis = this.devis
    console.log("devis id ", this.devis.id)
    this.dialog.open(DialogListCoutComponent, {

      panelClass: 'test',
      data: [this.listCout, lotId, sousLotId, this.devis.id],
      width: '90%',
      height: '70%'
    }).afterClosed().subscribe(async result => {
      //tableau d'id des ouvrages
      console.log("result after close", result.selectedOuvrageIds)
      this.getAllLots();

    });
  }

  createHiddenOuvrageForCoutInSousLot(sousLotId: number) {
    let dataForOuvrage = {
      designation: `OuvrageHiddenForCoutInLot${this.devisId}`,
      benefice: this.devis.beneficeInPercent,
      aleas: this.devis.aleasInPercent,
      unite: 'hiddenUnite',
      ratio: 1,
      uRatio: 'hiddenUnite',
      prix: 0,
      alteredBenefOrAleas: false,
      EntrepriseId: this.sharedData.entrepriseId,
    };
    this.ouvrageService.createOuvrageDuDevis(dataForOuvrage).subscribe(response => {
      this.sousLotOuvrageDuDevis = {
        SousLotId: sousLotId,
        OuvrageDuDeviId: response.OuvrageDuDevis?.id,
        prixOuvrage: response.prix,
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
      this.ouvrageService.createSousLotOuvrageForDevis(this.sousLotOuvrageDuDevis).subscribe((data) => {
        console.log("console", data)
        this.typeCoutService.getAllTypeCouts(this.sharedData.entrepriseId).subscribe(typeCouts => {
          this.fournisseurService.getAllFournisseurs(this.sharedData.entrepriseId).subscribe(fournisseurs => {
            this.openDialogCreateCout(typeCouts, fournisseurs, response.OuvrageDuDevis, data[0].id)
          })
        })
      })

    })


  }


  createHiddenLotAndSousLotAndOvrage() {
    console.log('this devis ', this.devis)
    let dataForOuvrage = {
      designation: `OuvrageHiddenForCout${this.devisId}`,
      benefice: this.devis.beneficeInPercent,
      aleas: this.devis.aleasInPercent,
      unite: 'hiddenUnite',
      ratio: 1,
      uRatio: 'hiddenUnite',
      prix: 0,
      alteredBenefOrAleas: false,
      EntrepriseId: this.sharedData.entrepriseId,
    };

    this.ouvrageService.createOuvrageDuDevis(dataForOuvrage).subscribe(response => {
      console.log("response ouvrage cout du devis ", response)
      // const prixOuvrage =
      this.sousLotOuvrageDuDevis = {
        SousLotId: this.hiddenSousLotForCoutId,
        OuvrageDuDeviId: response.OuvrageDuDevis?.id,
        prixOuvrage: response.prix,
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
      console.log("sous lot ouvrage du devis", this.sousLotOuvrageDuDevis)

      this.ouvrageService.createSousLotOuvrageForDevis(this.sousLotOuvrageDuDevis).subscribe((data) => {
        console.log("console", data)
        // this.closeDialog()
        this.typeCoutService.getAllTypeCouts(this.sharedData.entrepriseId).subscribe(typeCouts => {
          console.log("liste des type de couts : ", typeCouts)
          this.fournisseurService.getAllFournisseurs(this.sharedData.entrepriseId).subscribe(fournisseurs => {
            console.log("liste des fournisseurs: ", fournisseurs)
            console.log("sous lot ouvrage ?: ", this.sousLotOuvrageDuDevis)
            this.openDialogCreateCout(typeCouts, fournisseurs, response.OuvrageDuDevis, data[0].id)
          })
        })
      })

    })


  }


  createHiddenLotForSousLotButton() {
    // let dataForLot = {
    //   designation: `Hidden Lot pour sous lot   n°: ${this.devisId}`,
    //   devisId: this.devisId
    // };
    //
    // this.lotService.create(dataForLot).subscribe((data) => {
    //   console.log("data", data.lot.lotId)
    //   this.hiddenLotId2 = data.lot.lotId;  // Stocker l'ID du lot
    //   this.showForm = true;  // Afficher le formulaire
    // })
  }


  fraisGeneraux(): void {
    if (this.lotFraisDeChantier.prix !== undefined) {
      this.devis.fraisGeneraux = (this.lotFraisDeChantier.prix + this.devis.debourseSecTotal) * (this.myFormFraisGeneraux.get('percentFraisGeneraux')?.value / 100)
      this.coutTotal();
      this.totalDepense()
    } else {
      this.devis.fraisGeneraux = this.devis.debourseSecTotal * (this.myFormFraisGeneraux.get('percentFraisGeneraux')?.value / 100)
      this.coutTotal();
      this.totalDepense()
    }
  }

  updateFraisGeneraux(event: any) {
    if (event.target.value !== '') {
      this.myFormFraisGeneraux.setValue({percentFraisGeneraux: event.target.value})
      this.devisService.update(this.myFormFraisGeneraux.getRawValue(), this.devisId).subscribe()
      this.fraisGeneraux()
    }
  }

  moyenneBenefice(): void {
    this.devis.moyenneBenefice = (this.resultBeneficeFraisDeChantier + this.resultBeneficeLots) / 2
  }

  moyenneAleas(): void {
    this.devis.moyenneAleas = (this.resultAleasLots + this.resultAleasFraisDeChantier) / 2
  }

  totalDepense(): void {
    this.devis.totalDepense = this.devis.fraisGeneraux + this.devis.debourseSecTotal
  }


  moyenneBeneficeAleasTotal(): void {
    this.devis.moyenneBeneficeAleas = this.devis.moyenneAleas + this.devis.moyenneBenefice
  }


  coutTotal(): void {
    if (this.lotFraisDeChantier.prix !== undefined) {
      this.devis.coutTotal = this.lotFraisDeChantier.prix + this.devis.debourseSecTotal + this.devis.fraisGeneraux
      console.log("cout total debourse fonction", this.devis.fraisGeneraux)
      this.coefEquilibre()
    } else {
      this.devis.coutTotal = this.devis.debourseSecTotal + this.devis.fraisGeneraux
      this.coefEquilibre()
    }
  }

  coefEquilibre(): void {
    // if (this.lotFraisDeChantier.prix !== 0 && this.testLots[0].prix !== 0 && this.testLots[0].prix !== NaN) {
    if (this.lotFraisDeChantier.prix !== 0 && this.testLots[0].prix !== NaN) {
      this.devis.coeffEquilibre = this.devis.coutTotal / this.devis.debourseSecTotal
      localStorage.setItem("coef", this.devis.coeffEquilibre.toString())
    }
  }


  formQuantityOuvrage(): void {
    this.myFormGroup = new FormGroup({
      quantityOuvrage: new FormControl(),
    });
  }

  formBeneAndAleasOuvrageHidden(): void {
    this.formBAOuvrageHidden = new FormGroup({
      benefice: new FormControl(),
      aleas: new FormControl()
    })
  }

  beneficeChange(ouvrageId: number) {
    if (this.formBAOuvrageHidden.getRawValue().benefice !== null) {
      this.ouvrageService.updateOuvrageDuDevis({
        benefice: this.formBAOuvrageHidden.getRawValue().benefice,
        alteredBenefOrAleas: true
      }, ouvrageId).subscribe(() => {
        this.formBAOuvrageHidden.controls['benefice'].setValue("");
        this.ngOnInit()
      })
    }
  }

  aleasChange(ouvrageId: number) {
    if (this.formBAOuvrageHidden.getRawValue().aleas !== null) {
      this.ouvrageService.updateOuvrageDuDevis({
        aleas: this.formBAOuvrageHidden.getRawValue().aleas,
        alteredBenefOrAleas: true
      }, ouvrageId).subscribe(() => {
        this.formBAOuvrageHidden.controls['aleas'].setValue("");
        this.ngOnInit()
      })
    }
  }

  deleteCout(coutId: number, ouvrageId: number) {
    const dialogRef = this.dialog.open(DialogConfirmSuppComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.coutService.deleteCoutDuDevisByID(coutId).subscribe(() => {
          this.ouvrageService.deleteOuvrageDuDevisByID(ouvrageId).subscribe(() => this.ngOnInit())
        })
      }
    })
  }

  formFraisGeneraux(percent:number): void {
    console.log("frais generaux",this.devis.percentFraisGeneraux)
    this.myFormFraisGeneraux = new FormGroup({
      percentFraisGeneraux: new FormControl(percent),
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
    this.devis.beneficeAleasTotalPercent = 0;
    console.log('test lot ', this.testLots)
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
            //REVOIR LA FONCTION POUR LES PRIX DE VENTE
            await this.sharedData.prixVenteHT(ouvrageDuDevis.SousLotOuvrage)
            // await this.sharedData.prixUniVente(ouvrageDuDevis.SousLotOuvrage)

            // await this.sharedData.
            //ouvrageDuDevis.SousLotOuvrage.prixUniArrondi = ouvrageDuDevis.SousLotOuvrage.prixUniCalcHT


            await this.testAsync(ouvrageDuDevis.SousLotOuvrage)


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
            this.devis.beneficeAleasTotalPercent = (this.devis.beneficeAleasTotal / this.devis.prixVenteHT) * 100
          }

        })

      })
    })

    //this.testDevisExport.debourseSecTotal = this.devis.debourseSecTotal

    // console.log("this.devis", this.devis)
    //console.log("testDevis",this.testDevisExport)
  }

  calculDevisWithPrixChange() {
    this.devis.prixEquiHT = 0;
    this.devis.beneficeInEuro = 0;
    this.devis.aleasInEuro = 0;
    this.devis.prixCalcHT = 0;
    this.devis.beneficeAleasTotal = 0;
    this.devis.prixVenteHT = 0;

    this.testLots.forEach(lot => {
      lot.SousLots.forEach(sousLot => {
        sousLot.OuvrageDuDevis.forEach(async ouvrageDuDevis => {
          if (ouvrageDuDevis.SousLotOuvrage) {
            await this.sharedData.prixEquilibreHT(ouvrageDuDevis.SousLotOuvrage)
            await this.sharedData.prixUnitaireHT(ouvrageDuDevis.SousLotOuvrage)
            await this.sharedData.prixCalculeHT(ouvrageDuDevis.SousLotOuvrage, ouvrageDuDevis.benefice, ouvrageDuDevis.aleas)
            await this.sharedData.prixUnitaireCalculeHT(ouvrageDuDevis.SousLotOuvrage)
            await this.sharedData.beneficePercentToEuro(ouvrageDuDevis.SousLotOuvrage, ouvrageDuDevis.benefice)
            await this.sharedData.aleasPercentToEuro(ouvrageDuDevis.SousLotOuvrage, ouvrageDuDevis.aleas)

            await this.testAsync(ouvrageDuDevis.SousLotOuvrage)


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

  }

  calculFraisDeChantierWithPrixChange() {
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


          await this.testAsync(ouvrageDuDevis.SousLotOuvrage)
          this.fraisDeChantier.prixVenteHT += ouvrageDuDevis.SousLotOuvrage.prixVenteHT
          this.fraisDeChantier.prixEquiHT += ouvrageDuDevis.SousLotOuvrage.prixEquiHT
          this.fraisDeChantier.beneficeInEuro += ouvrageDuDevis.SousLotOuvrage.beneficeInEuro
          this.fraisDeChantier.aleasInEuro += ouvrageDuDevis.SousLotOuvrage.aleasInEuro
          this.fraisDeChantier.prixCalcHT += ouvrageDuDevis.SousLotOuvrage.prixCalcHT
          this.fraisDeChantier.beneficeAleasTotal = this.fraisDeChantier.prixVenteHT - this.fraisDeChantier.prixEquiHT
        }

      })

    })
  }

  allCalculOuvrageFraisDeChantier(): void {
    this.fraisDeChantier.prixVenteHT = 0;

    this.lotFraisDeChantier.SousLots.forEach(sousLot => {
      sousLot.OuvrageDuDevis.forEach(async ouvrageDuDevis => {
        if (ouvrageDuDevis.SousLotOuvrage) {
          await this.sharedData.prixUnitaireHT(ouvrageDuDevis.SousLotOuvrage)
          ouvrageDuDevis.SousLotOuvrage.prixVenteHT = ouvrageDuDevis.SousLotOuvrage.prixUniVenteHT * ouvrageDuDevis.SousLotOuvrage.quantityOuvrage
          this.fraisDeChantier.prixVenteHT += ouvrageDuDevis.SousLotOuvrage.prixVenteHT
        }
      })

    })
  }


  getDevisExport() {
    this.devisService.getById(this.devisId).subscribe()
  }


  async testAsync(sousLotOuvrage: SousLotOuvrage) {
    if (sousLotOuvrage.prixUniVenteHT !== 0 && sousLotOuvrage.prixUniVenteHT) {
      sousLotOuvrage.prixVenteHT = sousLotOuvrage.prixUniVenteHT * sousLotOuvrage.quantityOuvrage

    } else {
      sousLotOuvrage.prixUniVenteHT = sousLotOuvrage.prixUniCalcHT
      sousLotOuvrage.prixVenteHT = sousLotOuvrage.prixCalcHT
    }


  }

  getSommeSousLot(sousLot: SousLot, lot: Lot) {
    this.sousLotOuvrageService.getSommeSousLot(sousLot.id).subscribe(data => {
      console.log("sousLot prix : ", sousLot.prix)
      sousLot.prix = data
      lot.prix = 0;
      for (let sub of lot.SousLots) {
        lot.prix += sub.prix
      }
      this.getSommeDevis()
    })
  }


  onPrixUnitaireCalculeHtChange(event: any, sousLotOuvrage: SousLotOuvrage) {
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
    this.calculDevisWithPrixChange()
    this.calculFraisDeChantierWithPrixChange()
  }

//quand la valeur de l'input quantity change

  quantityChange(event: any, sousLotOuvrage: SousLotOuvrage | undefined, sousLot: SousLot, lot: Lot, prixOuvrages: { id: 0, prix: 0 }[]) {
    //verifie que le sous lot contient au moins un ouvrage
    console.log("sous lot ouvrage",sousLotOuvrage)
    if (sousLotOuvrage !== undefined && sousLotOuvrage.id) {
      //si la valeur de l'input est superieur a 0
      if (event > 0) {
        //boucle dans le tableau de prixOuvrage qui correspond au prix unitaire de l'ouvrage
        for (let element of prixOuvrages) {
          //verifie si l'id du tableau de prix est egale a l'id de sousLotOuvrage
          if (element.id === sousLotOuvrage.OuvrageDuDeviId) {
            console.log("element",element)
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
      //soit on ecrase le prix de vente
      sousLotOuvrage.prixUniVenteHT = 0;


      this.sousLotOuvrageService.update(sousLotOuvrage.id, sousLotOuvrage).subscribe(() => {
        this.getSommeSousLot(sousLot, lot)
        this.calculFraisDeChantierWithPrixChange()

      })
    }
  }


  getSommeOuvrageFraisDeChantier(): void {
    this.prixOuvrageFraisDeChantier = this.lotFraisDeChantier.SousLots
      .flatMap(sousLot => sousLot.OuvrageDuDevis)
      .filter(ouvrage => ouvrage)
      .map(ouvrage => ({
        id: ouvrage?.id,
        prix: ouvrage?.CoutDuDevis && ouvrage.CoutDuDevis.length > 0
          ? ouvrage.CoutDuDevis.reduce((acc, ct) => acc + ct.prixUnitaire * (ct.OuvrageCoutDuDevis?.ratio || 1), 0)
          : ouvrage?.prix
      }));

  }

  getSommeOuvrage(): void {
    this.prixOuvrage = this.testLots
      .flatMap(lot => lot.SousLots)
      .filter(sousLot => sousLot)
      .flatMap(sousLot => sousLot.OuvrageDuDevis)
      .filter(ouvrage => ouvrage)
      .map(ouvrage => ({
        id: ouvrage?.id,
        prix: ouvrage?.CoutDuDevis && ouvrage.CoutDuDevis.length > 0
          ? ouvrage.CoutDuDevis.reduce((acc, ct) => acc + ct.prixUnitaire * (ct.OuvrageCoutDuDevis?.ratio || 1), 0)
          : ouvrage?.prix

      }));
    console.log("get somme ouvrage ? ", this.prixOuvrage)
  }

  updateSousLots(sousLot: SousLot, id: number) {
    this.sousLotService.update(sousLot, id).subscribe(() => {
      this.getAllLots()
      this.getLotFraisDeChantier()
    })
  }


  //recuperation de tous les lots du devis SAUF les lot "Frais de chantier" pour l'onglet DEVIS;
  getAllLots() {
    this.devisService.getByIdExceptFrais(this.devisId).subscribe(data => {
      this.devisExport.client = {
        denomination: data.Client.denomination,
        adresses: data.Client.Adresses[0].adresses,
        ville: data.Client.Adresses[0].city
      }
      this.devisExport.entreprise = {
        denomination: data.Entreprise.denomination
      };

      let nombreOuvrage = 0
      this.devis.moyenneBenefice = 0;
      this.devis.moyenneAleas = 0;
      this.testLots = data.Lots;
      this.testLots.forEach(lot => {
        lot.SousLots.forEach(sousLot => {
          console.log("----------------->", sousLot)
          sousLot.prix = 0;
          this.getSommeSousLot(sousLot, lot)
          sousLot.OuvrageDuDevis.forEach(ouvrage => {
            if (ouvrage.designation.startsWith('Hidden')) {
              if (ouvrage.CoutDuDevis) {
                ouvrage.CoutDuDevis.forEach(cout => this.hiddenCout.push(cout));

              }
            }
            console.log("ouvrageHIDDEN", this.hiddenCout)
            nombreOuvrage++;
            this.devis.moyenneAleas += ouvrage.aleas
            this.devis.moyenneBenefice += ouvrage.benefice

          })
        })
      });
      this.devis.moyenneAleas = this.devis.moyenneAleas / nombreOuvrage
      this.devis.moyenneBenefice = this.devis.moyenneBenefice / nombreOuvrage
      this.sharedData.entrepriseId = data.EntrepriseId;
      this.getAllOuvrage(data.EntrepriseId);
      this.getAllCouts(data.EntrepriseId)
      // this.getAllOuvrageFraisDeChantier(data.EntrepriseId)

      this.getSommeOuvrage()


      this.getSommeOuvrageFraisDeChantier()
      this.moyenneBeneficeAleasTotal()

      this.getSousLotHiddenForOuvrageId()
      this.getSousLotHiddenForCoutId()

    })
  }

  getLotFraisDeChantier(): void {
    this.devisService.getLotFraisDeChantier(this.devisId).subscribe(data => {
      this.lotFraisDeChantier = data.Lots[0];
      this.lotFraisDeChantier.SousLots.forEach(sousLot => {
        sousLot.prix = 0;
        this.getSommeSousLot(sousLot, this.lotFraisDeChantier)
      })
      // this.getAllOuvrageFraisDeChantier(data.EntrepriseId)
      this.getSommeOuvrageFraisDeChantier()
      this.calculFraisDeChantierWithPrixChange()

    })

  }

  getAllOuvrage(id: number) {
    this.ouvrageService.getAllWithCouts(id).subscribe(data => {
      this.listOuvrage = data;
      this.listOuvrageFraisDeChantier = data;
    })
  }

  getAllCouts(id: number) {
    this.coutService.getAll(id).subscribe(data => {
      this.listCout = data;
    })
  }

  createLOT(): void {
    this.lotService.create(this.form.getRawValue()).subscribe(() => {
      this.getAllLots()
      this.getLotFraisDeChantier()
      this.success("Nouveau lot crée!")

    })
  }


  createSousLot(): void {
    this.sousLotService.create(this.form.getRawValue(), this.curentLotId).subscribe(() => {
      this.getAllLots()
      this.getLotFraisDeChantier()
    })
  }


  deleteLot(id: number): void {
    const dialogRef = this.dialog.open(DialogConfirmSuppComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.lotService.deleteByID(id).subscribe(() => {
          this.success("Lot effacer!")
          this.getAllLots()
          this.getLotFraisDeChantier()
          // this.ngOnInit()

        })      }
    });

  }

  deleteOuvrageDuDevis(id: number): void {
    const dialogRef = this.dialog.open(DialogConfirmSuppComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ouvrageService.deleteOuvrageDuDevisByID(id).subscribe((res) => {
          this.success("Ouvrage effacer!")
         // this.ngOnInit()
          this.getAllLots()
          this.getLotFraisDeChantier()

        })      }
    });

  }

  deleteSousLot(id: number): void {
    const dialogRef = this.dialog.open(DialogConfirmSuppComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sousLotService.deleteByID(id).subscribe(() => {
          this.success("sous-lot effacer!")
          this.getAllLots()
          this.getLotFraisDeChantier()

        });      }
    });
  }


  openDialog(sousLotId: number) {
    this.dialog.open(DialogComponent, {
      panelClass: "test",
      data: this.listOuvrage,
      width: '90%',
      height: '70%'
    }).afterClosed().subscribe(result => {
      if (result) {
        this.selectedOuvrageIds = result.selectedOuvrageIds;
        this.createOuvrageDuDevis(sousLotId)
      } else {
        // Afficher un message d'erreur si aucun sous-lot n'est sélectionné
        this.warning("error",);
      }

    });
  }

  getSousLotHiddenForOuvrageId() {
    console.log("toto", this.devis)

    this.sousLotService.getSousLotHiddenForOuvrage(this.devis.id).subscribe(data => {
      console.log("tito", data)
      this.hiddenSousLotForOuvrageId = data.id

    });
  }

  getSousLotHiddenForCoutId() {
    this.sousLotService.getSousLotHiddenForCout(this.devis.id).subscribe(data => {
      console.log("data get sous lot hidden",data)
      this.hiddenSousLotForCoutId = data.id
    });
  }

  openDialogCreate(sousLotId: number) {
    this.dialog.open(FormOuvrageComponent, {
      data: {sousLotId: sousLotId, devisId: this.devisId},
      width: '90%',
      height: '40%'
    }).afterClosed().subscribe(() => {
      this.getAllLots()
      this.getLotFraisDeChantier();
    })
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
    console.log("sous lot id ", sousLotId)
    let prixOuvrage = 0;
    //boucle sur tous les ouvrages selectionner dans la modal
    this.selectedOuvrageIds.forEach((ouvrageId: any) => {
      //recupere les ouvrages grace a leurs id
      this.ouvrageService.getById(ouvrageId).subscribe(data => {
        // console.log("ouvrage", data)
        //creer un ouvrageDuDevis avec les données de l'ouvrage
        const allDataOuvrageDevis = {...data, alteredBenefOrAleas: true}
        console.log("ouvrage", allDataOuvrageDevis)
        this.ouvrageService.createOuvrageDuDevis(allDataOuvrageDevis).subscribe(response => {
          console.log("ouvrage du devis",response)
          data.OuvragesElementaires.forEach((ouvrageElem:OuvrageElementaire)=>{
            const ouvrageElemDuDevis = ouvrageElem;
            ouvrageElemDuDevis.quantite = 1;
            this.ouvrageElementaireService.createOuvrageElementaireDuDevis(ouvrageElemDuDevis).subscribe(resOuvrageElementaireDuDevis=>{
              console.log("resOuvrageElementaireDuDevis",resOuvrageElementaireDuDevis)
              console.log("resOuvrageElementaireDuDevis",resOuvrageElementaireDuDevis.OuvrageElemDuDevis.id)
              this.ouvrageElementaireCoutService.createOuvrageOuvrageElemDuDevis({OuvrageDuDeviId:response.OuvrageDuDevis?.id, OuvrElemDuDeviId:resOuvrageElementaireDuDevis.OuvrageElemDuDevis.id}).subscribe(()=>{
                if(ouvrageElem.Couts)
                ouvrageElem.Couts.forEach((cout: any) => {
                  console.log("cout de l ouvrage elementaire", cout)
                  this.coutDuDevis = cout;
                  this.coutDuDevis.fournisseur = cout.Fournisseur.commercialName
                  this.coutDuDevis.remarque = cout.Fournisseur.remarque !== null ? cout.Fournisseur.remarque : ""
                  //donne comme valeur undefined a l'id sinon le coutDuDevis sera creer avec l'id du Cout
                  this.coutDuDevis.id = undefined
                  this.coutDuDevis.type = cout.TypeCout.type
                  this.coutDuDevis.categorie = cout.TypeCout.categorie
                  //   //creer le coutDuDevis
                  this.coutService.createCoutDuDevis(this.coutDuDevis).subscribe(responseCout => {
                    const uRatio = `${cout.unite}/${resOuvrageElementaireDuDevis.OuvrageElemDuDevis.unite}`

                    const ouvrageElemCoutDuDevis = {
                      OuvrElemDuDeviId: resOuvrageElementaireDuDevis.OuvrageElemDuDevis.id,
                      CoutDuDeviId: responseCout?.id,
                      ratio: 1,
                      efficience:1,
                      uRatio: uRatio,

                    }

                      console.log("ouvrage elementaire cout du devis", ouvrageElemCoutDuDevis)

                    this.ouvrageElementaireCoutService.createOuvrageElemCoutDuDevis(ouvrageElemCoutDuDevis).subscribe()
                  })
                })
              })
            })
          })
          //recupere l'id de l'ouvrageDuDevis qui viens d'etre creer, et
          // data.OuvrageDuDeviId = response.OuvrageDuDevis?.id
          //boucle sur tous les couts qui appartiennent au ouvrage
          data.Couts.forEach((cout: any) => {
            //creer un coutDuDevis avec les données du cout

            // prixOuvrage += cout.prixUnitaire * (cout.OuvrageCout.ratio)
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
          if (prixOuvrage === 0) {
            prixOuvrage = data.prix
          }
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
          console.log("sous lot ouvrage du devis", this.sousLotOuvrageDuDevis)
          //creer le sousLotOuvrageDuDevis
          // this.ouvrageService.createSousLotOuvrageForDevis(this.sousLotOuvrageDuDevis).subscribe(() => {
          this.sousLotOuvrageService.createSousLotOuvrage(this.sousLotOuvrageDuDevis).subscribe(() => {
            //rafraichi la data
            this.formQuantityOuvrage()
            this.getAllLots()
            this.getLotFraisDeChantier()
          })
        })

      })

    });
    this.getSommeOuvrage()
    this.getSommeOuvrageFraisDeChantier()
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

  autoFocus() {
    this.form.controls['designation'].setValue('');
    this.showForm = true;
    setTimeout(() => {
      this.aForm.nativeElement.focus();
    }, 100)
  }
  autoFocus2() {
    this.form.controls['designation'].setValue('');
    this.showForm = true;
    setTimeout(() => {
      this.aForm2.nativeElement.focus();
    }, 100)
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


  private dyanmicDownloadByHtmlTag(arg: { fileName: string; text: string }) {
    if (!this.setting.element.dynamicDownload) {
      this.setting.element.dynamicDownload = document.createElement('a');
    }
    const element = this.setting.element.dynamicDownload;
    const fileType = 'text/plain';
    element.setAttribute(
      'href',
      `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`
    );
    element.setAttribute('download', arg.fileName);

    var event = new MouseEvent('click');
    element.dispatchEvent(event);
  }

  async formatDevisForExport() {
    this.testLots.forEach((lot: Lot, indexLot: number) => {
      this.devisExport.lot.push({
        designation: lot.designation,
        prix: 0,
        sousLot: []
      })
      lot.SousLots.forEach((sousLot: SousLot, indexSousLot: number) => {
        const nouveauSousLot = {
          designation: sousLot.designation,
          prix: 0,
          ouvrage: []
        }
        this.devisExport.lot[indexLot + 1].sousLot.push(nouveauSousLot)
        sousLot.OuvrageDuDevis.forEach((ouvrage: any) => {
          const nouveauOuvrage = {
            designation: ouvrage.designation,
            unite: ouvrage.unite,
            quantite: ouvrage.SousLotOuvrage.quantityOuvrage,
            prixUnitaire: ouvrage.SousLotOuvrage.prixUniVenteHT,
            totalHT: ouvrage.SousLotOuvrage.prixVenteHT
          }
          this.devisExport.lot[indexLot + 1].sousLot[indexSousLot].prix += nouveauOuvrage.totalHT
          this.devisExport.lot[indexLot + 1].sousLot[indexSousLot].ouvrage.push(nouveauOuvrage)
          // }
        })
        this.devisExport.lot[indexLot + 1].prix += this.devisExport.lot[indexLot + 1].sousLot[indexSousLot].prix
      })
    })
    console.log("devis export", this.devisExport)
  }

  async formatFraisDeChantierForExport() {
    this.devisExport.lot = []
    this.devisExport.lot.push({
      designation: this.lotFraisDeChantier.designation,
      prix: 0,
      sousLot: []
    })
    this.lotFraisDeChantier.SousLots.forEach((sousLot: SousLot, indexSousLot: number) => {
      console.log(sousLot)
      const nouveauSousLot = {
        designation: sousLot.designation,
        prix: 0,
        ouvrage: []
      }
      this.devisExport.lot[0].sousLot.push(nouveauSousLot)
      sousLot.OuvrageDuDevis.forEach((ouvrage: any) => {
        const nouveauOuvrage = {
          designation: ouvrage.designation,
          unite: ouvrage.unite,
          quantite: ouvrage.SousLotOuvrage.quantityOuvrage,
          prixUnitaire: ouvrage.SousLotOuvrage.prixUniVenteHT,
          totalHT: ouvrage.SousLotOuvrage.prixVenteHT
        }
        this.devisExport.lot[0].sousLot[indexSousLot].prix += nouveauOuvrage.totalHT
        this.devisExport.lot[0].sousLot[indexSousLot].ouvrage.push(nouveauOuvrage)
      })
      this.devisExport.lot[0].prix += this.devisExport.lot[0].sousLot[indexSousLot].prix
    })
  }

  async dynamicDownloadTxt() {
    await this.formatFraisDeChantierForExport()
    await this.formatDevisForExport()
    this.dyanmicDownloadByHtmlTag({
      fileName: 'My Report',
      text: JSON.stringify(this.devisExport),
    });

  }

  openDialogLot(lot: Lot) {
    this.dialog.open(DialogLotComponent, {
      data: lot,
      width: '90%',
      height: '30%'
    }).afterClosed().subscribe(result => {
      this.getAllLots()
      this.getLotFraisDeChantier()
    });
  }

  openDialogSousLot(sousLot: SousLot) {
    this.dialog.open(DialogSouslotComponent, {
      data: sousLot,
      width: '90%',
      height: '30%'
    }).afterClosed().subscribe(result => {
      this.getAllLots()
      this.getLotFraisDeChantier()
    });
  }


}
