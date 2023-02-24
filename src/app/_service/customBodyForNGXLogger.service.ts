import {Injectable} from '@angular/core';
import {INGXLoggerMetadata, NGXLoggerServerService} from 'ngx-logger';
import {UserService} from "./user.service";
import {HttpBackend} from "@angular/common/http";

@Injectable()
export class CustomBodyForNGXLoggerService extends NGXLoggerServerService {

  constructor(private userService: UserService, httpBackend: HttpBackend) {
    super(httpBackend);
  }

  public override customiseRequestBody(metadata: INGXLoggerMetadata): any {
    const userId = `${this.userService.userValue?.firstName} ${this.userService.userValue?.lastName}`;
    // Récupération de de l'utilisateur
    const body = {
      ...metadata,
      UserId: userId,
      statusText: metadata.additional?.[0].statusText || metadata.additional?.[4],
      status: metadata.additional?.[0].status || metadata.additional?.[2] || null,
      url: metadata.additional?.[0].url || metadata.additional?.[1],
      name: metadata.additional?.[0].name || metadata.additional?.[1],
      error: metadata.additional?.[0].error?.message,
      message: metadata.additional?.[0].message || metadata.additional?.[2],
      duration: metadata.additional?.[0].duration || metadata.additional?.[3].duration || metadata.additional?.[3],
      method: metadata.additional?.[0] || null,
      stack: metadata.additional?.[0].stack,


    };

    // console.log('Customised body is', body);

    return body;
  }
}
