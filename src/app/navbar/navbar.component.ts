import {Component, Input} from '@angular/core';
import {SuperAdminService} from '../_service/superAdmin.service';

import {UserService} from "../_service/user.service";
import {navbarData} from "./nav-data"
import {navbarDataAdmin} from "./nav-dataAdmin"
import {User} from "../_models/users";


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  navData = navbarData;
  navDataSuperAdmin = navbarDataAdmin
  @Input() user!: User;


  constructor(public userService: UserService, public superAdminService: SuperAdminService) {
    this.userService.userValue
    this.superAdminService.userValue
  }


  ngOnInit() {

  }

  ngAfterViewInit() {

  }

}










