import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserService} from "../../_service/user.service";
import {User} from "../../_models/users";

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
    this.userService.getAll().subscribe(data => this.listUser = data)

  }
}
