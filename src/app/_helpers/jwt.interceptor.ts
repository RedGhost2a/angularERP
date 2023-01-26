import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserService} from "../_service/user.service";
import {Router} from "@angular/router";


@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private accountService: UserService, private router: Router) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const user = this.accountService.userValue;
    const isLoggedIn = user && user.token;
    // const isApiUrl = request.url.startsWith(environment.apiUrl);
   // console.log(isLoggedIn)
    if (isLoggedIn) {
      try {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${user.token}`
          }
        });
        //console.log(request)
      } catch (err) {

        console.log(err);
      }
    } else {
      this.router.navigate(['/login']);

    }
    return next.handle(request);
  }
}
