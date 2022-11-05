import { Component, OnInit } from '@angular/core';
import {Client} from "../../_models/client";
import {ClientService} from "../../_service/client.service";
import {ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  clientForm!: Client[];

  constructor(private clientService : ClientService,private router:Router, private route: ActivatedRoute,) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe((param) => {
      let id = Number(param.get('id'));
      this.getById(id);
    });
  }


  getById(id: any) {
    this.clientService.getById(id).subscribe((data) => {
      this.clientForm = data;
      console.log(data)
    });
  }


}
