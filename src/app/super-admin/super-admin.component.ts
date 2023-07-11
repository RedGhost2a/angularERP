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
import {firstValueFrom} from "rxjs";
import {UniteForFormService} from "../_service/uniteForForm.service";


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
  dataSourceEntreprise = new MatTableDataSource<Entreprise>([]);
  displayedColumnsEntreprise: string[] = ['nEntreprise', 'commercialName', 'denomination', 'siret', 'phoneNumber'];

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
  progressValue!: number;
  visible: boolean = true;


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
              private uniteService: UniteForFormService,
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
        this.dataSourceEntreprise = data;
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


  async importType(): Promise<void> {
    const NO_FILE_SELECTED = 'Aucun fichier sélectionné';
    const NO_FILE_SELECTED_ERROR = 'Erreur';
    const file = this.importedFiles.find(f => f.checked);
    const user = await firstValueFrom(this.userService.getById(this.userService.userValue.id));
    let progress = 0;
    if (!file) {
      this.toastr.error(NO_FILE_SELECTED_ERROR, NO_FILE_SELECTED);
      return;
    }
    const data = await firstValueFrom(this.importExcelService.getById(file.id));
    const total = data.data.length - 1; // Décompte total des éléments à traiter
    for (let i = 1; i < data.data.length; i++) {
      const ligne = data.data[i];
      try {
        const typeId = await this.getOrAddType(ligne, user); // Créer le type
        const fournId = await this.getOrAddFournisseur(ligne, user); // Créer le fournisseur
        const promises = [
          this.getOrAddUnite(ligne, user, typeId),
          this.getOrAddComposant(ligne, user, typeId, fournId)
        ];
        await Promise.all(promises);
      } catch (error) {
        console.error('Erreur lors de la création du type, du fournisseur, de l\'unité ou du coût:', error);
        this.toastr.error("erreur", 'Erreur lors de la création du type, du fournisseur, de l\'unité ou du coût');
      }
      progress++;
      this.updateProgressBar((progress / total) * 100);
    }
    this.visible = false;
  }

  updateProgressBar(value: number) {
    this.visible = true;
    this.progressValue = value;
  }

  async getOrAddFournisseur(ligne: any, user: any) {
    let fournId;
    try {
      fournId = await firstValueFrom(this.fournisseurService.getFournisseurIdByName(ligne[3]));
    } catch (error) {
      const err = error as { status: number };
      if (err.status === 404) {
        fournId = await this.addFournisseur(ligne, user);
      } else {
        throw error;
      }

    }
    return fournId;
  }

  async addFournisseur(ligne: any, user: any) {
    const fourn = {
      id: 0,
      commercialName: ligne[3],
      remarque: "Néant",
      EntrepriseId: user.Entreprises[0].id,
    }
    const fournisseurResponse = await firstValueFrom(this.fournisseurService.createFournisseur(fourn));
    return fournisseurResponse?.id;
  }

  async getOrAddType(ligne: any, user: any) {
    let typeId;
    try {
      let type = encodeURIComponent(ligne[0]);
      let categorie = encodeURIComponent(ligne[1]);
      typeId = await firstValueFrom(this.typeCoutService.getTypeCoutIdByTypeAndCategorie(type, categorie));
      console.log('ID du type de coût trouvé :', typeId);
    } catch (error) {
      const err = error as { status: number }; // assertion de type ici
      if (err.status === 404) {
        typeId = await this.addType(ligne, user)
      } else {
        throw error;
      }
    }
    return typeId
  }

  async addType(ligne: any, user: any) {
    const type = {
      id: 0,
      type: ligne[0],
      categorie: ligne[1],
      EntrepriseId: user.Entreprises[0].id,

    }
    const typeCoutResponse = await firstValueFrom(this.typeCoutService.createTypeCout(type));
    console.log('Type de coût créé avec succès :', typeCoutResponse);
    return typeCoutResponse?.id;
  }


  async getOrAddUnite(ligne: any, user: any, typeId: number) {
    let uniteId;
    try {
      uniteId = await firstValueFrom(this.uniteService.getUniteByLabel(ligne[5]));
      console.log('ID du type de unite trouvé :', uniteId);
    } catch (error) {
      const err = error as { status: number };
      if (err.status === 404) {
        uniteId = await this.addUnite(ligne, user, typeId)
      } else {
        throw error;
      }
    }
    return uniteId
  }

  async addUnite(ligne: any, user: any, typeId: number) {
    console.log("========>", typeId)
    const unite = {
      id: 0,
      name: ligne[5],
      EntrepriseId: user.Entreprises[0].id,
      TypeCoutId: typeId,


    }
    const uniteCoutResponse = await firstValueFrom(this.uniteService.create(unite));
    console.log('Unite de coût créé avec succès id :', uniteCoutResponse.data.id);
    return uniteCoutResponse?.id;
  }

  async getOrAddComposant(ligne: any, user: any, typeId: number, fournId: string) {
    let coutId;
    try {
      coutId = await firstValueFrom(this.coutService.getCoutByLabel(ligne[3]))
      console.log('ID du cout trouvé :', coutId);

    } catch (error) {
      const err = error as { status: number };
      if (err.status === 404) {
        coutId = await this.addCout(ligne, user, typeId, fournId)
      } else {
        throw error;
      }
    }
    return coutId;
  }

  async addCout(ligne: any, user: any, typeId: number, fournId: any) {

    const cout = {
      id: 0,
      TypeCoutId: typeId,
      designation: ligne[2],
      EntrepriseId: user.Entreprises[0].id,
      prixUnitaire: ligne[6],
      unite: ligne[5],
      FournisseurId: fournId
    };
    console.log('Nouveau coût à ajouter :', cout);

    await firstValueFrom(this.coutService.create(cout));
    console.log('Le coût a été ajouté avec succès.');

  }


  // async uploadData(): Promise<void> {
  //   const file = this.importedFiles.find(f => f.checked);
  //   if (!file) {
  //     console.log('Aucun fichier sélectionné');
  //     this.toastr.error('Erreur', 'Aucun fichier sélectionné');
  //     return;
  //   }
  //   console.log('Fichier sélectionné :', file);
  //
  //   try {
  //     const data = await firstValueFrom(this.importExcelService.getById(file.id));
  //     console.log('Données récupérées :', data);
  //
  //     for (let i = 1; i < data.data.length; i++) {
  //       const ligne = data.data[i];
  //       console.log('Ligne traitée :', ligne);
  //
  //       let fournId;
  //       let user;
  //       let typeId;
  //       user = await firstValueFrom(this.userService.getById(this.userService.userValue.id));
  //       const userId = user.id;
  //       console.log('ID de l\'utilisateur :', userId);
  //       try {
  //         fournId = await firstValueFrom(this.fournisseurService.getFournisseurIdByName(ligne[3]));
  //         console.log('ID du fournisseur trouvé :', fournId);
  //       } catch (error) {
  //         const err = error as { status: number }; // assertion de type ici
  //         if (err.status === 404) { // vérifiez le champ correct pour le code d'erreur
  //           const fourn = {
  //             id: 0,
  //             commercialName: ligne[3],
  //             remarque: "Néant",
  //             EntrepriseId: user.Entreprises[0].id,
  //           }
  //           const fournisseurResponse = await firstValueFrom(this.fournisseurService.createFournisseur(fourn));
  //           console.log('Fournisseur créé avec succès :', fournisseurResponse);
  //           fournId = fournisseurResponse?.id; // Suppose que la réponse contient le nouvel id
  //         } else {
  //           throw error;
  //         }
  //       }
  //       try {
  //         typeId = await firstValueFrom(this.typeCoutService.getTypeCoutIdByLabel(ligne[0]));
  //         console.log('ID du type de coût trouvé :', typeId);
  //       } catch (error) {
  //         const err = error as { status: number }; // assertion de type ici
  //
  //         if (err.status === 404) {
  //           const typeCout = {
  //             id: 0,
  //             type: ligne[0],
  //             categorie: ligne[1],
  //             EntrepriseId: user.Entreprises[0].id,
  //           };
  //           const typeCoutResponse = await firstValueFrom(this.typeCoutService.createTypeCout(typeCout));
  //           console.log('Type de coût créé avec succès :', typeCoutResponse);
  //           typeId = typeCoutResponse?.id; // Suppose que la réponse contient le nouvel id
  //         } else {
  //           throw error;
  //         }
  //       }
  //
  //
  //       const cout = {
  //         id: 0,
  //         TypeCoutId: typeId,
  //         designation: ligne[2],
  //         EntrepriseId: user.Entreprises[0].id,
  //         prixUnitaire: ligne[6],
  //         unite: ligne[5],
  //         FournisseurId: fournId
  //       };
  //       console.log('Nouveau coût à ajouter :', cout);
  //
  //       await firstValueFrom(this.coutService.create(cout));
  //       console.log('Le coût a été ajouté avec succès.');
  //       this.toastr.success('Parfait', 'Ajout à la bibliothèque réussie');
  //     }
  //   } catch (error) {
  //     console.error('Erreur lors de l\'importation :', error);
  //     this.toastr.error('Attention', 'Une erreur est survenue');
  //   }
  // }

  openUniteForFormDialog(): void {
    const dialogRef = this.dialog.open(DialogUniteForFormComponent, {
      height: '50%',
      // data: { form: this.importForm }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openDialogCreate(user: User | null) {
    this.userService.openDialogCreate(user, () => {
      this.getAll()
    })

  }


}
