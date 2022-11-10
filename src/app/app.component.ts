import {Component} from '@angular/core';
import {navbarData} from "./sidenav/nav-data"


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  navData = navbarData;


}
