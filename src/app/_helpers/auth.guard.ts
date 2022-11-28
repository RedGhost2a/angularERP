import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

import {UserService} from '../_service/user.service';
import {SuperAdminService} from "../_service/superAdmin.service";


@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private accountService: UserService,
    private superAdminService: SuperAdminService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = this.accountService.userValue;
    const superAdmin = this.superAdminService.userValue;
    if (user) {
      // console.log(route.data['roles'] && route.data['roles'].indexOf(user.role) === -1)
      if (route.data['roles'] && route.data['roles'].indexOf(user.role) === -1) {
        // role not authorised so redirect to home page
        this.router.navigate(['/']);
        return false;
      }
      // authorised so return true
      return true;
    }
    if (superAdmin) {
      // console.log(route.data['roles'] && route.data['roles'].indexOf(user.role) === -1)
      if (route.data['roles'] && route.data['roles'].indexOf(superAdmin.role) === -1) {
        // role not authorised so redirect to home page
        this.router.navigate(['/']);
        return false;
      }
      // authorised so return true
      return true;
    } else {

      // not logged in so redirect to login page with the return url
      this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
      return false;
    }

  }
}
