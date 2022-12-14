import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserService} from "../../_service/user.service";
import {User} from "../../_models/users";
import {Buffer} from 'buffer';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  @Input() user!: User;
  @Output() deleteUser: EventEmitter<any> = new EventEmitter()

  listUser !: User[];


  constructor(private userService: UserService) {

  }

  ngOnInit(): void {
    this.getAll()
  }

  delete(id: any): void {
    this.userService.deleteByID(id).subscribe(() => this.ngOnInit())
  }

  getAll(): void {
    this.userService.getAll().subscribe(data => {
      // Convert each user's avatar data from a Buffer to a base64-encoded string
      this.listUser = data.map((user: { avatarUrl: any; }) => {
        // Check if avatarUrl is null or undefined
        if (user.avatarUrl && user.avatarUrl.data) {
          // Convert avatarUrl.data to a Buffer object and then to a base64-encoded string
          const avatarUrlString = Buffer.from(user.avatarUrl.data).toString('base64');
          user.avatarUrl = 'data:image/jpeg;base64,' + avatarUrlString;
        }
        console.log(user)
        return user;
      });
    });
  }
}
