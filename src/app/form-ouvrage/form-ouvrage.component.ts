import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {OuvrageService} from "../_service/ouvrage.service";
import {ActivatedRoute} from "@angular/router";
import {User} from "../_models/users";
import {UserService} from "../_service/user.service";
import {MatDialogRef} from "@angular/material/dialog";
import {DialogComponent} from "../dialogListOuvrage/dialog.component";

@Component({
  selector: 'app-form-ouvrage',
  templateUrl: './form-ouvrage.component.html',
  styleUrls: ['./form-ouvrage.component.scss']
})
export class FormOuvrageComponent implements OnInit {
  public myFormGroup!: FormGroup;
  private currentUser!: User;

  constructor(private formBuilder: FormBuilder, private ouvrageService: OuvrageService, private userService: UserService,
              private dialogRef: MatDialogRef<DialogComponent>) {
  }

  ngOnInit(): void {
    this.getUserById()
    this.createFormOuvrage()

  }


  createOuvrage(): void {
    this.ouvrageService.create(this.myFormGroup.getRawValue()).subscribe()
  }
  closeDialog() {
    // Renvoyez la valeur de selectedOuvrageIds lors de la fermeture du dialogListOuvrage
    this.dialogRef.close();
  }


  createFormOuvrage(): void {
    this.myFormGroup = new FormGroup({
      designation: new FormControl(),
      benefice: new FormControl({value: 10, disabled: false}),
      aleas: new FormControl({value: 5, disabled: false}),
      unite: new FormControl(),
      ratio: new FormControl(),
      uRatio: new FormControl(),
      EntrepriseId: new FormControl(),
    });
  }

  getUserById(): void {
    this.currentUser = this.userService.userValue;
    this.userService.getById(this.currentUser.id).subscribe(data => {
      this.myFormGroup.controls["EntrepriseId"].setValue(data.Entreprises[0].id)
    })
  }


}
