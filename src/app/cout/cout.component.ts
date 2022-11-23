import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { Input } from '@angular/core';
import { Cout } from '../_models/cout';
import {CoutService} from "../_service/cout.service";

@Component({
  selector: 'app-cout',
  templateUrl: './cout.component.html',
  styleUrls: ['./cout.component.scss']
})
export class CoutComponent implements OnInit {
  @Input() cout!: Cout;
// @Output() deleteCout: EventEmitter<any> = new EventEmitter()


  constructor(private coutService: CoutService) { }
  ngOnInit(): void {
  }

  delete():void{
    // this.coutService.deleteByID(this.cout.id).subscribe(() => this.deleteCout.emit())
  }

}
