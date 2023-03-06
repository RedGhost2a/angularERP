import {Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {UserService} from "./_service/user.service";
import {NGXLogger} from "ngx-logger";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  user!: any;


  constructor(public dialog: MatDialog,
              public userService: UserService,
              private logger: NGXLogger) {

  }

  ngOnInit() {

  }

}




