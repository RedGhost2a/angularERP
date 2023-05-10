import {Component, Inject, Input, OnInit} from '@angular/core';
import {ClientService} from "../../_service/client.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Toastr, TOASTR_TOKEN} from "../../_service/toastr.service";
import {NGXLogger} from "ngx-logger";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogComponent} from "../../dialogListOuvrage/dialog.component";
import {Client} from "../../_models/client";
import {User} from "../../_models/users";
import {UserService} from "../../_service/user.service";
import {da} from "date-fns/locale";


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  @Input() updateClient!: EditComponent
  myFormGroup!: FormGroup;
  formGroup!: FormGroup
  initialData: any ;
  textButton: string = "Créer le client";
  titreForm: string = "Création d'un client";
  textForm: string = "Veuillez créer un nouveau client comme destinataire du devis. Il sera disponible dans l'interface de création de devis"
  currentUser!: User;
  // isDisabled: boolean = false;


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
    this.currentUser = this.userService.userValue;
    this.userService.getById(this.currentUser.id).subscribe(data => {
      this.myFormGroup.controls["EntrepriseId"].setValue(data.Entreprises[0].id)
    })

    if (this.initialData[0] !== null)
      this.generateFormUpdate();
    if(this.initialData[1] === true){
       this.generateFormRead()
    }


  }


  success(message: string): void {
    this.toastr.success(message, "Succes",);
  }

  warning(message: string): void {
    this.toastr.warning(message, "Attention",);
  }

  createFormClient(): void {
    // console.log(entrepriseId)
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
        adresses: new FormControl('', [Validators.required] ),
        city: new FormControl('', [Validators.required]),
        country: new FormControl('France'),
        zipcode: new FormControl(''),
      })
    });
  }

  createAndUpdate(): void {
      console.log(this.myFormGroup.getRawValue())
    this.myFormGroup.markAllAsTouched();
    if (this.myFormGroup.invalid) {
      // Form is invalid, show error message
      this.toastr.error("Le formulaire est invalide.", "Erreur !");
      return;
    }
    if (this.initialData[0] === null) {
      console.log('client', this.myFormGroup.getRawValue())
      this.clientService.register(this.myFormGroup.getRawValue()).subscribe(data => {
        this.closeDialog();
      });
    } else {
      console.log("UPDATE", this.myFormGroup.getRawValue())
      this.clientService.update(this.myFormGroup.getRawValue(), this.initialData[0].id).subscribe(data => {
        this.closeDialog();
      });
    }
  }

  closeDialog() {
    // Renvoyez la valeur de selectedOuvrageIds lors de la fermeture du dialogListOuvrage
    this.dialogRef.close();
  }

  generateFormUpdate(): void {
    console.log("upd")
    this.titreForm = "Modifier le client"
    this.textForm = "La modification de ce client sera valable sur l'ensemble des devis sur lesquels il est associé."
    this.textButton = "Modifier le client"
    console.log(this.myFormGroup.getRawValue())
    this.myFormGroup.patchValue(this.initialData[0])
  }
   generateFormRead() {
    this.titreForm = "Détail du client"
    this.textForm = ""
    this.textButton = "Modifier le client"
    this.myFormGroup.patchValue(this.initialData[0])
    Object.keys(this.myFormGroup.controls).forEach(async key => {
      console.log("key",key)
      if (this.myFormGroup.controls[key].value === ""|| this.myFormGroup.controls[key].value === null || this.myFormGroup.controls[key].value === undefined) {
        this.myFormGroup.controls[key].setValue('-')
      }
    });

    console.log(this.myFormGroup.getRawValue())

    this.myFormGroup.disable()

  }


}
