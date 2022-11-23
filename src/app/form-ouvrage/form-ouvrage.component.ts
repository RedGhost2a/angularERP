import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {OuvrageService} from "../_service/ouvrage.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-form-ouvrage',
  templateUrl: './form-ouvrage.component.html',
  styleUrls: ['./form-ouvrage.component.scss']
})
export class FormOuvrageComponent implements OnInit {
  public  myFormGroup: FormGroup;
  textButton!:string;
  titreForm!:string;

  constructor(private formBuilder: FormBuilder, private ouvrageService: OuvrageService,
              private route: ActivatedRoute) {
    this.myFormGroup = this.formBuilder.group({
      designation: [],
      benefice: [],
      aleas: [],
      unite: [],
      ratio: [],
      uRatio: [],
      fournisseur: [],
    }); }

  createAndUpdate():void{
    this.route.params.subscribe(params =>{
      const ouvrageID = +params['id']
      if(isNaN(ouvrageID)) {
        this.ouvrageService.create(this.myFormGroup.getRawValue()).subscribe(
          () : void =>{
            alert('Nouveau ouvrage enregistrer')
          }
        )
      }else{
        this.ouvrageService.update(this.myFormGroup.getRawValue(), ouvrageID)
          .subscribe((): void => {
            alert('ouvrage update!');
          });
      }
    })
  }



  ngOnInit(): void {
    this.route.params.subscribe(params =>{
      const ouvrageID = +params['id']
      if(!isNaN(ouvrageID)) {
        this.textButton = "Modifier l'ouvrage"
        this.titreForm = "Modification de l'ouvrage"
        this.ouvrageService.getById(ouvrageID).subscribe(data => {
          // Assuming res has a structure like:
          data = {
            designation: data.designation,
            benefice: data.benefice,
            aleas: data.aleas,
            unite: data.unite,
            ratio: data.ratio,
            uRatio: data.uRatio,
            fournisseur: data.fournisseur,
          }
          // Values in res that don't line up to the form structure
          // are discarded. You can also pass in your own object you
          // construct ad-hoc.
          this.myFormGroup.patchValue(data);
        });
      }else{
        this.textButton = 'Creer un nouveau ouvrage'
        this.titreForm = "Création d'un d'un ouvrage"
        this.formBuilder.group({
          designation: [],
          benefice: [],
          aleas: [],
          unite: [],
          ratio: [],
          uRatio: [],
          fournisseur: [],
        });

      }
    })
  }

}
