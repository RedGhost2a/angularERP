import {Component, Inject, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../_service/user.service";
import {Toastr, TOASTR_TOKEN} from "../../_service/toastr.service";
import {AlertService} from "../../_service/alert.service";
import {ThemePalette} from "@angular/material/core";
import {EntrepriseService} from "../../_service/entreprise.service";


@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  @Input() updateUser!: UserEditComponent
  public myFormGroup: FormGroup;
  textButton!: string;
  color: ThemePalette = 'accent';
  checked = true;
  disabled = false;
  listEntreprise: any[] = [];

  constructor(private userService: UserService, private formBuilder: FormBuilder, private alerteService: AlertService,
              private route: ActivatedRoute, private router: Router, @Inject(TOASTR_TOKEN) private toastr: Toastr, private entrepriseService: EntrepriseService) {

    this.myFormGroup = this.formBuilder.group({
      email: "",
      password: "",
      title: "",
      firstName: "",
      lastName: "",
      role: "",
      EntrepriseId: ""
    })

  }

  success(message: string): void {
    this.toastr.success(message, "Succès");
  }

  warning(message: string): void {
    this.toastr.warning(message, "Attention");
  }

  createAndUpdate(): void {

    this.route.params.subscribe(params => {
      const userID = +params['id']
      console.log(userID)
      if (isNaN(userID)) {
        this.userService.register(this.myFormGroup.getRawValue()).subscribe(
          (): void => {
            console.log(this.myFormGroup.getRawValue())

            this.success("Nouvelle utilisateur en vue !")
            this.router.navigate(['/users']);

          }, error => {
            console.log(error)
            this.warning("Une erreur est survenue lors de la création")
          }
        )
      } else {
        this.userService.update(this.myFormGroup.getRawValue(), String(userID))
          .subscribe((): void => {
            this.success("Modification effectuée !")
            this.router.navigate(['/users']);

          }, (error: any) => {

            this.warning("Impossible de modifier les champs!")
          });
      }
    })
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
        this.textButton = "Modifier l'utilisateur"
        this.userService.getById(userID).subscribe(data => {
          // Assuming res has a structure like:
          data = {
            email: data.email,
            password: data.password,
            title: data.title,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,


          }

          this.myFormGroup.patchValue(data);
        });
      } else {
        this.textButton = 'Créer un nouvelle utilisateur'
        this.formBuilder.group({
          title: [],
          firstName: [],
          lastName: [],
          role: [],
          email: [],
          password: [],
          EntrepriseId: []

        });

      }
    })
  }

}
