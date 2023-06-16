import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserService} from "../../_service/user.service";
import {User} from "../../_models/users";
import {MatTableDataSource} from "@angular/material/table";
import {Cout} from "../../_models/cout";
import {FormCoutComponent} from "../../form-cout/form-cout.component";
import {MatDialog} from "@angular/material/dialog";
import {UserEditComponent} from "../user-edit/user-edit.component";
import {DataSharingService} from "../../_service/data-sharing-service.service";
import {Devis} from "../../_models/devis";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'firstName', 'lastName', 'email', 'role','entreprise', 'boutons'];
  dataSource!: MatTableDataSource<User> ;


  constructor(private userService: UserService, private dialog: MatDialog, private dataShingService: DataSharingService) {

  }

  ngOnInit(): void {
    this.getAll()
  }

  delete(id: any): void {
    this.userService.deleteByID(id).subscribe(() => this.getAll())
  }
  update(user: User, id: number): void {
    this.userService.update(user, id).subscribe(() => this.getAll())
  }
  applyFilter(event: Event) {
    this.dataShingService.applyFilter(event,this.dataSource)
  }

  getAll(): void {
    this.userService.getAll().subscribe(listUsers => {
      this.dataSource = new MatTableDataSource(listUsers);
      console.log(listUsers)
    });
  }
  openDialogCreate(user: User | null) {
    this.userService.openDialogCreate(user, ()=>{
      this.getAll()
    })

  }

}
