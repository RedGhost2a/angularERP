import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

import {UserService} from "../_service/user.service";
import {SuperAdminService} from "../_service/superAdmin.service";
import {environment} from "../../environments/environment";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private accountService: UserService, private superAdminService: SuperAdminService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with jwt if user is logged in and request is to the api url
    const user = this.accountService.userValue;
    const isLoggedIn = user && user.token;
    const SuperAdmin = this.superAdminService.userValue
    const isAdminLoggedIn = SuperAdmin && SuperAdmin.token
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${user.token}`
        }
      });
      console.log(request)
    }
    if (isAdminLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${SuperAdmin.token}`
        }
      });

    }
    return next.handle(request);
  }
}
