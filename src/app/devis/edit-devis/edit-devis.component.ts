import {Component, Inject, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {DevisService} from "../../_service/devis.service";
import {ClientService} from "../../_service/client.service";
import {Client} from "../../_models/client";
import {Entreprise} from "../../_models/entreprise";
import {EntrepriseService} from 'src/app/_service/entreprise.service';
import {Toastr, TOASTR_TOKEN} from "../../_service/toastr.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../_service/user.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DialogComponent} from "../../dialogListOuvrage/dialog.component";
import {Devis} from "../../_models/devis";
import {map, Observable, startWith} from "rxjs";

@Component({
  selector: 'app-edit-devis',
  templateUrl: './edit-devis.component.html',
  styleUrls: ['./edit-devis.component.scss']
})
export class EditDevisComponent implements OnInit {
  public myFormGroup!: FormGroup;
  userId = this.userService.userValue.id;
  listClient !: Client[];
  listEntreprise !: Entreprise[];
  @Input() entreprise!: Entreprise;
  @Input() client!: Client;
  initialData: Devis;
  titreForm = "Création d'un devis";
  textForm = "Afin de créer un devis, veuillez renseigner les champs suivants.";
  textButton = "Créer ce devis";
  curentUserEntreprise!: any[];
  clientId!: number;
  filteredOptions!: Observable<string[]>;
  options: string[] = [];
  hideClientField: boolean = false;
  EntrepriseId!: number;


  constructor(@Inject(MAT_DIALOG_DATA) public data: Devis,
              private dialogRef: MatDialogRef<DialogComponent>,
              private formBuilder: FormBuilder,
              private devisService: DevisService,
              private clientService: ClientService,
              private entrepriseService: EntrepriseService,
              @Inject(TOASTR_TOKEN) private toastr: Toastr,
              private router: Router,
              private userService: UserService,
              private route: ActivatedRoute,
              private dialog: MatDialog,) {
    this.initialData = data;

  }

  ngOnInit(): void {
    this.getAllEntreprise()
    this.createFormDevis()
    this.getEnterpriseByUser()
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }



  createFormDevis(): void {
    const currentUrl = this.router.url;
    if (currentUrl.includes('clients')) {
      this.clientId = this.data.ClientId;
      this.EntrepriseId = this.data.EntrepriseId;

      console.log(this.data)
      this.myFormGroup = new FormGroup({
        id: new FormControl(),
        name: new FormControl("", Validators.required),
        status: new FormControl({value: 'Initialisation', disabled: true}, Validators.required),
        ClientId: new FormControl(this.clientId, Validators.required),
        EntrepriseId: new FormControl("", Validators.required),
        UserId: new FormControl(this.userId),
        percentFraisGeneraux: new FormControl(20),
        fraisGeneraux: new FormControl(0),
        coutTotal: new FormControl(0),
        debourseSecTotal: new FormControl(0),
        totalDepense: new FormControl(0),
        moyenneBenefice: new FormControl(0),
        moyenneAleas: new FormControl(0),
        moyenneBeneficeAleas: new FormControl(0),
        coeffEquilibre: new FormControl(0),
        prixEquiHT: new FormControl(0),
        beneficeInEuro: new FormControl(0),
        aleasInEuro: new FormControl(0),
        prixCalcHT: new FormControl(0),
        prixVenteHT: new FormControl(0),
        beneficeAleasTotal: new FormControl(0),
        validityTime: new FormControl(90),
        beneficeInPercent: new FormControl(),
        aleasInPercent: new FormControl(),
      });
      this.hideClientField = true;
      this.myFormGroup.get('EntrepriseId')?.setValue(this.EntrepriseId);


    }else {
      this.myFormGroup = new FormGroup({
        id: new FormControl(),
        name: new FormControl("", Validators.required),
        status: new FormControl({value: 'Initialisation', disabled: true}, Validators.required),
        ClientId: new FormControl("", Validators.required),
        EntrepriseId: new FormControl("", Validators.required),
        UserId: new FormControl(this.userId),
        percentFraisGeneraux: new FormControl(20),
        fraisGeneraux: new FormControl(0),
        coutTotal: new FormControl(0),
        debourseSecTotal: new FormControl(0),
        totalDepense: new FormControl(0),
        moyenneBenefice: new FormControl(0),
        moyenneAleas: new FormControl(0),
        moyenneBeneficeAleas: new FormControl(0),
        coeffEquilibre: new FormControl(0),
        prixEquiHT: new FormControl(0),
        beneficeInEuro: new FormControl(0),
        aleasInEuro: new FormControl(0),
        prixCalcHT: new FormControl(0),
        prixVenteHT: new FormControl(0),
        beneficeAleasTotal: new FormControl(0),
        validityTime: new FormControl(90),
        beneficeInPercent: new FormControl(),
        aleasInPercent: new FormControl(),
      });
    }


  }
  getAllClient(entrepriseId: number): void {
    this.clientService.getAllByEntreprise(entrepriseId).subscribe((data: any) => {
      this.listClient = data
      data.forEach((client: any) => {
        this.options.push(client.denomination)
      })
      // console.log('deno ?',data)
      this.filterClient()
    })
  }

  filterClient() {
    console.log('option', this.options)

    // @ts-ignore
    this.filteredOptions = this.myFormGroup.get('ClientId').valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    console.log('filter', this.filteredOptions)
  }

  getAllEntreprise(): void {
    this.entrepriseService.getAll().subscribe(data => this.listEntreprise = data)
  }

  success(message: string): void {
    this.toastr.success(message, "Succès");
  }

  warning(message: string): void {
    this.toastr.warning(message, "Attention");
  }

  createDevis(): void {
    console.log(this.myFormGroup.getRawValue());
    this.myFormGroup.markAllAsTouched();
    if (this.myFormGroup.invalid) {
      // Form is invalid, show error message
      this.toastr.error("Le formulaire est invalide.", "Erreur !");
      return;
    }
    console.log(this.myFormGroup.get('ClientId'))
    // if (isNaN(devisId))
    this.clientService.getByDenomination(this.myFormGroup.get('ClientId')?.value).subscribe((data: any) => {
      console.log(data)
      // this.myFormGroup.controls['uRatio'].setValue(`${unite}/h`)
      const currentUrl = this.router.url;
      if (!currentUrl.includes('clients')) {

        this.myFormGroup.controls['ClientId'].setValue(data[0].id)
      }
      this.devisService.create(this.myFormGroup.getRawValue())
        .subscribe(
          () => {
            // Devis created successfully, show success message
            this.toastr.success("Devis créé avec succès.", "Succès !");
            this.closeDialog()

            this.router.navigate(['/devis']);
          },
          (error) => {
            // Error occurred, show error message
            console.log(error);
            this.toastr.error("Une erreur est survenue lors de la création du devis.", "Erreur !");
          }
        );
    })
  }
  // updateDevis(devis:Devis,id:number){
  //   const dialogEditDevis = this.dialog.open(EditDevisComponent);
  //
  //   dialogEditDevis.afterClosed().subscribe(result=>{
  //     if (result){
  //       this.devisService.update(devis,id).subscribe(data=>{
  //         console.log(data)
  //       })
  //     }
  //   })
  //
  // }



  closeDialog() {
    // Renvoyez la valeur de selectedOuvrageIds lors de la fermeture du dialogListOuvrage
    this.dialogRef.close();
  }

  getEnterpriseByUser(): any {
    const currentUser = this.userService.userValue.id;
    this.userService.getById(currentUser).subscribe(value => {
      this.curentUserEntreprise = value.Entreprises
      console.log(this.curentUserEntreprise)
      this.getAllClient(this.curentUserEntreprise[0].id)
    })

  }
}

