import { Component } from '@angular/core';
import { navbarData} from "./sidenav/nav-data"

interface SideNavToggle {
  screenWidth:number;
  collapsed:boolean;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  navData = navbarData;


}
