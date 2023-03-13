import {Component, Inject, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Toastr, TOASTR_TOKEN} from "../../_service/toastr.service";
import {EntrepriseService} from "../../_service/entreprise.service";

@Component({
  selector: 'app-entreprise-edit',
  templateUrl: './entreprise-edit.component.html',
  styleUrls: ['./entreprise-edit.component.scss']
})
export class EntrepriseEditComponent implements OnInit {
  @Input() updateEntreprise!: EntrepriseEditComponent
  public myFormGroup: FormGroup;
  textButton!: string;


  constructor(private entepriseService: EntrepriseService, private formBuilder: FormBuilder,
              private route: ActivatedRoute, private router: Router, @Inject(TOASTR_TOKEN) private toastr: Toastr) {

    this.myFormGroup = this.formBuilder.group({
      id: "",
      commercialName: "",
      denomination: ["", Validators.required],
      formeJuridique: "",
      capital: "",
      rcs: "",
      siret: "",
      nafCode: "",
      tvaNumber: "",
      adresses: ["", Validators.required],
      zipcode: "",
      city: ["", Validators.required],
      country: "",
      email: "",
      phoneNumber: ["", Validators.required],
    })

  }

  success(message: string): void {
    this.toastr.success(message, "Tout se passe bien");
  }

  warning(message: string): void {
    this.toastr.warning(message, "Attention");
  }

  createAndUpdate(): void {

    this.route.params.subscribe(params => {
      this.myFormGroup.markAllAsTouched();
      if (this.myFormGroup.invalid) {
        // Form is invalid, show error message
        this.toastr.error("Le formulaire est invalide.", "Erreur !");
        return;
      }
      const entrepriseID = +params['id']
      console.log(entrepriseID)
      if (isNaN(entrepriseID)) {
        this.entepriseService.register(this.myFormGroup.getRawValue()).subscribe(
          (): void => {

            this.success("Nouvelle entreprise créer !")
            this.router.navigate(['/admin']);

          }, error => {
            console.log(error)
            this.warning("Complète tout les champs !")

          }
        )
      } else {
        this.entepriseService.update(this.myFormGroup.getRawValue(), String(entrepriseID))
          .subscribe((): void => {
            this.success(" Données modifier avec succès !")

            alert('Update!');
            if (this.myFormGroup.status === 'VALID') this.router.navigate(['/entreprises']);

          }, error => {
            this.warning("Complète tout les champs !")

          });
      }
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const entrepriseID = +params['id']
      if (!isNaN(entrepriseID)) {
        this.textButton = 'Modifier la société'
        this.entepriseService.getById(entrepriseID).subscribe(data => {
          // Assuming res has a structure like:
          data = {
            id: data.id,
            commercialName: data.commercialName,
            denomination: data.denomination,
            formeJuridique: data.formeJuridique,
            capital: data.capital,
            rcs: data.rcs,
            siret: data.siret,
            nafCode: data.nafCode,
            tvaNumber: data.tvaNumber,
            adresses: data.adresses,
            zipcode: data.zipcode,
            city: data.city,
            country: data.country,
            email: data.email,
            phoneNumber: data.phoneNumber,
          }

          this.myFormGroup.patchValue(data);
        });
      } else {
        this.textButton = 'Créer une nouvelle entreprise'
        this.formBuilder.group({
          id: [],
          commercialName: [],
          denomination: [],
          formeJuridique: [],
          capital: [],
          rcs: [],
          siret: [],
          nafCode: [],
          tvaNumber: [],
          adresses: [],
          zipcode: [],
          city: [],
          country: [],
          email: [],
          phoneNumber: [],
        });


      }
    })
  }

}
