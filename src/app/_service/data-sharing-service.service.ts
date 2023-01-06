import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})

//service de partage de données entre les diffs composants avec une methode get et set
export class DataSharingService {
  lotId!: number

  constructor() {
    this.lotId = 0;

  }

  setLotId(id: number) {
    this.lotId = id;
    console.log(this.lotId);
  }

  getLotId() {
    console.log(this.lotId);

    return this.lotId;

  }
}
