import {Component, Inject, OnInit} from '@angular/core';
import {ClientService} from "../../_service/client.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Toastr, TOASTR_TOKEN} from "../../_service/toastr.service";
import {NGXLogger} from "ngx-logger";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogComponent} from "../../dialogListOuvrage/dialog.component";
import {UserService} from "../../_service/user.service";
import {Entreprise} from "../../_models/entreprise";


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  myFormGroup!: FormGroup;
  initialData: any;
  textButton: string = "Créer le client";
  titreForm: string = "Création d'un client";
  textForm: string = "Veuillez créer un nouveau client comme destinataire du devis. Il sera disponible dans l'interface de création de devis"
  currentEntreprise: Entreprise [] = [];


  constructor(private clientService: ClientService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              @Inject(TOASTR_TOKEN) private toastr: Toastr,
              private logger: NGXLogger,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<DialogComponent>, private userService: UserService) {

    this.initialData = this.data
  }


  ngOnInit(): void {
    this.createFormClient()
    this.getUserEntreprise()

    if (this.initialData[0] !== null) {
      this.generateFormUpdate();
    }
    if (this.initialData[1] === true) {
      this.generateFormRead()
    }


  }

  getUserEntreprise() {
    this.currentEntreprise = this.userService.currentUser.Entreprises
    console.log("current ",this.userService.currentUser)
  }


  success(message: string): void {
    this.toastr.success(message, "Succes",);
  }

  warning(message: string): void {
    this.toastr.warning(message, "Attention",);
  }

  createFormClient(): void {
    console.log("create form client")
    this.myFormGroup = new FormGroup({
      id: new FormControl(),
      firstName: new FormControl("",),
      lastName: new FormControl(""),
      denomination: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl(''),
      phonenumber: new FormControl(''),
      type: new FormControl('', [Validators.required]),
      tvaintra: new FormControl(0),
      siret: new FormControl(0),
      EntrepriseId: new FormControl(''),
      Adresse: new FormGroup({
        id: new FormControl(''),
        adresses: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        country: new FormControl('France'),
        zipcode: new FormControl(null),
      })
    });
  }

  createAndUpdate(): void {
    this.myFormGroup.markAllAsTouched();
    if (this.myFormGroup.invalid) {
      this.toastr.error("Le formulaire est invalide.", "Erreur !");
      return;
    }
    if (this.initialData[0] === null) {
      //creer le client , avec la response je recupere client.id et je creer l'adresse
      const adresseControl = this.myFormGroup.get('Adresse') as FormGroup;
      console.log("adresse", this.myFormGroup.get('Adresse'))
      console.log("adresse control", adresseControl.getRawValue())
      this.clientService.register(this.myFormGroup.getRawValue()).subscribe(response => {
        console.log("response client adresse", response.client.id)

        this.closeDialog();
      });
    } else {
      this.clientService.update(this.myFormGroup.getRawValue(), this.initialData[0].id).subscribe(data => {
        this.closeDialog();
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  generateFormUpdate(): void {
    this.titreForm = "Modifier le client"
    this.textForm = "La modification de ce client sera valable sur l'ensemble des devis sur lesquels il est associé."
    this.textButton = "Modifier le client"
    this.myFormGroup.patchValue(this.initialData[0])
    const adresseControl = this.myFormGroup.get('Adresse') as FormGroup;
    adresseControl.patchValue(this.initialData[0].Adresses[0])

  }

  generateFormRead() {
    this.titreForm = "Détail du client"
    this.textForm = ""
    this.textButton = "Modifier le client"
    console.log("initial data ", this.initialData)
    this.myFormGroup.patchValue(this.initialData[0])
    const adresseControl = this.myFormGroup.get('Adresse') as FormGroup;
    adresseControl.patchValue(this.initialData[0].Adresses[0])
    Object.keys(this.myFormGroup.controls).forEach(async key => {
      if (this.myFormGroup.controls[key].value === "" || this.myFormGroup.controls[key].value === null || this.myFormGroup.controls[key].value === undefined) {
        this.myFormGroup.controls[key].setValue('-')
      }
    });
    this.myFormGroup.disable()
  }


}
