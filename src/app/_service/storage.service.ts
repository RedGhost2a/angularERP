import {Injectable} from '@angular/core';
import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class StorageService {
  secretKey = "djfndjfdofjndjbkjhgvfcdcfghkjdbckjsdv";

  constructor() {
  }


  encrypt(value: any): string {
    return CryptoJS.AES.encrypt(value, this.secretKey.trim()).toString();
  }

  decrypt(textToDecrypt: any) {
    return CryptoJS.AES.decrypt(textToDecrypt, this.secretKey.trim()).toString(CryptoJS.enc.Utf8);
  }
}
