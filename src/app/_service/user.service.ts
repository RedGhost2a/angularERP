import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {User} from "../_models/users";
import {BehaviorSubject, map, Observable} from "rxjs";
import {StorageService} from "./storage.service";
import {environment} from '../../environments/environment';
import {UserEditComponent} from "../parametres/user-edit/user-edit.component";
import {MatDialog} from "@angular/material/dialog";
import {UserEditPasswordComponent} from "../parametres/user-edit-password/user-edit-password.component";


@Injectable({
  providedIn: 'root'
})

export class UserService {
  private userSubject!: BehaviorSubject<User>;
  private user !: Observable<User>;
  role !: any
  currentUser!:User;
  users:User [] = []


  constructor(private router: Router,private http: HttpClient, private storageService: StorageService,
              private dialog: MatDialog) {
    this.setInLocalStorage()
  }

  setInLocalStorage(){
    const string = localStorage.getItem('user');
    if (string) {
      const decryptUser = this.storageService.decrypt(string);
      const parse = JSON.parse(decryptUser);
      this.userSubject = new BehaviorSubject<User>(parse);
    } else {
      this.userSubject = new BehaviorSubject<User>(new User());
    }
    this.user = this.userSubject.asObservable();
    this.user.subscribe((user) =>{
      this.currentUser = user
    })
  }

  public get userValue(): User {
    return this.userSubject.value;
  }





  login(email: string, password: string) {
    console.log('mot de passe ',password)
    return this.http.post<User>(`${environment.apiUrl}/users/authenticate`, {email, password})
      .pipe(map(user => {
        if (user.firstConnexion === true){
          this.dialog.open(UserEditPasswordComponent, { disableClose: true }).afterClosed().subscribe(()=>{
            this.logout()
            this.router.navigate(['/login'])
          })
        }

        // store user details and jwt token in local storage to keep user logged in between page refreshes
        let string = JSON.stringify(user)
        console.log("user",user.token)
        let encryptUser = this.storageService.encrypt(string)
        localStorage.setItem('user', encryptUser);
        localStorage.setItem('coef', String(1));
        this.userSubject.next(user);

        return user;

      }));
  }

  logout() {
    console.log("logout")
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    localStorage.removeItem('coef');
    this.userSubject.next(null!);
    this.router.navigate(['/login']);
  }

  register(user: User): Observable<any> {
    console.log(user)
    this.users = []
    return this.http.post(`${environment.apiUrl}/users/new`, user);
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/users/current`)
  }

  getAll(): Observable<any> {
    console.log(this.userValue.token)
    this.users = []
    // Utilisez l'objet headers dans la requête GET
    return this.http.get(`${environment.apiUrl}/users`);
  }

  update(user: User, id: any): Observable<any> {
    this.users = []
    return this.http.put(`${environment.apiUrl}/users/${id}`, user)
  }

  getById(id: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}/users/${id}`)
  }

  deleteByID(id: any): Observable<any> {
    this.users = []
    return this.http.delete(`${environment.apiUrl}/users/${id}`)
  }

  openDialogCreate(user: User | null, refreshData : any) {
    this.dialog.open(UserEditComponent, {
      data:user,
      width: '700px',
      height: '50%'
    }).afterClosed().subscribe(async result => {
      refreshData()
    });
  }

  openDialogUpdatePassword(refreshData : any) {
    const dialogRef =  this.dialog.open(UserEditPasswordComponent, {
      width: '300px',
      height: '300px'
    }).afterClosed().subscribe(async result => {
      refreshData()
    });
  }

  updatePassword(id: string, oldPassword: string, password: string,firstConnexion:boolean) {
    return this.http.put(`${environment.apiUrl}/users/update-password/${id}`, {
      oldPassword: oldPassword,
      password: password,
      firstConnexion:firstConnexion
    });
  }

}
