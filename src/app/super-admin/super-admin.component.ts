import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {EntrepriseService} from "../_service/entreprise.service";
import {Entreprise} from "../_models/entreprise";
import {SuperAdminService} from "../_service/superAdmin.service";
import {User} from "../_models/users";
import {NotesService} from "../_service/notes.service";
import {ImportExcelService} from "../_service/importExcel.service";
import {Notes} from "../_models/notes";
import {DialogConfirmSuppComponent} from "../dialog-confirm-supp/dialog-confirm-supp.component";
import {MatDialog} from "@angular/material/dialog";
import {NGXLogger} from "ngx-logger";
import {LogsService} from "../_service/logs.service";
import {Log} from "../_models/log";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormGroup} from "@angular/forms";
import {DialogImportExcelComponent} from "../dialog-import-excel/dialog-import-excel.component";
import {CoutService} from "../_service/cout.service";
import {UserService} from "../_service/user.service";
import {TypeCoutService} from "../_service/typeCout.service";
import {FournisseurService} from "../_service/fournisseur.service";
import {ImportExcel} from "../_models/importExcel";
import {Toastr, TOASTR_TOKEN} from "../_service/toastr.service";
import {DialogUniteForFormComponent} from "../dialog-unite-for-form/dialog-unite-for-form.component";


@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.scss'],
  providers: [
    NGXLogger
  ]
})
export class SuperAdminComponent implements OnInit, AfterViewInit {
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild(MatPaginator) paginator2!: MatPaginator;

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('paginator2') paginator2!: MatPaginator;


  listEntreprise !: Entreprise[];
  listUser !: User[];
  user!: string;
  devis: any;
  notes!: Notes[];

  AllLogs: any
  logEntries: Log[] = [];
  errorEntries: Log[] = [];
  methodColors: Record<string, string> = {
    'GET': 'green',
    'POST': 'blue',
    'PUT': 'orange',
    'DELETE': 'red'
  };
  logs!: any;
  displayedColumns: string[] = ['id', 'level', 'method', 'createdAt', 'url', 'UserId', 'status', 'duration'];
  displayedColumns2: string[] = ['Id', 'Level', 'Type d\'erreur', 'Date', 'Statut', 'Message', 'Url', 'Utilisateur', 'Durée', 'Détails'];
  dataSource !: MatTableDataSource<Log>;
  dataSource2 !: MatTableDataSource<Log>;
  public notesForm: FormGroup;
  file: File | undefined;
  data: any[] = [];
  importForm!: FormGroup;
  importedFiles!: ImportExcel[];


  constructor(private entrepriseService: EntrepriseService,
              private superAdminService: SuperAdminService,
              private notesService: NotesService,
              private dialog: MatDialog,
              private logService: LogsService,
              private formBuilder: FormBuilder,
              private importExcelService: ImportExcelService,
              private coutService: CoutService,
              private userService: UserService,
              private typeCoutService: TypeCoutService,
              private fournisseurService: FournisseurService,
              @Inject(TOASTR_TOKEN) private toastr: Toastr,
  ) {
    this.dataSource = new MatTableDataSource<Log>();
    this.dataSource2 = new MatTableDataSource<Log>();

    this.notesForm = this.formBuilder.group({
      title: "",
      text: "",
      typeError: "",
      optionsTypeError: "",
      createdAt: "",
      optionsTimestamp: "",
      errorLogs: "",
      resolution: "",

    })

    this.importForm = this.formBuilder.group({
      title: '',
      data: ""
    })

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource2.paginator = this.paginator2;
  }

  ngOnInit(): void {
    this.getAll()
    this.getAllNotes()
    this.getLogs()
    this.getNotesAndLogsByTimestamp()
    // this.uploadData()
    this.getAllImportExcel()

  }

  getAllImportExcel() {
    this.importExcelService.getAll().subscribe(data => {
      this.importedFiles = data;
    });
  }

  getAll(): void {
    this.entrepriseService.getAll().subscribe((data: any) => {
        this.listEntreprise = data
        const nbDevisByCompany = this.listEntreprise.map((value: any, index) => {
          return value.Devis.length
        })

        this.devis = nbDevisByCompany
        // console.log(this.listEntreprise)
        // console.log(nbDevisByCompany)
        // console.log(this.devis)
      }
    )
  }

  getAllUserByEntreprise(id: any): void {
    this.superAdminService.getById(id).subscribe(data => this.listUser = data)

  }


  getLogs(): void {
    this.logService.getLogs().subscribe(logs => {
      this.logs = logs;
      // console.log(logs)
      this.logEntries = this.logs.sort((a: { id: number; }, b: { id: number; }) => b.id - a.id); // trier les logs par ID en ordre décroissant
      this.logEntries = this.logs.filter((entry: Log) => entry.level === '2');

      this.errorEntries = this.logs.filter((entry: Log) => entry.level === '5' || entry.level === '6');
      // console.log(this.errorEntries)
      this.dataSource = new MatTableDataSource<Log>(this.logEntries);
      this.dataSource2 = new MatTableDataSource<Log>(this.errorEntries);
      // Assignation du paginator au dataSource
      this.dataSource.paginator = this.paginator;
      this.dataSource2.paginator = this.paginator2;

    });

  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource2.filter = filterValue.trim().toLowerCase();
  }

  getDurationColor(duration: number): string {
    const startColor = [48, 152, 52]; // vert
    const endColor = [255, 0, 0]; // rouge
    const maxDuration = 1500; // durée maximale en ms

    // Interpolation linéaire entre les couleurs
    const t = Math.min(duration / maxDuration, 1); // normaliser la durée entre 0 et 1
    const color = startColor.map((c, i) => Math.round(c + (endColor[i] - c) * t));

    // Convertir la couleur en format CSS
    return `rgb(${color.join(',')})`;
  }


  getAllNotes(): void {
    this.notesService.getAllNote().subscribe(data => {
      this.notes = data
      // console.log(this.notes)

    });
  }


  getNotesAndLogsByTimestamp(): void {
    this.notesService.getAllNote().subscribe((notes: any[]) => {
      this.notes = notes.filter(note => note.typeError === 'J\'ai rencontré une erreur !');
      // console.log('Notes :', this.notes);

      this.logService.getLogs().subscribe(logs => {
        // const errorLogs: { [noteId: string]: Log[] } = {};

        this.notes.forEach(note => {
          const noteTimestamp = new Date(note.optionsTimestamp ?? note.createdAt).getTime();
          // console.log(noteTimestamp);

          note.errorLogs = [];

          logs.forEach(log => {
            const logTimestamp = new Date(log.timestamp).getTime();
            // console.log("logtimestamp", log.id, logTimestamp)
            const diff = Math.abs(logTimestamp - noteTimestamp);
            const marginOfError = 100000; // 100 secondes de marge d'erreur

            if (diff <= marginOfError && log.level === '5') {
              note.errorLogs.push(log);
            }
          });

          // console.log('Error logs for note', note.id, ':', note.errorLogs);
        });
      });
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

  onNoteResolutionChanged(note: Notes) {
    this.notesService.updateNoteResolution(note).subscribe(
      (response) => {
        console.log('Note résolue sauvegardée avec succès', response);
      },
      (error) => {
        console.error('Une erreur est survenue lors de la sauvegarde de la note résolue', error);
      }
    );
  }


  openImportDialog(): void {
    const dialogRef = this.dialog.open(DialogImportExcelComponent, {
      width: '500px',
      // data: { form: this.importForm }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }




  async uploadData(): Promise<void> {
    const file = this.importedFiles.find(f => f.checked);
    if (!file) {
      this.toastr.error('Erreur', 'Aucun fichier sélectionné');
      return;
    }
    if (file) {
      this.importExcelService.getById(file.id).subscribe(async data => {
        console.log('Data retrieved:', data);
        for (let i = 1; i < data.data.data.length; i++) {
          const ligne = data.data.data[i];
          console.log('Ligne:', ligne);
          try {
            this.fournisseurService.getFournisseurIdByName(ligne[5]).subscribe(fournisseurId => {
              const fournId: number = fournisseurId;
              console.log('Fournisseur ID:', fournisseurId);
              try {
                this.typeCoutService.getTypeCoutIdByLabel(ligne[0]).subscribe(typeCout => {
                  const typeId: number = typeCout;
                  console.log('Type cout:', typeCout);
                  try {
                    this.userService.getById(this.userService.userValue.id).subscribe(data => {
                      const userId = data.id;
                      console.log('User ID:', userId);

                      const cout = {
                        id: 0,
                        TypeCoutId: typeId,
                        designation: ligne[1],
                        EntrepriseId: data.Entreprises[0].id,
                        prixUnitaire: ligne[3],
                        unite: ligne[4],
                        FournisseurId: fournId
                      };

                      console.log('Cout:', cout);

                      this.coutService.create(cout).subscribe(
                        () => {
                          this.toastr.success('Parfait', 'Ajout à la bibliothèque réussie');
                        },
                        (error) => {
                          this.toastr.error('Attention', 'Une erreur est survenue');
                          console.error(error);
                        }
                      );
                    });
                  } catch (error) {
                    this.toastr.error('Attention', 'Une erreur est survenue');
                    console.error(error);
                  }
                });
              } catch (error) {
                this.toastr.error('Attention', 'Une erreur est survenue');
                console.error(error);
              }
            });
          } catch (error) {
            this.toastr.error('Attention', 'Une erreur est survenue');
            console.error(error);
          }
        }
      });
    }
  }


  openUniteForFormDialog(): void {
    const dialogRef = this.dialog.open(DialogUniteForFormComponent, {
      width: '500px',
      // data: { form: this.importForm }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }


}
