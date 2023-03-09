import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {OuvrageService} from "../_service/ouvrage.service";
import {User} from "../_models/users";
import {UserService} from "../_service/user.service";
import {MatDialogRef} from "@angular/material/dialog";
import {DialogComponent} from "../dialogListOuvrage/dialog.component";
import {Toastr, TOASTR_TOKEN} from "../_service/toastr.service";

@Component({
  selector: 'app-form-ouvrage',
  templateUrl: './form-ouvrage.component.html',
  styleUrls: ['./form-ouvrage.component.scss']
})
export class FormOuvrageComponent implements OnInit {
  public myFormGroup!: FormGroup;
  private currentUser!: User;

  constructor(private formBuilder: FormBuilder,
              private ouvrageService: OuvrageService,
              private userService: UserService,
              private dialogRef: MatDialogRef<DialogComponent>,
              @Inject(TOASTR_TOKEN) private toastr: Toastr) {
  }

  ngOnInit(): void {
    this.getUserById()
    this.createFormOuvrage()

  }


  createOuvrage(): void {
    this.myFormGroup.markAllAsTouched();
    if (this.myFormGroup.invalid) {
      // Form is invalid, show error message
      this.toastr.error("Le formulaire est invalide.", "Erreur !");
      return;
    }
    this.ouvrageService.create(this.myFormGroup.getRawValue()).subscribe(data => {
      this.closeDialog()
    })
  }

  closeDialog() {
    // Renvoyez la valeur de selectedOuvrageIds lors de la fermeture du dialogListOuvrage
    this.dialogRef.close();
  }


  createFormOuvrage(): void {
    this.myFormGroup = new FormGroup({
      designation: new FormControl('', Validators.required),
      benefice: new FormControl({value: 10, disabled: false}),
      aleas: new FormControl({value: 5, disabled: false}),
      unite: new FormControl('', Validators.required),
      ratio: new FormControl('', Validators.required),
      uRatio: new FormControl('', Validators.required),
      EntrepriseId: new FormControl('', Validators.required),
    });
  }

  getUserById(): void {
    this.currentUser = this.userService.userValue;
    this.userService.getById(this.currentUser.id).subscribe(data => {
      this.myFormGroup.controls["EntrepriseId"].setValue(data.Entreprises[0].id)
    })
  }


}
