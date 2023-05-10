import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserService} from "../../_service/user.service";
import {User} from "../../_models/users";
import {MatTableDataSource} from "@angular/material/table";
import {Cout} from "../../_models/cout";
import {FormCoutComponent} from "../../form-cout/form-cout.component";
import {MatDialog} from "@angular/material/dialog";
import {UserEditComponent} from "../user-edit/user-edit.component";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  @Input() user!: User;
  @Output() deleteUser: EventEmitter<any> = new EventEmitter()
  displayedColumns: string[] = ['id', 'title', 'firstName', 'lastName', 'email', 'role', 'boutons'];
  dataSource!: any;
  listUser !: User[];


  constructor(private userService: UserService, private dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.getAll()
  }

  delete(id: any): void {
    this.userService.deleteByID(id).subscribe(() => this.ngOnInit())
  }
  update(user: User, id: number): void {
    this.userService.update(user, id).subscribe(() => this.ngOnInit())
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAll(): void {
    this.userService.getAll().subscribe(data => {
      console.log(data,'45')
      this.dataSource = new MatTableDataSource(data);
      // Convert each user's avatar data from a Buffer to a base64-encoded string
      this.listUser = data.map((user: { avatarUrl: any; }) => {
        // Check if avatarUrl is null or undefined
        // if (user.avatarUrl && user.avatarUrl.data) {
        //   // Convert avatarUrl.data to a Buffer object and then to a base64-encoded string
        //   const avatarUrlString = Buffer.from(user.avatarUrl.data).toString('base64');
        //   user.avatarUrl = 'data:image/jpeg;base64,' + avatarUrlString;
        // }
        console.log(user)
        return user;
      });
    });
  }
  openDialogCreate(user: User | null) {
    this.dialog.open(UserEditComponent, {
      data:user,
      width: '70%',
      height: '78%'
    }).afterClosed().subscribe(async result => {
      this.ngOnInit()

    });
  }

}
