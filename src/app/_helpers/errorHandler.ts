import {ErrorHandler, Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';

@Injectable()
export class CustomErrorHandler implements ErrorHandler {
  constructor(private logger: NGXLogger) {
  }

  handleError(error: any): void {
    const started = Date.now();

    if (error instanceof Error) {
      const elapsed = Date.now() - started;
      // Récupérer le message d'erreur
      const errorMessage = error.message;

      // Récupérer la stack trace de l'erreur
      const errorStack = error.stack || '';

// Récupérer le nom de l'erreur
      const errorNameMatch = errorStack.match(/^(.*Error):/);
      const errorName = errorNameMatch ? errorNameMatch[1] : '';


      // console.log('Error Name:', errorName);


      // Enregistrer l'erreur dans la console
      this.logger.fatal('Fatal error', error, error.name, 'Fatal error', 0, errorName);
    }
  }
}
