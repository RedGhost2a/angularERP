import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
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
import {Ouvrage} from "../_models/ouvrage";


@Component({
  selector: 'app-create-devis',
  templateUrl: './create-devis.component.html',
  styleUrls: ['./create-devis.component.scss']
})
export class CreateDevisComponent implements OnInit {
  lotFraisDeChantier!: Lot;
  form!: FormGroup;
  testLots!:Lot[];
  showForm = false;
  isLot: boolean = false;
  devisId!: number;
  curentLotId!: number;
  currentSousLotId!: number;
  listOuvrage!: Ouvrage[];
  selectedOuvrageIds: number [] = [] ;
  hiddenChildren = new Map<number, boolean>();
  expandedLotId!: number | undefined;
  prixOuvrage!:number;


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
              public dialog: MatDialog,
  ) {
    this.expandedLotId = undefined;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.devisId = +params['id']
      this.form = new FormGroup({
        designation: new FormControl(),
        devisId: new FormControl(this.devisId)
      });
    });
    this.getLotFraisDeChantier();
    this.getAllLots();
  }





    //recuperation de tous les lots du devis SAUF les lot "Frais de chantier" pour l'onglet DEVIS;
  getAllLots():void{
    this.devisService.getByIdExceptFrais(this.devisId).subscribe(data =>{
      console.log("console log de getalllots  SOUS LOT DATA:",data.Lots.SousLots)
      this.testLots = data.Lots;
      console.log("console log de DATA : ", data)
      //recuperation de tous les ouvrages de l'entreprise
      this.getAllOuvrage(data.EntrepriseId);
    })
  }


  //recuperation du lot generer automatiquement a la creation du devis, avec comme designation
                              //"Frais de chantier"
  getLotFraisDeChantier():void{
    this.lotService.getLotFraisDeChantier(this.devisId).subscribe(data=>{
      this.lotFraisDeChantier = data;
    })
  }

  getAllOuvrage(id: number) {
    console.log("console log id get all ouvrage",id)
    this.ouvrageService.getAll(id).subscribe(data => {
      console.log("Ouvrage de l'entreprise : ", data)
      this.listOuvrage = data;
    })
  }

  createLOT():void{
    //const currentLot = this.form.getRawValue();
    console.log("console log du formulaire ",this.form.getRawValue())
    this.lotService.create(this.form.getRawValue()).subscribe(()=>{
      this.getAllLots()
    })
  }


  createSousLot(): void{
    console.log("console.log de sous lot id",this.curentLotId)
    this.sousLotService.create(this.form.getRawValue(),this.curentLotId).subscribe(()=>{
      this.getAllLots()
    })
  }

  createOuvrageSousLot(sousLotId:number): void {
    this.selectedOuvrageIds.forEach((ouvrageId: any) => {
      console.log(ouvrageId)
      const data = {
        ouvrageId: ouvrageId,
        sousLotId: sousLotId
      };
      this.ouvrageService.createSousLotOuvrageForDevis(data).subscribe(()=>{
        this.getAllLots()
      })
    });
  }



  deleteLot(id: number): void {
    this.lotService.deleteByID(id).subscribe(() => {
      this.getAllLots()
    })
  }
  deleteSousLot(id:number): void{
    this.sousLotService.deleteByID(id).subscribe(()=>{
      this.getAllLots()
    });
  }


  openDialog(sousLotId:number) {
    this.dialog.open(DialogComponent, {
      data: this.listOuvrage,
      width: '90%',
      height: '70%'
    }).afterClosed().subscribe(result => {
      if (result) {
        this.selectedOuvrageIds = result.selectedOuvrageIds;
          this.createOuvrageSousLot(sousLotId)
        } else {
          // Afficher un message d'erreur si aucun sous-lot n'est sélectionné
          this.warning("error",);
        }

    });
  }



  success(message: string): void {
    this.toastr.success(message, "Succès");
  }

  warning(message: string): void {
    this.toastr.warning(message, "Attention");
  }



  onSubmit(value: string, id: number | null) {
    if (this.isLot) {
      this.createSousLot()
    } else {
      this.createLOT()
    }
    this.showForm = false;
  }



  setExpandedLotId(id: number) {
    console.log("set exp",id)
    if (this.expandedLotId === id) {
      // si l'identifiant du lot déplié est le même que celui du lot actuellement déplié, on replie le lot
      this.expandedLotId = undefined;
    } else {
      // sinon, on déplie le lot
      this.expandedLotId = id;
    }
  }

}




