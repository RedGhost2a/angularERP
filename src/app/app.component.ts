import {Component} from '@angular/core';
import {UserService} from "./_service/user.service";
import {User} from "./_models/users";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  user!: User;
  role!: String;

  constructor(public userService: UserService) {

  }

  ngOnInit(): void {
    // this.getRole()

  }

  // getRole() {
  //   this.role = this.userService.getRole()
  //   console.log(this.role)
  //   return this.role
  // }

}
