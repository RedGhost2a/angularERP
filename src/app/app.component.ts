import {Component} from '@angular/core';
import {DialogNotesComponent} from "./dialog-notes/dialog-notes.component";
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

  openDialog() {
    const dialogRef = this.dialog.open(DialogNotesComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Fin de commentaieres', result);
      // this.logger.error('error');


    });
  }
}




