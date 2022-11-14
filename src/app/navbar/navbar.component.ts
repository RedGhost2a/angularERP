import {Component} from '@angular/core';

import {UserService} from "../_service/user.service";
import {navbarData} from "./nav-data"


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  navData = navbarData;


  constructor(public accountService: UserService,) {
    this.accountService.userValue
  }
}
