import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { UserService } from "../../_service/user.service";
import {Toastr, TOASTR_TOKEN} from "../../_service/toastr.service";
import {MatDialog} from "@angular/material/dialog";
import {User} from "../../_models/users"; // Assurez-vous d'importer le UserService

@Component({
  selector: 'app-user-edit-password',
  templateUrl: './user-edit-password.component.html',
  styleUrls: ['./user-edit-password.component.scss']
})
export class UserEditPasswordComponent implements OnInit {
currentUser!:User

  userForm = new FormGroup({
    oldPassword:new FormControl ('', [Validators.required]),
    password: new FormControl ('', [Validators.required,Validators.minLength(8)]),
    confirmNewPassword: new FormControl ('', [Validators.required,Validators.minLength(8)]),
    firstConnexion: new FormControl()
  })



  constructor(
    private fb: FormBuilder,
    private userService: UserService ,
    @Inject(TOASTR_TOKEN) private toastr: Toastr,
    private dialog: MatDialog

  ) { }

  ngOnInit(): void {
    this.currentUser = this.userService.userValue
  }




  onSubmit() {
    if (this.userForm.valid) {
      if(this.userForm.getRawValue().password === this.userForm.getRawValue().confirmNewPassword) {
        let password = this.userForm.getRawValue().password;
        let oldPassword = this.userForm.getRawValue().oldPassword;
        let firstConnexion = this.userForm.get('firstConnexion');
        if(password && oldPassword && firstConnexion) {
          firstConnexion.setValue(false);
          this.userService.updatePassword(this.userService.userValue.id, oldPassword, password, firstConnexion.value)
            .subscribe(
              success => {
                this.toastr.success('Vous avez bien modifié votre mot de passe', "Succès");
                this.dialog.closeAll();
              },
              error => {
                this.toastr.error('Votre ancien mot de passe est incorrect', "Erreur");
              }
            );
        } else {
          // Le nouveau mot de passe est null, gérer cette situation comme vous le souhaitez
        }
      } else {
        // Les mots de passe ne correspondent pas, montrer une erreur
        this.toastr.warning('Les mots de passe ne correspondent pas', "Attention");
      }
    }
  }}
