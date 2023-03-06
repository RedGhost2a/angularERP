import {Injectable} from '@angular/core';
import * as CryptoJS from 'crypto-js';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class StorageService {
  secretKey = environment.secretKey;

  constructor() {
  }


  encrypt(value: any): string {
    return CryptoJS.AES.encrypt(value, this.secretKey.trim()).toString();
  }

  decrypt(textToDecrypt: any) {
    return CryptoJS.AES.decrypt(textToDecrypt, this.secretKey.trim()).toString(CryptoJS.enc.Utf8);
  }
}
