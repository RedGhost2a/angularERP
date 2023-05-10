import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-list-component',
  templateUrl: './list-component.component.html',
  styleUrls: ['./list-component.component.scss']
})
export class ListComponentComponent implements OnInit {
   @Input() dataSource !: any []
  @Input() columns !: string []
  constructor() { }

  ngOnInit(): void {
  }

}
