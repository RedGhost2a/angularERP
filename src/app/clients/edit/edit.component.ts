import {Component, Inject, Input, OnInit} from '@angular/core';
import {ClientService} from "../../_service/client.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Toastr, TOASTR_TOKEN} from "../../_service/toastr.service";


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  @Input() updateClient!: EditComponent

  profileForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    phonenumber: new FormControl(''),
    type: new FormControl(''),
    tvaintra: new FormControl(''),
    Adresse: new FormGroup({
      adresses: new FormControl(''),
      zipcode: new FormControl(''),
      city: new FormControl(''),
      country: new FormControl('')
    })

  });


  textButton!: string;

  constructor(private clientService: ClientService, private formBuilder: FormBuilder,
              private route: ActivatedRoute, private router: Router, @Inject(TOASTR_TOKEN) private toastr: Toastr) {

  }

  success(message: string): void {
    this.toastr.success(message, "Success",);
  }

  warning(message: string): void {
    this.toastr.warning(message, "Attention vous devez completer tous les entrées !",);
  }


  createAndUpdate(): void {
    this.route.params.subscribe(params => {
      const clientID = +params['id']
      console.log(this.profileForm.value)
      // console.log(this.myAdressFormGroup)
      if (isNaN(clientID)) {
        this.clientService.register(this.profileForm.value).subscribe(
          (): void => {
            console.log(this.profileForm.value)

            if (this.profileForm.status === 'VALID') {
              this.success("Nouveau client en vue !")
              this.router.navigate(['/clients']);
            }
          }, error => {
            console.log(error)
            console.log(this.profileForm.value)
            // console.log(this.myAdressFormGroup)


            this.warning("Complète tout les champs !")

          }
        )
      } else {
        this.clientService.update(this.profileForm.value, String(clientID))
          .subscribe((): void => {
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
              adresses: data.adresses,
              zipcode: data.zipcode,
              city: data.city,
              country: data.country,

            },
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phonenumber: data.phonenumber,
            type: data.type,
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
