import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-create-devis',
  templateUrl: './create-devis.component.html',
  styleUrls: ['./create-devis.component.scss']
})
export class CreateDevisComponent implements OnInit {
  myFormGroup!: FormGroup;
  nbChamp :number = 0;
  constructor(private formBuilder: FormBuilder) {
    this.myFormGroup = new FormGroup({})
  }

  ngOnInit(): void {

  }

  ajouterChamp() {
    this.nbChamp++;
    this.myFormGroup.addControl('designation'+this.nbChamp, new FormControl(''));
  }
}
