import {Component, Inject, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../_service/user.service";
import {Toastr, TOASTR_TOKEN} from "../../_service/toastr.service";
import {AlertService} from "../../_service/alert.service";
import {ThemePalette} from "@angular/material/core";
import {EntrepriseService} from "../../_service/entreprise.service";
import {MatDialog} from '@angular/material/dialog';


@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  @Input() updateUser!: UserEditComponent
  userForm: FormGroup;
  textButton!: string;
  color: ThemePalette = 'accent';
  checked = true;
  disabled = false;
  listEntreprise: any[] = [];
  avatarUrl: any;
  avatarBlob!: any;
  fileName!: string;
  fileType!: string;

  constructor(private userService: UserService, private formBuilder: FormBuilder, private alerteService: AlertService,
              private route: ActivatedRoute, private router: Router, @Inject(TOASTR_TOKEN) private toastr: Toastr, private entrepriseService: EntrepriseService, public dialog: MatDialog) {

    this.userForm = new FormGroup({
      'email': new FormControl(''),
      'password': new FormControl(''),
      'title': new FormControl(''),
      'firstName': new FormControl(''),
      'lastName': new FormControl(''),
      'role': new FormControl(''),
      'avatarUrl': new FormControl(this.selectedAvatar),
      'EntrepriseId': new FormControl('')
    });

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
    this.route.params.subscribe(params => {
      const userID = +params['id']
      console.log(userID)
      if (isNaN(userID)) {
        const userData = this.userForm.getRawValue();
        // userData.avatarUrl = this.fileName;
        this.userService.register(userData).subscribe(
          (): void => {
            console.log(this.userForm.getRawValue())
            this.success("Nouvelle utilisateur en vue !")
            this.router.navigate(['/users']);

          }, error => {
            console.log(error)
            this.warning("Une erreur est survenue lors de la création")
          }
        )
      } else {
        this.userService.update(this.userForm.getRawValue(), String(userID))
          .subscribe((): void => {
            this.success("Modification effectuée !")
            this.router.navigate(['/users']);

          }, (error: any) => {
            console.log(error)
            this.warning("Impossible de modifier les champs!")
          });
      }
    })
  }


  previewAvatar(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.avatarUrl = e.target.result;
    }
    reader.readAsDataURL(file);
  }

  getEntrepriseForUser() {
    this.entrepriseService.getAll().subscribe((data: any) => {
      this.listEntreprise = data
      console.log(this.listEntreprise)


    })

  }

  ngOnInit(): void {
    this.getEntrepriseForUser();
    this.route.params.subscribe(params => {
      const userID = +params['id']
      if (!isNaN(userID)) {
        this.textButton = "Modification d'un  utilisateur"

        this.userService.getById(userID).subscribe(data => {
          // Assuming res has a structure like:
          data = {
            email: data.email,
            // password: data.password,
            title: data.title,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
            avatarUrl: data.avatarUrl,
            EntrepriseId: data.EntrepriseId,


          }

          this.userForm.patchValue(data);
        });
      } else {
        this.textButton = "Création d'un utilisateur"
        this.formBuilder.group({
          title: [],
          firstName: [],
          lastName: [],
          role: [],
          email: [],
          password: [],
          avatarUrl: [],
          EntrepriseId: [],
          // Entreprise: {}

        });

      }
    })
  }

}
