import {Component, Input} from '@angular/core';

import {UserService} from "../_service/user.service";
import {navbarData} from "./nav-data"
import {navbarDataAdmin} from "./nav-dataAdmin"
import {User} from "../_models/users";
import {faCaretDown, IconDefinition} from "@fortawesome/free-solid-svg-icons";


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  navData = navbarData;
  navDataSuperAdmin = navbarDataAdmin
  @Input() user!: User;
  caretDown: IconDefinition = faCaretDown;


  constructor(public userService: UserService) {

  }

  toggleSubnav(data: any) {
    console.log(data)
    if (data.children) {
      data.children.forEach((child: { routeLink: string, icon: any, label: string, visible: boolean }) => {
        child.visible = !child.visible;
      });
    }
  }

  ngOnInit() {
    // console.log(this.userService.userValue.avatarUrl)

  }


}










