import {Component, Inject, Input, OnInit} from '@angular/core';
import {ClientService} from "../../_service/client.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Toastr, TOASTR_TOKEN} from "../../_service/toastr.service";
import {NGXLogger} from "ngx-logger";


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  @Input() updateClient!: EditComponent
  submitted = false;
  textButton!: string;


  profileForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    denomination: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phonenumber: new FormControl('', [Validators.required, Validators.pattern(/^\d{9}$/)]),
    type: new FormControl('', [Validators.required]),
    tvaintra: new FormControl(0),
    siret: new FormControl(0),
    Adresse: new FormGroup({
      adresses: new FormControl('', [Validators.required]),
      zipcode: new FormControl('', [Validators.required, Validators.pattern(/^\d{5}$/)]),
      city: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
    })

  });


  constructor(private clientService: ClientService, private formBuilder: FormBuilder,
              private route: ActivatedRoute, private router: Router, @Inject(TOASTR_TOKEN) private toastr: Toastr,
              private logger: NGXLogger) {

  }

  get f() {
    return this.profileForm.controls;
  }

  success(message: string): void {
    this.toastr.success(message, "Succes",);
  }

  warning(message: string): void {
    this.toastr.warning(message, "Attention",);
  }


  createAndUpdate(): void {
    this.submitted = true;

    this.route.params.subscribe(params => {
      const clientID = +params['id']
      console.log(this.profileForm.value)
      // console.log(this.myAdressFormGroup)
      if (isNaN(clientID)) {
        this.clientService.register(this.profileForm.value).subscribe(
          (): void => {
            // console.log(this.profileForm.value)
            this.success("Nouveau client en vue!")
            this.router.navigate(['/clients']);

          }, error => {
            // this.logger.error("Error message", error);
            console.log(error)
            // console.log(this.profileForm.value)
            // console.log(this.myAdressFormGroup)
            this.warning("Vous devez completer toutes les entrées !!")

          }
        )
      } else {
console.log('data client',this.profileForm.value);
        this.clientService.update(this.profileForm.value, String(clientID))
          .subscribe(data => {
            this.success("Client modifier!");
            this.router.navigate(['/clients']);


          }, error => {
            console.error(error)
            this.warning("Complète tout les champs !")

          });
      }
    })
  }


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const clientID = +params['id']
      console.log(this.profileForm.value)

      if (!isNaN(clientID)) {
        this.textButton = 'Modifier le client'
        this.clientService.getById(clientID).subscribe(data => {
          // Assuming res has a structure like:
          console.log(data)
          data = {
            Adresse: {
              adresses: data.Adresse.adresses,
              zipcode: data.Adresse.zipcode,
              city: data.Adresse.city,
              country: data.Adresse.country,

            },
            firstName: data.firstName,
            lastName: data.lastName,
            denomination: data.denomination,
            email: data.email,
            phonenumber: data.phonenumber,
            type: data.type,
            siret: data.siret,
            tvaintra: data.tvaintra,

          }

          this.profileForm.patchValue(data);
          console.log(data)
        });
      } else {
        this.textButton = 'Créer un nouveau client';


      }
    })
  }

}
