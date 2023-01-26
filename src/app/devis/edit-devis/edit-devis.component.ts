import {Component, Inject, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {DevisService} from "../../_service/devis.service";
import {ClientService} from "../../_service/client.service";
import {Client} from "../../_models/client";
import {Entreprise} from "../../_models/entreprise";
import {EntrepriseService} from 'src/app/_service/entreprise.service';
import {Toastr, TOASTR_TOKEN} from "../../_service/toastr.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-edit-devis',
  templateUrl: './edit-devis.component.html',
  styleUrls: ['./edit-devis.component.scss']
})
export class EditDevisComponent implements OnInit {
  public myFormGroup: FormGroup;
  // @ts-ignore
  userId = JSON.parse(localStorage.getItem('user'))
  currentUser = this.userId.id;
  submitted = false;


  listClient !: Client[];
  listEntreprise !: Entreprise[];

  @Input() entreprise!: Entreprise;
  @Input() client!: Client;


  constructor(private formBuilder: FormBuilder,
              private devisService: DevisService,
              private clientService: ClientService,
              private entrepriseService: EntrepriseService,
              @Inject(TOASTR_TOKEN) private toastr: Toastr,
              private router: Router,
              private route: ActivatedRoute,) {
    this.myFormGroup = this.formBuilder.group({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      status: [],
      ClientId: [],
      EntrepriseId: [],
      UserId: this.currentUser,
    });
    console.log(this.currentUser)

  }

  get f() {
    return this.myFormGroup.controls;
  }

  getAllClient(): void {
    this.clientService.getAll().subscribe(data => this.listClient = data)
  }

  getAllEntreprise(): void {
    this.entrepriseService.getAll().subscribe(data => this.listEntreprise = data)
  }

  success(message: string): void {
    this.toastr.success(message, "Succès");
  }

  warning(message: string): void {
    this.toastr.warning(message, "Attention");
  }

  createAndUpdate(): void {
    this.route.params.subscribe(params => {
      const devisID = +params['id']
      console.log(devisID)
      if (isNaN(devisID)) {
        this.devisService.create(this.myFormGroup.getRawValue()).subscribe(
          (): void => {
            if (this.myFormGroup.status === 'VALID') {
              this.success("Nouveau devis en vue !")
              this.router.navigate(['/devis']);
            }
          }, error => {
            this.warning("Complète tout les champs !")
            console.log(error)
          }
        )
      } else {
        this.devisService.update(this.myFormGroup.getRawValue(), String(devisID))
          .subscribe((): void => {
            this.success("Devis modifier!");
            this.router.navigate(['/devis']);
          }, error => {
            console.log(error)
            this.warning("Complète tout les champs !")
          });
      }
    })
  }


  ngOnInit(): void {
    this.getAllClient()
    this.getAllEntreprise()
    this.route.params.subscribe(params => {
      const clientID = +params['id']
      if (!isNaN(clientID)) {
        this.devisService.getById(clientID).subscribe(data => {
          console.log(data)
          // Assuming res has a structure like:
          data = {
            name: data.name,
            status: data.status,
            ClientId: data.ClientId,
            EntrepriseId: data.EntrepriseId,
            UserId: data.UserId,

          }

          this.myFormGroup.patchValue(data);
        });
      } else {
        this.formBuilder.group({
          name: [],
          status: [],
          ClientId: [],
          EntrepriseId: [],
          UserId: this.currentUser,
        });


      }
    })
  }

}
