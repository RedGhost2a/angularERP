import {InjectionToken} from '@angular/core';

export let TOASTR_TOKEN = new InjectionToken<Toastr>('toastr');

export interface Toastr {
  // @ts-ignore
  success(msg: string, title: string)

  // @ts-ignore
  info(msg: string, title: string)

  // @ts-ignore
  warning(msg: string, title: string)

  // @ts-ignore
  error(msg: string, title: string)
}
