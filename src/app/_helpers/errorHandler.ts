import {ErrorHandler, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';

@Injectable()
export class CustomErrorHandler implements ErrorHandler {
  constructor(private logger: NGXLogger) {
  }

  handleError(error: any): void {
    if (error instanceof Error) {
      // Enregistrer l'erreur dans la console
      this.logger.fatal('Fatal error', error);
    }
  }
}
