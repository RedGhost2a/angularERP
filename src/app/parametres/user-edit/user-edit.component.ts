import {Component, Inject, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../_service/user.service";
import {Toastr, TOASTR_TOKEN} from "../../_service/toastr.service";
import {AlertService} from "../../_service/alert.service";
import {EntrepriseService} from "../../_service/entreprise.service";
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogComponent} from "../../dialogListOuvrage/dialog.component";
import { MatSnackBar } from '@angular/material/snack-bar';


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
              private dialogRef: MatDialogRef<DialogComponent>,
              private snackBar: MatSnackBar) {

    this.initialData = data;
  }

  ngOnInit(): void {

    console.log("user com")
    this.getUserById()
    this.getEntrepriseForUser();
    this.createFormUser()
    console.log(this.initialData)

    if (this.initialData !== null) {
      console.log(this.initialData)
      this.generateFormUpdate()
    }
  }

  createFormUser(): void {
    console.log(this.userService.userValue.role)
    this.userForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', ),
      // passwordConfirm: new FormControl('', Validators.required),
      title: new FormControl('', Validators.required),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      role: new FormControl('', Validators.required),
      avatarUrl: new FormControl('', Validators.required),
      EntrepriseId: new FormControl('', Validators.required),
      firstConnexion: new FormControl()
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
  generatePassword(firstName: string, lastName: string, entrepriseId: string): string {
    // Retirez tous les espaces et prenez les trois premières lettres de chaque chaîne
    let password = firstName.replace(/\s/g, '').substring(0, 3) +
      lastName.replace(/\s/g, '').substring(0, 3) +
      entrepriseId.replace(/\s/g, '').substring(0, 3);

    // Convertir en minuscules
    password = password.toLowerCase();

    return password;
  }

  createAndUpdate(): void {
    this.userForm.markAllAsTouched();
    if (this.userForm.invalid) {
      // Form is invalid, show error message
      this.toastr.error("Le formulaire est invalide.", "Erreur !");
      return;
    }
    if (this.initialData === null) {
      const password = this.generatePassword(this.userForm.getRawValue().firstName, this.userForm.getRawValue().lastName, this.userForm.getRawValue().EntrepriseId.toString());

      let pass =  this.userForm.get('password')
      let firstConnexion = this.userForm.get('firstConnexion')
      if (this.userForm && pass && firstConnexion) {
        pass.patchValue(password);
        firstConnexion.patchValue(true)
      }
      console.log(this.userForm.getRawValue())

      this.userService.register(this.userForm.getRawValue()).subscribe(data => {

        this.closeDialog();
//         alert(`Le mot de passe pour ${this.userForm.getRawValue().firstName} ${this.userForm.getRawValue().lastName} est : <strong>${password}</strong>
// <br> Merci de garder ce mot de passe en securité, il sera demandé à l'utilisateur lors de sa premiere connexion.`);
        this.snackBar.open(`Le mot de passe pour ${this.userForm.getRawValue().firstName} ${this.userForm.getRawValue().lastName} avec comme email${this.userForm.getRawValue().email} est: ${password}.
         Merci de garder ce mot de passe en securité, ainsi que sont adresse mail il lui seront demandé lors de sa première connexion.`, 'Fermer', {
          panelClass: ['red-snackbar']
        });

      });
    } else {
      console.log(this.userForm.getRawValue())
      this.userService.update(this.userForm.getRawValue(), this.initialData.id).subscribe(data => {

        this.closeDialog();
      });
    }
  }

  closeDialog() {
    // Renvoyez la valeur de selectedOuvrageIds lors de la fermeture du dialogListOuvrage
    this.dialogRef.close();
  }

  // previewAvatar(event: any) {
  //   const file = event.target.files[0];
  //   const reader = new FileReader();
  //   reader.onload = (e: any) => {
  //     this.avatarUrl = e.target.result;
  //   }
  //   reader.readAsDataURL(file);
  // }

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
