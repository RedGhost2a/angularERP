import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {User} from "../_models/users";
import {BehaviorSubject, Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class SuperAdminService {
  private userSubject !: BehaviorSubject<User>;
  public user !: Observable<User>;
  role !: any


  constructor(private router: Router,
              private http: HttpClient,
  ) {
    // @ts-ignore
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
  }

  //   let string = localStorage.getItem('user')
  //   if (string) {
  //
  //     let decryptUser = this.storageService.decrypt(string)
  //     let parse = JSON.parse(decryptUser)
  //     // @ts-ignore
  //     this.userSubject = new BehaviorSubject<User>(parse);
  //     this.user = this.userSubject.asObservable();
  //   } else {
  //     // @ts-ignore
  //     this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
  //
  //   }
  //   // console.log(string)
  //   // console.log(parse)
  // }


  public get userValue(): User {
    return this.userSubject.value;
  }

  // login(email: string, password: string) {
  //   return this.http.post<User>(`http://localhost:4000/admin/authenticate`, {email, password})
  //     .pipe(map(user => {
  //       // store user details and jwt token in local storage to keep user logged in between page refreshes
  //       // let string = JSON.stringify(user)
  //       localStorage.setItem('userID', JSON.stringify(user.id));
  //       this.userSubject.next(user);
  //       return user;
  //     }));
  // }
  //
  // logout() {
  //   console.log("logout")
  //   // remove user from local storage and set current user to null
  //   localStorage.removeItem('userID');
  //   this.userSubject.next(null!);
  //   this.router.navigate(['/home']);
  // }
  //
  // register(user: any): Observable<any> {
  //   return this.http.post('http://localhost:4000/admin/new', user);
  // }


  getAll(): Observable<any> {
    return this.http.get(`http://localhost:4000/admin`)
  }

  getById(id: any): Observable<any> {
    return this.http.get(`http://localhost:4000/admin/${id}`)
  }

  // update(user: User, id: any): Observable<any> {
  //   return this.http.put(`http://localhost:4000/admin/${id}`, user)
  // }
  //

  //
  // deleteByID(id: any): Observable<any> {
  //   return this.http.delete(`http://localhost:4000/admin/${id}`)
  // }
  //
  // getRole(): any {
  //   this.role = localStorage.getItem('user');
  //   this.role = JSON.parse(this.role)
  //   this.storageService.decrypt(this.role)
  //
  //   console.log(this.role.role)
  //   return this.role.role;
  // }

}
