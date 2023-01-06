import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {LotService} from "../_service/lot.service"
import {ActivatedRoute, Router} from "@angular/router";
import {Toastr, TOASTR_TOKEN} from "../_service/toastr.service";
import {SousLotService} from "../_service/sous-lot.service";
import {DevisService} from "../_service/devis.service";
import {Devis} from "../_models/devis";
import {DataSharingService} from "../_service/data-sharing-service.service";
import {Observable, Subject} from "rxjs";
import {OuvrageService} from "../_service/ouvrage.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../dialog/dialog.component";
import {Lot} from "../_models/lot";
import {SousLot} from "../_models/sous-lot";


@Component({
  selector: 'app-create-devis',
  templateUrl: './create-devis.component.html',
  styleUrls: ['./create-devis.component.scss']
})
export class CreateDevisComponent implements OnInit {
  devis !: Devis;
  form: FormGroup;
  lotsDevis!: Observable<any>;
  souslotsDevis: Subject<any> = new Subject();
  showForm = false;
  showTable = false;
  currentLot: any;
  devisId!: number;
  curentLotId!: number;
  lotId!: number;
  sousLotId!: number;
  ouvrages: any[] = [];
  sousLotOuvrages!: [];
  lots!: any[];
  sousLots: any[] = []; // Tableau pour stocker les sous-lots
  listOuvrage: any[] = [];
  entrepriseId!: number;
  // ouvrageId!: number;
  selectedOuvrageIds!: any;
  currentSousLot!: any;
  currentSousLotId!: any;
  hiddenChildren = new Map<number, boolean>();
  lot!: Lot[];
  sousLot!: SousLot[];
  cout: any[] = [];
  coutElement: any[] = [];
  expandedLotId!: number | undefined;

//TODO ON NE PEUT METTRE QUE UN SEUL ET MEME OUVRAGE PAR SOUS_LOT; //

  constructor(private fb: FormBuilder,
              private lotService: LotService,
              private route: ActivatedRoute,
              private router: Router,
              @Inject(TOASTR_TOKEN) private toastr: Toastr,
              private sousLotService: SousLotService,
              private devisService: DevisService,
              private dataSharingService: DataSharingService,
              private changeDetectorRef: ChangeDetectorRef,
              private ouvrageService: OuvrageService,
              public dialog: MatDialog,
  ) {
    this.expandedLotId = undefined;

    this.form = this.fb.group({
      designation: [''],
      devisId: []
    });
  }

///fonction pour affchier et masquer les lot et sous lots
  toggleChildren(element: Lot) {
    // récupère l'identifiant de l'élément
    const id = element.id;
    // récupère l'état actuel de l'élément (masqué ou affiché)
    const currentState = this.hiddenChildren.get(id);
    // modifie l'état de l'élément en fonction de son état actuel
    this.hiddenChildren.set(id, !currentState);
    // masque tous les sous-lots liés au lot
    this.sousLots.forEach((sousLot) => {
      if (sousLot.LotSousLot && sousLot.LotSousLot.LotId === id) {
        this.hiddenChildren.set(sousLot.id, !currentState);
      }
    });

  }

  setExpandedLotId(id: number) {
    if (this.expandedLotId === id) {
      // si l'identifiant du lot déplié est le même que celui du lot actuellement déplié, on replie le lot
      this.expandedLotId = undefined;
    } else {
      // sinon, on déplie le lot
      this.expandedLotId = id;
    }
  }

  hasSublots(lot: Lot): boolean {
    for (const sublot of this.sousLots) {
      if (sublot.LotSousLot && sublot.LotSousLot.LotId === lot.id) {
        return true;
      }
    }
    return false;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.devisId = +params['id']; // Récupérer l'ID du devis dans l'URL
    });
    // console.log(this.showTable, this.curentLotId, this.lotId)
    this.lotsDevis = this.souslotsDevis.asObservable();

    this.refreshData();


  }

  refreshData() {
    this.lotsDevis = this.devisService.getById(this.devisId); // Récupérer le devis
    this.lotsDevis.subscribe(data => {
      this.entrepriseId = data.EntrepriseId;
      this.getAll(this.entrepriseId)
      // console.log(data)
      this.lots = data.Lots; // Récupérer les lots du devis
      for (let lot of this.lots) {
        for (let sublot of lot.SousLots) {
          // console.log(sublot)
          this.sousLots.push(sublot); // Ajouter le sous-lot au tableau sousLots
          if (sublot.Ouvrages && sublot.Ouvrages.length > 0) {
            // Display the ouvrages
            this.sousLotOuvrages = sublot.Ouvrages;
            for (let ouvrage of sublot.Ouvrages) {
              this.cout = ouvrage.CoutDuDevis
              for (let ct of this.cout) {
                this.coutElement.push(ct)
                console.log(ct)
                // this.souslotsDevis.next(this.sousLots)//NE MARCHE PAS EGALEMENT AVEC OBSERVABLE ET USERSUBJECT

              }
              // console.log(ouvrage)
              this.ouvrages.push(ouvrage);
            }
          }
        }
      }

    });

  }

///recuperation de l'id du lot  au click qui servira pour la suite du parcours
  handleLotClick(lotId: number) {
    console.log(`L'identifiant du lot cliqué est : ${lotId}`);
    // this.toggleForm();
    this.currentLot = this.lots.find(lot => lot.id === lotId);
    this.curentLotId = lotId;
    console.log(this.curentLotId)
    this.sousLotId = this.currentLot.SousLots.map((sublot: any) => sublot.id);
    console.log(this.sousLotId);
  }

  handleSousLotClick(sousLotId: number) {
    console.log(`L'identifiant du sous-lot cliqué est : ${sousLotId}`);
    this.currentSousLot = this.sousLots.find(sousLot => sousLot.id === sousLotId);
    this.currentSousLotId = sousLotId;
    console.log(this.currentSousLotId);
    this.curentLotId = this.currentSousLot.LotSousLot.LotId;
    console.log(`L'id du lot associé est : ${this.curentLotId}`);
  }

  hasOuvrages(sousLot: SousLot): boolean {
    let hasOuvrages = false;
    this.ouvrages.forEach((ouvrage) => {
      if (ouvrage.SousLotOuvrage && ouvrage.SousLotOuvrage.SousLotId === sousLot.id) {
        hasOuvrages = true;
      }
    });
    return hasOuvrages;
  }

  delete(id: number): void {
    this.lotService.deleteByID(id).subscribe(() => {
      this.refreshData()//pas sur a voir si c'est la bonne facon de faire
    })
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
      data: this.listOuvrage,
      width: '90%',
      height: '70%'
    }).afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
        // Récupérer les données renvoyées par le dialogue
        this.selectedOuvrageIds = result.selectedOuvrageIds;
        // Vérifier si un sous-lot est sélectionné
        if (this.currentSousLotId) {
          // Créer l'ouvrage pour le sous-lot sélectionné
          console.log(this.currentSousLotId, this.curentLotId)
          console.log(this.selectedOuvrageIds)
          this.createOuvrageSousLot()
          this.refreshData()///A voir

          // for (let ouvrage of this.listOuvrage) {
          //   this.idOuvrage = ouvrage.id;
          //   console.log("idOUvrage", this.idOuvrage, "idSousLot", this.curentLotId);
          //
          // }
        } else {
          // Afficher un message d'erreur si aucun sous-lot n'est sélectionné
          this.warning("error",);
        }
      }
    });
  }


  success(message: string): void {
    this.toastr.success(message, "Succès");
  }

  warning(message: string): void {
    this.toastr.warning(message, "Attention");
  }

  toggleForm() {
    this.showForm = !this.showForm;
    // console.log(this.showForm)

  }


  onSubmit(value: string, id: number) {
    if (this.currentLot) {
      this.createSousLot(this.curentLotId)
    } else {
      // Ajouter un lot
      this.createLOT()
      // console.log(this.lots)
    }
    this.showForm = false;
  }


  createLOT(): void {
    this.route.params.subscribe(params => {
      const devisId = +params['id']; // Récupérer devisId de la route
      console.log(devisId)
      const userLot = this.form.getRawValue();
      userLot.devisId = devisId; // Ajouter devisId aux données du formulaire
      this.lotService.create(userLot)
        .subscribe((response: any) => {
          this.lotsDevis = response.lot.lot
          this.lots.push(this.lotsDevis); // ajouts dans le tableaux
          // console.log(this.lotsDevis)
          const lotId = response.lot.lotId;
          console.log(lotId)
// Récupérer l'ID du lot créé et le stocker dans le service de partage de données
//           this.dataSharingService.setLotId(lotId);
          this.success("Nouveau lot en vue !")
          this.refreshData()
          this.changeDetectorRef.detectChanges(); // Déclencher la détection de changements manuellement//pas sur a voir

// this.router.navigate(['/devis']);
        }, error => {
          console.log(error)
          this.warning("Une erreur est survenue lors de la création")
        });
    });
  }


  createSousLot(lotId: number): void {
    this.route.params.subscribe(params => {
      console.log(params)
      // const lotId = this.dataSharingService.getLotId(); // Récupérer lotId du service de partage de données
      const userLot = this.form.getRawValue();
      // userLot.lotId = lotId; // Ajouter lotId aux données du formulaire
      this.sousLotService.create(userLot, lotId)
        .subscribe((response: any) => {
          this.souslotsDevis.next(response.sousLot); // Mettre à jour la valeur de l'observable avec le nouveau sous-lot///marche pas non plus
          // this.souslotsDevis = response.sousLot
          // this.souslotsDevis.next(response.sousLot)
          // console.log(this.souslotsDevis)
          // this.sousLots.push(this.souslotsDevis)
          //TODO: METTRE A JOUR L4AFFICHAGE DES SOUS_LOTS SANS RECHARGEMENT NE MARCHE PAS .A FAIRE ;
          this.changeDetectorRef.detectChanges(); // Déclencher la détection de changements manuellement
          // this.souslotsDevis.next(response.sousLot); // Mettre à jour la valeur de l'observable avec le nouveau sous-lot
          console.log(this.souslotsDevis)
          // this.refreshData()
          this.success("Nouveau sous-lot crée !");


        });

    })
  }

  getAll(id: number) {
    console.log(this.entrepriseId)
    this.ouvrageService.getAll(id).subscribe(data => {
      console.log("Ouvrage de l'entreprise : ", data)
      this.listOuvrage = data;
      // console.log(data[0].cout[0].type);
    })
  }

  createOuvrageSousLot() {
    this.selectedOuvrageIds.forEach((ouvrageId: any) => {
      console.log(ouvrageId)
      const data = {
        ouvrageId: ouvrageId,
        sousLotId: this.currentSousLotId
      };
      this.ouvrageService.createSousLotOuvrageForDevis(data).subscribe()
    });
  }


}




