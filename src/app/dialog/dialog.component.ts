import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {first} from "rxjs";
import {ClientService} from "../_service/client.service";



@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  clientForm!: FormGroup;


  constructor(private formBuilder:FormBuilder,private httpClient:HttpClient,private clientService: ClientService) { }

  ngOnInit(): void {

    this.clientForm= this.formBuilder.group({
      firstName:"",
      lastName:"",
      adresses:"",
      zipcode:"",
      city:"",
      country:"",
      email:"",
      phonenumber:"",
    })
  }






  createUser() {
      this.clientService.register(this.clientForm.value)
        .pipe(first())
        .subscribe({
          next: () => {
            console.log(this.clientForm.value)
           ;
          },
          error: error => {
            console.log(error)
          }
        });
    }

  }







