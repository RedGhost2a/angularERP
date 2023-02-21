import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {LogService} from '../_service/log.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private logService: LogService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const started = Date.now();
    let status: string;

    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          status = 'succeeded';
          const elapsed = Date.now() - started;

          this.logService.addLog({
            level: 'Info',
            message: `${request.method} "${request.urlWithParams}" ${status} in ${elapsed} ms`,
            timestamp: new Date(),
            url: request.url,
            method: request.method,
            requestHeaders: request.headers,
            requestBody: request.body,
            responseBody: event.body,
            responseHeaders: event.headers,
            fileName: null,
            lineNumber: null,
            functionName: null,
            status: event.status,
            statusText: event.statusText,
            errorName: null,
            methodName: null,
          });
        }
      }),
      catchError(error => {

        const logData = {
          level: 'Error',
          message: error.message,
          timestamp: new Date(),
          url: request.url,
          method: request.method,
          requestBody: request.body || null,
          requestHeaders: request.headers ? request.headers : null,
          responseBody: error.error || error.message,
          responseHeaders: error.headers ? error.headers : null,
          fileName: null,
          lineNumber: null,
          functionName: null,
          status: error.status || null,
          statusText: error.statusText || null,
          errorName: error.name || 'HttpErrorResponse',
          methodName: null,
          elapsed: Date.now() - started
        };

        this.logService.addLog(logData);

        const errorResponse = error.error || error.message;
        return throwError(error);
      })
    );
  }
}
