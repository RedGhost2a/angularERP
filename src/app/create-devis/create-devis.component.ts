import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

export interface Lot {
  designation: string;
  children: Lot[];
  hasChild: boolean;
}

@Component({
  selector: 'app-create-devis',
  templateUrl: './create-devis.component.html',
  styleUrls: ['./create-devis.component.scss']
})
export class CreateDevisComponent implements OnInit {
  // myFormGroup!: FormGroup;
  // nbChamp: number = 0;
  form: FormGroup;
  lots: Lot[] = [];
  showForm = false;
  currentLot: Lot | null = null;


  constructor(private fb: FormBuilder) {
    // this.myFormGroup = new FormGroup({})
    this.form = this.fb.group({
      designation: ['']
    });
  }

  ngOnInit(): void {

  }

  // ajouterChamp() {
  //   this.nbChamp++;
  //   this.myFormGroup.addControl('nouveauChamp' + this.nbChamp, new FormControl(''));
  // }

  toggleForm() {
    this.showForm = !this.showForm;
    // console.log(this.showForm)


  }

  displayLots(lots: Lot[]): Lot[] {
    return lots.map(lot => {
      return {
        designation: lot.designation,
        children: this.displayLots(lot.children),
        hasChild: lot.hasChild
      };
    });
  }


  onSubmit(value: string) {
    if (this.currentLot) {
      console.log(this.currentLot)
      // Ajouter un sous-lot
      this.currentLot.children.push({designation: value, children: [], hasChild: false});
      console.log(this.lots)
      // console.log(this.currentLot.children)
      this.currentLot.hasChild = true;

    } else {
      // Ajouter un lot
      this.lots.push({designation: value, children: [], hasChild: false});
      console.log(this.lots)

    }
    this.showForm = false;
  }

}
