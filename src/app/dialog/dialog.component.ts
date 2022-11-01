import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {HttpClient} from "@angular/common/http";



@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  clientForm!: FormGroup;


  constructor(private formBuilder:FormBuilder) { }

  ngOnInit(): void {

    this.clientForm= this.formBuilder.group({
      firstname:"",
      lastname:"",
      adresses:"",
      zipcode:"",
      city:"",
      country:"",
      email:"",
      phonenumber:"",
    })
  }









}
