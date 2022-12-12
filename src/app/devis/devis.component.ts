import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-devis',
  templateUrl: './devis.component.html',
  styleUrls: ['./devis.component.scss']
})
export class DevisComponent implements OnInit {
  // @ts-ignore
  currentUser = JSON.parse(localStorage.getItem('user'))

  constructor() {
  }

  ngOnInit(): void {


  }


}
