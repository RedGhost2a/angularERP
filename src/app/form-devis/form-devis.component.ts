import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-form-devis',
  templateUrl: './form-devis.component.html',
  styleUrls: ['./form-devis.component.scss']
})
export class FormDevisComponent implements OnInit {
  test = false;
  constructor() { }

  ngOnInit(): void {
    console.log('tfdsqfsdsofqjd')
  }

html():void{
    if(this.test){
      this.test = false;
    }else{
    this.test = true;
    }
    console.log("value test "+this.test)
}
}
