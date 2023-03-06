import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {User} from "../_models/users";
import {BehaviorSubject, Observable} from "rxjs";
import {StorageService} from "./storage.service";
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SuperAdminService {
  private userSubject !: BehaviorSubject<User>;
  public user !: Observable<User>;
  role !: any


  constructor(private router: Router,
              private http: HttpClient,
              private storageService: StorageService,
  ) {
    //   // @ts-ignore
    //   this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    //   this.user = this.userSubject.asObservable();
    // }

    let string = localStorage.getItem('user')
    if (string) {

      let decryptUser = this.storageService.decrypt(string)
      let parse = JSON.parse(decryptUser)
      // @ts-ignore
      this.userSubject = new BehaviorSubject<User>(parse);
      this.user = this.userSubject.asObservable();
    } else {
      // @ts-ignore
      this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));

    }
    // console.log(string)
    // console.log(parse)
  }


  public get userValue(): User {
    return this.userSubject.value;
  }


  getAll(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/admin`)
  }

  getById(id: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}/admin/${id}`)
  }


}
