import {Component, OnInit} from '@angular/core';
import {UserService} from "../../_service/user.service";
import {User} from "../../_models/users";
import {SuperAdminService} from "../../_service/superAdmin.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  user: User;
  superAdmin: User


  constructor(private accountService: UserService, private superAdminService: SuperAdminService) {
    this.user = this.accountService.userValue;
    this.superAdmin = this.superAdminService.userValue
  }

  ngOnInit(): void {
  }


}
