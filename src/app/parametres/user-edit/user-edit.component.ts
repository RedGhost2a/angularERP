import {Component, Inject, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../_service/user.service";
import {Toastr, TOASTR_TOKEN} from "../../_service/toastr.service";
import {AlertService} from "../../_service/alert.service";
import {EntrepriseService} from "../../_service/entreprise.service";
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogComponent} from "../../dialogListOuvrage/dialog.component";


@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  @Input() updateUser!: UserEditComponent
  userForm!: FormGroup;
  titreForm: string = "Créer un utilisateur";
  disabled = false;
  listEntreprise: any[] = [];
  avatarUrl: any;
  role!: string;
  entrepriseId: number [] = [];
  initialData: any;
  userId = this.userService.userValue.id;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private userService: UserService, private formBuilder: FormBuilder, private alerteService: AlertService,
              private route: ActivatedRoute, private router: Router, @Inject(TOASTR_TOKEN) private toastr: Toastr, private entrepriseService: EntrepriseService,
              private dialogRef: MatDialogRef<DialogComponent>) {

    this.initialData = data;
  }

  ngOnInit(): void {
    this.getUserById()
    this.getEntrepriseForUser();
    this.createFormUser()
    if (this.initialData !== null) {
      console.log(this.initialData)
      this.generateFormUpdate()
    }
  }

  createFormUser(): void {
    console.log(this.userService.userValue.role)
    this.userForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      passwordConfirm: new FormControl('', Validators.required),
      title: new FormControl('', Validators.required),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      role: new FormControl('', Validators.required),
      avatarUrl: new FormControl('', Validators.required),
      EntrepriseId: new FormControl('', Validators.required)
    });
  }

  generateFormUpdate(): void {
    this.titreForm = "Modification d'un utilisateur "
    this.initialData.Entreprises.forEach((entreprise: any) => {
      this.entrepriseId.push(entreprise.id)

    })
    this.userForm.controls['EntrepriseId'].setValue(this.entrepriseId)
    this.userForm.patchValue(this.initialData)
  }

  success(message: string): void {
    this.toastr.success(message, "Succès");
  }

  warning(message: string): void {
    this.toastr.warning(message, "Attention");
  }

  avatars: string[] = [
    "avatar.png",
    "avatar1.png",
    "avatar2.png",
    "avatar3.png",
    "deadpool.png",
    "iron-man.png",
    "thanos.png",
    "thor-avengers.png",
    "BiopuraGTP.jpg"

  ]

  selectedAvatar = this.avatars[0]

  // Fonction qui retourne le tableau d'avatars
  getAvatars(): string[] {
    // console.log(this.avatars)
    return this.avatars;
  }

  createAndUpdate(): void {
    const password = this.userForm.get('password')?.value;
    const confirmPassword = this.userForm.get('passwordConfirm')?.value;
    this.userForm.markAllAsTouched();
    if (this.userForm.invalid) {
      // Form is invalid, show error message
      this.toastr.error("Le formulaire est invalide.", "Erreur !");
      return;
    }
    if (this.initialData === null) {
      this.userService.register(this.userForm.getRawValue()).subscribe(data => {
        this.closeDialog();
      });
    } else {
      this.userService.update(this.userForm.getRawValue(), this.initialData.id).subscribe(data => {
        this.closeDialog();
      });
    }
  }

  closeDialog() {
    // Renvoyez la valeur de selectedOuvrageIds lors de la fermeture du dialogListOuvrage
    this.dialogRef.close();
  }

  previewAvatar(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.avatarUrl = e.target.result;
    }
    reader.readAsDataURL(file);
  }

  getUserById(): void {
    this.userService.getById(this.userId).subscribe(data => {
      this.role = data.role;
      console.log("getUser by id", this.entrepriseId)
    })
  }

  getEntrepriseForUser() {
    this.entrepriseService.getAll().subscribe((data: any) => {
      this.listEntreprise = data
    })

  }


}
