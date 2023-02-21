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

  constructor(private logger: NGXLogger) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const started = Date.now();
    let status: string;

    return next.handle(req).pipe(
      tap(
        event => {
          if (event instanceof HttpResponse) {
            status = 'succeeded';
            const elapsed = Date.now() - started;
            this.logger.info('Info', `${req.method} "${req.urlWithParams}" ${status} in ${elapsed} ms`);
          }
        },
        error => {
          if (error instanceof HttpErrorResponse) {
            this.logger.error('Error Http', error);
          }
        }
      )
    );
  }
}
