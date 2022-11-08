import {Component, Input, OnInit} from '@angular/core';
import {ClientService} from "../../_service/client.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup} from '@angular/forms';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  @Input() updateClient!: EditComponent
  public myFormGroup: FormGroup;
  textButton!: string;

  constructor(private clientService: ClientService, private formBuilder: FormBuilder,
              private route: ActivatedRoute, private router: Router) {
    this.myFormGroup = this.formBuilder.group({
      firstName: "",
      lastName: "",
      adresses: "",
      zipcode: "",
      city: "",
      country: "",
      email: "",
      phonenumber: "",
      type: "",
      tvaintra: "",
    })

  }


  createAndUpdate(): void {
    this.route.params.subscribe(params => {
      const clientID = +params['id']
      console.log(clientID)
      if (isNaN(clientID)) {
        this.clientService.register(this.myFormGroup.getRawValue()).subscribe(
          (): void => {
            if (this.myFormGroup.status === 'VALID') this.router.navigate(['/clients']);

          }
        )
      } else {
        this.clientService.update(this.myFormGroup.getRawValue(), String(clientID))
          .subscribe((): void => {
            alert('Update!');
          });
      }
    })
  }


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const clientID = +params['id']
      if (!isNaN(clientID)) {
        this.textButton = 'Modifier le client'
        this.clientService.getById(clientID).subscribe(data => {
          // Assuming res has a structure like:
          data = {
            firstName: data.firstName,
            lastName: data.lastName,
            adresses: data.adresses,
            zipcode: data.zipcode,
            city: data.city,
            country: data.country,
            email: data.email,
            phone: data.phone,
            type: data.type,
            tvaintra: data.tvaintra,
          }

          this.myFormGroup.patchValue(data);
        });
      } else {
        this.textButton = 'Creer un nouveau client'
        this.formBuilder.group({
          firstName: [],
          lastName: [],
          adresses: [],
          zipcode: [],
          city: [],
          country: [],
          phone: [],
          email: [],
          type: [],
          tvaintra: [],
        });


      }
    })
  }

}
