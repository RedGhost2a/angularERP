import {Component, Input, ViewChild} from '@angular/core';

import {UserService} from "../_service/user.service";
import {navbarData} from "./nav-data"
import {navbarDataAdmin} from "./nav-dataAdmin"
import {User} from "../_models/users";
import {faCaretDown, IconDefinition} from "@fortawesome/free-solid-svg-icons";
import {DialogNotesComponent} from "../dialog-notes/dialog-notes.component";
import {MatDialog} from "@angular/material/dialog";
import {MatSidenav} from "@angular/material/sidenav";


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  navData = navbarData;
  navDataSuperAdmin = navbarDataAdmin
  @Input() user!: User;
  caretDown: IconDefinition = faCaretDown;
  currentTime = new Date();
  weekdays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  month = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']

  formattedTime = this.currentTime.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',

  });


  constructor(public userService: UserService,
              public dialog: MatDialog,) {

  }



  toggleSubnav(data: any) {
    console.log(data)
    if (data.children) {
      data.children.forEach((child: { routeLink: string, icon: any, label: string, visible: boolean }) => {
        child.visible = !child.visible;
      });
    }
  }

  closeSidenav() {
    if (this.sidenav && this.sidenav.opened) {
      this.sidenav.close();
    }
  }

  ngOnInit() {
    setInterval(() => {
      this.currentTime = new Date();
      this.formattedTime = this.currentTime.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',

      });
    }, 1000); // mise à jour toutes les secondes


  }


  openDialog() {
    const dialogRef = this.dialog.open(DialogNotesComponent, {
      width: '250px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Fin de commentaires', result);
      // this.logger.error('error');


    });
  }


}










