import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {btnClose, btnHome, navbarData} from "./nav-data";
interface SideNavToggle {
  screenWidth:number;
  collapsed:boolean;
}
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  @Output() onToggleSidebar:EventEmitter<SideNavToggle> = new EventEmitter()
  collapsed = false;
  screenWidth = 0;
  navData = navbarData;
  btnClose =btnClose;
  btnHome = btnHome;

  constructor() { }

  ngOnInit(): void {
  }

  closeSidebar():void {
    this.collapsed= false;
    this.onToggleSidebar.emit({collapsed: this.collapsed, screenWidth: this.screenWidth} )

  }

  toggleCollapse():void {
    this.collapsed =!this.collapsed;
    this.onToggleSidebar.emit({collapsed: this.collapsed, screenWidth: this.screenWidth} )
  }
}
