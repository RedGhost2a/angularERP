import {Inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

import {UserService} from '../_service/user.service';
import {Toastr, TOASTR_TOKEN} from "../_service/toastr.service";


@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private accountService: UserService,
    @Inject(TOASTR_TOKEN) private toastr: Toastr
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = this.accountService.userValue;
    if (user) {
      // console.log(route.data['roles'] && route.data['roles'].indexOf(user.role) === -1)
      if (route.data['roles'] && route.data['roles'].indexOf(user.role) === -1) {
        // role not authorised so redirect to home page
        this.warning("Vous n'avez pas les droits neccessaires pour effectuer ce type d'opération!")

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


  success(message: string): void {
    this.toastr.success(message, "Tout se passe bien");
  }

  warning(message: string): void {
    this.toastr.warning(message, "Attention");
  }
}
