import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-dialog-form-cout',
  templateUrl: './dialog-form-cout.component.html',
  styleUrls: ['./dialog-form-cout.component.scss']
})
export class DialogFormCoutComponent implements OnInit {
  myFormGroup!: FormGroup;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.createFormCout()
  }

  createFormCout(): void {
    this.myFormGroup = new FormGroup({
      id: new FormControl(),
      designation: new FormControl(),
      unite: new FormControl(""),
      prixUnitaire: new FormControl(""),
      EntrepriseId: new FormControl(""),
      TypeCoutId: new FormControl(""),
      FournisseurId: new FormControl("")
    });
  }
}
