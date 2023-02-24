import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup} from "@angular/forms";
import {Notes} from "../_models/notes";
import {NotesService} from "../_service/notes.service";
import {ActivatedRoute} from "@angular/router";
import {Toastr, TOASTR_TOKEN} from "../_service/toastr.service";
import {UserService} from "../_service/user.service";


@Component({
  selector: 'app-dialogListOuvrage-notes',
  templateUrl: './dialog-notes.component.html',
  styleUrls: ['./dialog-notes.component.scss']
})
export class DialogNotesComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogNotesComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private noteService: NotesService,
              private route: ActivatedRoute,
              @Inject(TOASTR_TOKEN) private toastr: Toastr,
              private userService: UserService) {
  }

  editNoteForm!: FormGroup;
  note!: Notes
  typeErrorOptions: string[] = ["J'ai rencontré une erreur !", "J'ai une demande / suggestion !", "Je souhaite créer une note !", 'Autres'];
  SubtypeError: string[] = ['Création', 'Lecture', 'Modification', 'Suppression', "Autres", 'Je ne sais pas'];
  errorMessage!: string;
  // @ts-ignore
  user = this.userService.userValue;
  checked = false;
  submitted = false;

  ngOnInit() {
    this.editNoteForm = new FormGroup({
      'title': new FormControl(''),
      'text': new FormControl(''),
      'typeError': new FormControl(''),
      'optionsTypeError': new FormControl(' '),
      'userId': new FormControl(this.user.id),
      'optionsTimestamp': new FormControl(new Date()),
      // 'showDate': new FormControl(false),

    });


  }

  success(message: string): void {
    this.toastr.success(message, "Note enregistrer");
  }

  warning(message: string): void {
    this.toastr.warning(message, "Attention");
  }


  get f() {
    return this.editNoteForm.controls;
  }

  saveNote() {
    if (!this.editNoteForm.value.title || !this.editNoteForm.value.text || !this.editNoteForm.value.typeError) {
      this.errorMessage = 'Le titre, le texte et les options sont obligatoires ';
    }

    if (this.editNoteForm.valid) {

      const createdNote = this.editNoteForm.getRawValue();


      console.log(createdNote);
      this.noteService.create(createdNote).subscribe(data => {
        this.success("Merci pour votre retour !")
        this.editNoteForm.reset()
        this.dialogRef.close()
        this.errorMessage = ''
        console.log(data)
      });

    } else {
    }


  }


}
