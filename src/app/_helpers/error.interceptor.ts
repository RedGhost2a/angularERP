import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {NGXLogger} from 'ngx-logger';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private logger: NGXLogger,
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const started = Date.now();
    let status: number;

    return next.handle(req).pipe(
      tap(
        event => {
          if (event instanceof HttpResponse) {
            status = event.status;
            const elapsed = Date.now() - started;
            // this.logger.info('Info', `${req.method} "${req.urlWithParams}" ${status} in ${elapsed} ms`);
            // console.log(event.type)
            this.logger.info('Info', req.method, req.urlWithParams, status, {duration: elapsed});
          }
        },
        error => {
          if (error instanceof HttpErrorResponse) {
            const elapsed = Date.now() - started;
            this.logger.error('Error Http', error, error.headers, error.ok, elapsed);

          }
        }
      )
    );

  }

}
