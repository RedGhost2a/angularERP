import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {DevisService} from "../_service/devis.service";

@Component({
  selector: 'app-devis',
  templateUrl: './devis.component.html',
  styleUrls: ['./devis.component.scss']
})
export class DevisComponent implements OnInit {
  public  myFormGroup: FormGroup ;
  // @ts-ignore
  currentUser = JSON.parse(localStorage.getItem('user'))

  constructor(private  formBuilder: FormBuilder, private devisService : DevisService) {
    this.myFormGroup = this.formBuilder.group({
      name: [],
      status: []
    });
  }

  ngOnInit(): void {
    this.devisService.getAll().subscribe(data =>{
      console.log(data)
    })
    this.myFormGroup = this.formBuilder.group({
      name: [],
      status: []
    });

  }
  testAjoutDevis():void{
  this.devisService.create(this.myFormGroup.getRawValue()).subscribe(
      () : void =>{
  console.log(this.myFormGroup.getRawValue())
  alert('Nouveau cout enregistrer')
});
  }
}
