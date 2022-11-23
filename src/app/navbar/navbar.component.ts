import {Component} from '@angular/core';
import {SuperAdminService} from '../_service/superAdmin.service';

import {UserService} from "../_service/user.service";
import {navbarData} from "./nav-data"


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  navData = navbarData;


  constructor(public accountService: UserService, public superAdminService: SuperAdminService) {
    this.accountService.userValue
    this.superAdminService.userValue
  }
}
