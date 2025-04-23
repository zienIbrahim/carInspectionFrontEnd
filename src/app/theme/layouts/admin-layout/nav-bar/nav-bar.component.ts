// angular import
import { Component, output } from '@angular/core';

// project import

import { NavLeftComponent } from './nav-left/nav-left.component';
import { NavRightComponent } from './nav-right/nav-right.component';

@Component({
  selector: 'app-nav-bar',
  imports: [NavLeftComponent, NavRightComponent],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {
  // public props
  NavCollapse = output();
  NavCollapsedMob = output();

  navCollapsed: boolean;
  windowWidth: number;
  navCollapsedMob: boolean;

  // Constructor
  constructor() {
    this.windowWidth = window.innerWidth;
    this.navCollapsedMob = false;
  }

  // public method
  navCollapse() {
    this.navCollapsed = !this.navCollapsed;
    this.NavCollapse.emit();
    // if (this.windowWidth >= 1025) { fix it 
     
    // }
  }

  navCollapseMob() {
    this.NavCollapsedMob.emit();
  }
}
