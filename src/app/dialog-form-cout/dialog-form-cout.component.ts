import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogComponent} from "../dialogListOuvrage/dialog.component";
import {OuvrageService} from "../_service/ouvrage.service";
import {DataSharingService} from "../_service/data-sharing-service.service";
import {CoutDuDevis} from "../_models/cout-du-devis";
import {OuvrageCoutDuDevis} from "../_models/ouvrageCoutDuDevis";
import {CoutService} from "../_service/cout.service";
import {OuvrageCoutService} from "../_service/ouvrageCout.service";
import {Cout} from "../_models/cout";
import {OuvrageCout} from "../_models/ouvrageCout";
import{transformVirguletoPoint} from "../_helpers/transformVirguletoPoint"
import {TypeCoutService} from "../_service/typeCout.service";
import {TypeCout} from "../_models/type-cout";
import {Toastr, TOASTR_TOKEN} from "../_service/toastr.service";
import {UniteForForm} from "../_models/uniteForForm";
import {UniteForFormService} from "../_service/uniteForForm.service";
import {Router} from "@angular/router";
import {OuvrageElementaireCoutService} from "../_service/ouvrage-elementaire-cout.service";

@Component({
  selector: 'app-dialog-form-cout',
  templateUrl: './dialog-form-cout.component.html',
  styleUrls: ['./dialog-form-cout.component.scss']
})
export class DialogFormCoutComponent implements OnInit {
  myFormGroup!: FormGroup;
  initialData!: any[];
  coutDuDevis!: CoutDuDevis
  cout!: Cout;
  isChecked: boolean = false;
  isInDevis: boolean = true;
  regexDetailOuvrage = new RegExp(`^/ouvrageDetail`)
  categories: any[] = [];
  typeCout !: TypeCout[];
  isCout: boolean = true;
  uniteList!:UniteForForm[];





  constructor(private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<DialogComponent>,
              private ouvrageService: OuvrageService,
              public dataSharingService: DataSharingService,
              private coutService: CoutService,
              private ouvrageCoutService: OuvrageCoutService,
              private typeCoutService: TypeCoutService,
              private uniteForFormService: UniteForFormService,
              @Inject(TOASTR_TOKEN) private toastr: Toastr,
              private router:Router,
              private ouvrageElementaireCoutService: OuvrageElementaireCoutService
  ) {
    this.initialData = this.data;
    transformVirguletoPoint()
    this.createFormCout()

  }

  ngOnInit(): void {
    this.getAllTypeCouts(this.initialData[2].EntrepriseId)
    this.getUniteByEnteprise(this.initialData[2].EntrepriseId)
    if (this.regexDetailOuvrage.test(window.location.pathname)) {
      this.isInDevis = false;
    }

    // this.createFormCout()
    console.log("entreprise ID :", this.dataSharingService.entrepriseId)
  }

  getUniteByEnteprise(id:number):void {
    this.uniteForFormService.getUniteByEntreprise(id).subscribe(data=>{
      this.uniteList=data
    })
  }


  createFormCout(): void {
    this.myFormGroup = new FormGroup({
      id: new FormControl(),
      designation: new FormControl('',Validators.required),
      unite: new FormControl("",Validators.required),
      prixUnitaire: new FormControl("",[Validators.required,]),
      EntrepriseId: new FormControl(""),
      TypeCoutId: new FormControl(""),
      type: new FormControl(""),
      FournisseurId: new FormControl("",Validators.required),
      ratio: new FormControl("",[Validators.required]),
      uRatio: new FormControl(""),
      efficience: new FormControl("",[Validators.required])
    });

  }

  checked() {
    this.isChecked = !this.isChecked;
    console.log(this.isChecked)
  }

  createCoutDuDevis(): void {
    this.myFormGroup.markAllAsTouched();
    if (this.myFormGroup.invalid) {
      // Form is invalid, show error message
      this.toastr.error("Le formulaire est invalide.", "Erreur !");
      return;
    }
    if (this.isInDevis) {
      this.myFormGroup.controls["EntrepriseId"].setValue(this.initialData[2].EntrepriseId)
      this.coutDuDevis = this.myFormGroup.getRawValue();
      this.coutDuDevis.fournisseur = this.myFormGroup.getRawValue().FournisseurId[0]
      this.coutDuDevis.remarque !== null ? this.myFormGroup.getRawValue().FournisseurId[1] : ""
      this.coutDuDevis.type = this.myFormGroup.getRawValue().type
      this.coutDuDevis.categorie = this.myFormGroup.getRawValue().TypeCoutId[1]
       console.log(this.myFormGroup.getRawValue())
      this.cout = this.myFormGroup.getRawValue();
      console.log("cout", this.cout)
      this.cout.FournisseurId = this.myFormGroup.getRawValue().FournisseurId[2]
      this.cout.TypeCoutId = this.myFormGroup.getRawValue().TypeCoutId[0]


      this.coutService.createCoutDuDevis(this.coutDuDevis).subscribe(responseCout => {


        if (this.router.url.includes('/ouvrages-elementaires-du-devis')){
          console.log("responseCout",responseCout)
          const ouvrageCout = {
            OuvrElemDuDeviId: this.initialData[2].id,
            CoutDuDeviId: responseCout?.id,

          }
          this.ouvrageElementaireCoutService.createOuvrageElemCoutDuDevis(ouvrageCout).subscribe(this.ngOnInit)
          // this.cout = this.myFormGroup.getRawValue();

        }
        this.myFormGroup.markAllAsTouched();
        if (this.myFormGroup.invalid) {
          // Form is invalid, show error message
          this.toastr.error("Le formulaire est invalide.", "Erreur !");
          return;
        }
          const ouvrageCoutDuDevis: OuvrageCoutDuDevis = {
            OuvrageDuDeviId: this.dataSharingService.ouvrage.id,
            CoutDuDeviId: responseCout?.id,
            ratio: this.myFormGroup.getRawValue().ratio,
            uRatio: this.myFormGroup.getRawValue().uRatio,
          }
          this.ouvrageCoutService.createOuvrageCoutDuDevis(ouvrageCoutDuDevis).subscribe()
        this.closeDialog()
        }
      )
      if (this.isChecked === false) {
        this.coutService.create(this.cout).subscribe((res: any) => {

          const ouvrageCout: OuvrageCout = {
            OuvrageId: 0,
            CoutId: res.cout.id,
            ratio: this.myFormGroup.getRawValue().ratio,
            uRatio: this.myFormGroup.getRawValue().uRatio,
          }
          this.ouvrageCoutService.createOuvrageCoutByDesignation(this.dataSharingService.ouvrage.id, ouvrageCout).subscribe()
        })

      }
    } else {
      this.myFormGroup.controls["EntrepriseId"].setValue(this.data[2].EntrepriseId)
      this.cout = this.myFormGroup.getRawValue();
      this.cout.FournisseurId = this.myFormGroup.getRawValue().FournisseurId[2]
      console.log("cout ?", this.cout)
      this.cout.TypeCoutId = this.myFormGroup.getRawValue().TypeCoutId[0]
      console.log("cout type cout ",this.myFormGroup.getRawValue().TypeCoutId)

      this.coutService.create(this.cout).subscribe((res: any) => {
        const ouvrageCout: OuvrageCout = {
          OuvrageId: this.data[2].id,
          CoutId: res.cout.id,
          ratio: this.myFormGroup.getRawValue().ratio,
          uRatio: this.myFormGroup.getRawValue().uRatio,
        }
        console.log("ouvrage cout dans le ELSE",ouvrageCout)
        this.ouvrageCoutService.create(ouvrageCout).subscribe()
        this.closeDialog()
      })
    }

  }

  //Recupere tous les type de couts pour implementer le select picker du template
  getAllTypeCouts(entrepriseID: number): void {
    this.typeCoutService.getAllTypeCouts(entrepriseID).subscribe(data => {
        this.typeCout = data;
        console.log(this.typeCout)

      }
    )
  }
  getCategorieByType(type: string): void {
    this.typeCoutService.getCategorieByType(type).subscribe(data => {
      this.categories = data;

      console.log(this.categories);
    });
  }
  closeDialog() {
    // Renvoyez la valeur de selectedOuvrageIds lors de la fermeture du dialogListOuvrage
    this.dialogRef.close();
  }

  setValueURatio(){
    const unite = this.myFormGroup.get('unite')?.value
    this.myFormGroup.controls['uRatio'].setValue(`${unite}/h`)
  }
}
