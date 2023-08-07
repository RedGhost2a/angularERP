import {MetreStrategyInterface} from "../metre-strategy-interface/metre-strategy.interface";
import {MetreLenghtStrategy} from "../metre-lenght-strategy/metre-lenght-strategy";
import {MetreLenghtWidhtStrategy} from "../metre-lenght-width-strategy/metre-lenght-widht-strategy";
import {MetreLenghtWidthHeightStrategy} from "../metre-lenght-width-height-strategy/metre-lenght-width-height-strategy";
import {MetreService} from "../../_service/metre.service";


export class MetreInputsFactoryInterface {
  constructor(private metreService : MetreService) {
  }
  createStrategy(unite: string): MetreStrategyInterface {
    switch (this.controlUnite(unite)) {
      case 'ml':
        return new MetreLenghtStrategy(this.metreService);
      case 'm2':
        return new MetreLenghtWidhtStrategy(this.metreService);
      case 'm3':
        return new MetreLenghtWidthHeightStrategy(this.metreService);
      default:
        console.log('default?')
        throw new Error(`L'unité de l'ouvrage est inconnu.`);
    }
  }

  controlUnite(unite:string): string{
    return unite.trim().toLowerCase()
  }


}
