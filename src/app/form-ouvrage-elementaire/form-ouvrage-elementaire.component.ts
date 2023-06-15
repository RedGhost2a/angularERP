import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DialogComponent} from "../dialogListOuvrage/dialog.component";
import {Toastr, TOASTR_TOKEN} from "../_service/toastr.service";
import {DialogUniteForFormComponent} from "../dialog-unite-for-form/dialog-unite-for-form.component";
import {User} from "../_models/users";
import {UniteForForm} from "../_models/uniteForForm";
import {UserService} from "../_service/user.service";
import {UniteForFormService} from "../_service/uniteForForm.service";
import {OuvrageElementaireService} from "../_service/ouvrage-elementaire.service";
import {ActivatedRoute, Router} from "@angular/router";
import {OuvrageOuvragesElementairesService} from "../_service/ouvrage-ouvrages-elementaires.service";
import {OuvrageElementaire} from "../_models/ouvrage-elementaire";
import {Ouvrage} from "../_models/ouvrage";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {OuvrageElementaireCoutService} from "../_service/ouvrage-elementaire-cout.service";

@Component({
  selector: 'app-form-ouvrage-elementaire',
  templateUrl: './form-ouvrage-elementaire.component.html',
  styleUrls: ['./form-ouvrage-elementaire.component.scss']
})
export class FormOuvrageElementaireComponent implements OnInit {
  public myFormGroup!: FormGroup;
  titleModal:string;
  private currentUser!: User;
  uniteList!: UniteForForm[];
  entrepriseId!: number;
  ouvrageID!:number;
  initialData!: Ouvrage;






  constructor(private dialogRef: MatDialogRef<DialogComponent>,
              @Inject(TOASTR_TOKEN) private toastr: Toastr,
              private dialog: MatDialog,
              private router: Router ,
              private userService: UserService,
              private uniteForForm: UniteForFormService,
              private route: ActivatedRoute,
              private ouvrageElementaireService:OuvrageElementaireService,
              private ouvrageOuvrageElemService:OuvrageOuvragesElementairesService,
              private ouvrageElementaireCoutService : OuvrageElementaireCoutService
              ,@Inject(MAT_DIALOG_DATA) public data: any

  ) {
    this.titleModal = "Ajout d'un ouvrage élémentaires";
    this.initialData = this.data;

  }

  ngOnInit(): void {
    console.log("data4",this.data)
    this.createFormOuvrageElementaire()
    this.getUserById();


  }
  openUniteForFormDialog(): void {
    const dialogRef = this.dialog.open(DialogUniteForFormComponent, {
      width: '800px',
      // data: { form: this.importForm }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  createFormOuvrageElementaire(): void {
    this.myFormGroup = new FormGroup({
      designation: new FormControl('', Validators.required),
      unite: new FormControl(''),
      prix: new FormControl(''),
      proportion: new FormControl(''),
      EntrepriseId: new FormControl(""),
      remarques: new FormControl(""),
      uniteproportionOE: new FormControl(''),
    });
  }

  async createOuvrageElementaire(): Promise<void> {
    console.log(this.myFormGroup.getRawValue())
    if (this.myFormGroup.controls['prix'].value === '') {
      this.myFormGroup.controls['prix'].setValue(0);
    }
    if (this.myFormGroup.controls['remarques'].value === '') {
      this.myFormGroup.controls['remarques'].setValue(' ');
    }
    this.myFormGroup.markAllAsTouched();
    if (this.myFormGroup.invalid) {
      // Form is invalid, show error message
      this.toastr.error("Le formulaire est invalide.", "Erreur !");
      return;
    }

        this.ouvrageElementaireService.create(this.myFormGroup.getRawValue()).subscribe(data => {
          console.log("dataa",data)
          // this.router.navigate([`/ouvrages-elementaires-detail/${data.ouvrage.id}`])



          if (this.router.url.includes('/sousDetailPrix')) {
            console.log('Inside /sousDetailPrix condition');

            // Créer un OuvrageElementaireDuDevis
            this.ouvrageElementaireService.createOuvrageElementaireDuDevis(data.ouvrage)
              .subscribe(response => {
                // Log the entire response
                console.log('createOuvrageElementaireDuDevis entire response', response);

                // Log the OuvrageDuDevis field in the response
                console.log('OuvrageDuDevis in response', response.OuvrageDuDevis);
                // Récupérer l'ID de l'OuvrageDuDevis nouvellement créé

                const newlyCreatedOuvrageDuDevisId = response.OuvrageDuDevis?.id;
                console.log('Before ouvrageOuvrageElemDuDevis creation');
                console.log('Before ouvrageOuvrageElemDuDevis creation',this.initialData);

                // Créer l'objet pour la création de OuvrageOuvrageElemDuDevis
                const ouvrageOuvrageElemDuDevis = {
                  OuvrageDuDeviId: this.data,
                  OuvrElemDuDeviId: newlyCreatedOuvrageDuDevisId,
                };

                console.log('ouvrageOuvrageElemDuDevis', ouvrageOuvrageElemDuDevis);

                // Créer un OuvrageOuvrageElemDuDevis
                this.ouvrageElementaireCoutService.createOuvrageOuvrageElemDuDevis(ouvrageOuvrageElemDuDevis)
                  .subscribe(
                    response => {
                      console.log('createOuvrageOuvrageElemDuDevis response', response);
                    },
                    error => console.error('There was an error!', error),
                    () => console.log('createOuvrageOuvrageElemDuDevis Observable stream is complete')
                  );
              });
          }


          if (this.router.url.includes('/ouvrageDetail')) {
            const ouvrageElemOuvrage = {
              OuvragesElementaireId:data.id,
              OuvrageId:  this.initialData.id,
            }
            console.log("echo",ouvrageElemOuvrage)
            this.ouvrageOuvrageElemService.create(ouvrageElemOuvrage).subscribe()
            this.closeDialog()
            this.router.navigate([`/ouvrages-elementaires-detail/${data.id}`])
          }
        })
    this.closeDialog()

    }


  closeDialog() {
    // Renvoyez la valeur de selectedOuvrageIds lors de la fermeture du dialogListOuvrage
    this.dialogRef.close();
  }
  getUserById(): void {
    this.currentUser = this.userService.userValue;
    this.userService.getById(this.currentUser.id).subscribe(data => {
      this.myFormGroup.controls["EntrepriseId"].setValue(data.Entreprises[0].id)
      this.entrepriseId = data.Entreprises[0].id
      if (this.entrepriseId) {
        this.getUniteByEnteprise();
      }
    })
  }

  getUniteByEnteprise(): void {
    this.uniteForForm.getUniteByEntreprise(this.entrepriseId).subscribe(data => {
      this.uniteList = data
      console.log(this.uniteList)

    })
  }
}
