import {Component, Inject, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Toastr, TOASTR_TOKEN} from "../../_service/toastr.service";
import {EntrepriseService} from "../../_service/entreprise.service";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-entreprise-edit',
  templateUrl: './entreprise-edit.component.html',
  styleUrls: ['./entreprise-edit.component.scss']
})
export class EntrepriseEditComponent implements OnInit {
  @Input() updateEntreprise!: EntrepriseEditComponent
  public myFormGroup!: FormGroup;
  textButton!: string;
  selectedFileName: string = 'No file selected';
  previewUrl: any = null;


  constructor(private entepriseService: EntrepriseService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog,
              @Inject(TOASTR_TOKEN) private toastr: Toastr,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private sanitizer: DomSanitizer
              ) {
  }

  success(message: string): void {
    this.toastr.success(message, "Tout se passe bien");
  }
  createFormEntreprise(){
    this.myFormGroup = new FormGroup({
      id: new FormControl(),
      commercialName: new FormControl('', [Validators.required]),
      denomination: new FormControl('', [Validators.required, Validators.minLength(3)]),
      formeJuridique: new FormControl('', ),
      capital: new FormControl('',),
      rcs: new FormControl('', ),
      siret: new FormControl('', ),
      nafCode: new FormControl("",),
      phoneNumber:new FormControl('',[Validators.required] ),
      tvaNumber:new FormControl(''),
      email:new FormControl(''),
      Adresse: new FormGroup({
        adresses: new FormControl('',[Validators.required] ),
        city: new FormControl('',[Validators.required] ),
        country: new FormControl('', ),
        zipcode: new FormControl('', [Validators.required]),
      }),
      logo: new FormControl(''),

    });
  }

  // warning(message: string): void {
  //   this.toastr.warning(message, "Attention");
  // }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const file = target.files[0];
      console.log(target.files[0])

      // Vérifiez si le formulaire et le contrôle de logo existent
      // if ( this.myFormGroup.get('logo')) {
      //   this.myFormGroup.getRawValue().logo.patchValue(file);
      // }
      console.log(file); //debug

      // File Preview
      const reader = new FileReader();
      reader.onload = (e) => {
        // Vérifiez si e.target existe
        if (e && e.target) {
          this.previewUrl = (e.target as FileReader).result as string;
          console.log(this.previewUrl); //debug
        }
      };
      reader.readAsDataURL(file);
    }
  }





  createOrUpdate(): void {
    this.myFormGroup.markAllAsTouched();
    if (this.myFormGroup.invalid) {
      // Form is invalid, show error message
      this.toastr.error("Attention","Le formulaire est invalide.");
      return;
    }

    if (this.data.id) {
      // Update existing company
      this.entepriseService.update(this.myFormGroup.getRawValue(), this.data.id).subscribe(
        (): void => {
          console.log(this.myFormGroup.getRawValue())
          this.toastr.success("Succes", "Données modifier avec succès !");
          this.dialog.closeAll()
          // this.router.navigate(['/entreprises']);
        },
        error => {
          if( error.status === 400){
          this.toastr.warning("Attention", "Le siret est deja enregistrer!");
          }else{
          this.toastr.warning("Attention", error.message);

          }
        }
      );
    } else {
      // Create new company
      this.entepriseService.register(this.myFormGroup.getRawValue()).subscribe(
        (): void => {
          this.toastr.success("Succes", "Nouvelle entreprise créer !");
          this.dialog.closeAll()
          this.router.navigate(['/admin']);
        },
        error => {
          this.toastr.warning("Attention", "Complète tout les champs !");
        }
      );
    }
  }

  ngOnInit(): void {
    this.createFormEntreprise();

    if (this.data.id) {
      this.textButton = 'Modifier la société';
      this.entepriseService.getById(this.data.id).subscribe(data => {
        // console.log(data)


        let adresseGroup = this.myFormGroup.get('Adresse');
        if (adresseGroup) {
          adresseGroup.patchValue(data.Adresse);
        }

        this.myFormGroup.patchValue({
          ...data,
          Adresse: data.Adresse
        });

         this.previewUrl = data.logo.data;
      });
    } else {
      this.textButton = 'Créer une nouvelle entreprise';
      this.myFormGroup.reset();
    }
  }


}
