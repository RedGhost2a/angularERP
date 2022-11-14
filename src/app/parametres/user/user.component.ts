import {Component, OnInit} from '@angular/core';
import {UserService} from "../../_service/user.service";
import {User} from "../../_models/users";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  user: User;


  constructor(private accountService: UserService) {
    this.user = this.accountService.userValue;
  }

  ngOnInit(): void {
  }


}
