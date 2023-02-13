import {Component} from '@angular/core';
import {DialogNotesComponent} from "./dialog-notes/dialog-notes.component";
import {MatDialog} from "@angular/material/dialog";
import {UserService} from "./_service/user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  user!: any;


  constructor(public dialog: MatDialog, public userService: UserService) {
  }

  ngOnInit() {

  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogNotesComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Fin de commentaieres', result);


    });
  }
}




