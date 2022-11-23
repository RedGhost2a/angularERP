import {Component} from '@angular/core';
import {UserService} from "./_service/user.service";
import {User} from "./_models/users";
import {Role} from "./_models/role";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  user!: User;

  constructor(public userService: UserService) {

  }

  get isAdmin() {
    return this.user && this.user.role === Role.SuperAdmin;
  }

}
