import {Component, OnInit} from '@angular/core';
import {EntrepriseService} from "../_service/entreprise.service";
import {Entreprise} from "../_models/entreprise";
import {SuperAdminService} from "../_service/superAdmin.service";
import {User} from "../_models/users";
import {NotesService} from "../_service/notes.service";
import {Notes} from "../_models/notes";
import {DialogConfirmSuppComponent} from "../dialog-confirm-supp/dialog-confirm-supp.component";
import {MatDialog} from "@angular/material/dialog";


@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.scss']
})
export class SuperAdminComponent implements OnInit {

  // @Input() entreprise!: Entreprise;
  // @Output() deleteEntreprise: EventEmitter<any> = new EventEmitter()

  listEntreprise !: Entreprise[];
  listUser !: User[];
  user!: string;
  devis: any;
  notes!: Notes[];


  constructor(private entrepriseService: EntrepriseService,
              private superAdminService: SuperAdminService,
              private notesService: NotesService,
              private dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.getAll()
    this.getAllNotes()
  }


  getAll(): void {
    this.entrepriseService.getAll().subscribe((data: any) => {
        this.listEntreprise = data
        const nbDevisByCompany = this.listEntreprise.map((value: any, index) => {
          return value.Devis.length
        })

        this.devis = nbDevisByCompany
        console.log(this.listEntreprise)
        console.log(nbDevisByCompany)
        console.log(this.devis)
      }
    )
  }

  getAllUserByEntreprise(id: any): void {
    this.superAdminService.getById(id).subscribe(data => this.listUser = data)

  }

  getAllNotes(): void {
    this.notesService.getAllNote().subscribe(data => {
      this.notes = data
      // console.log(this.notes)

    });
  }

  deleteItem(id: number) {
    const dialogRef = this.dialog.open(DialogConfirmSuppComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Appeler la fonction de suppression ici
        this.notesService.delete(id).subscribe(() => this.ngOnInit());
      }
    });
  }


}
