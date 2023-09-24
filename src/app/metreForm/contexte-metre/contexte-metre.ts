import {MetreFactory} from "../metre-factory/metre-factory";
import {MetreService} from "../../_service/metre.service";
import {MetreStrategyInterface} from "../metre-strategy-interface/metre-strategy.interface";
import {FormBuilder} from "@angular/forms";



export class MetreContext {
   metreStrategyInterface !: MetreStrategyInterface;

  runStrategy(unite: string, metreService: MetreService) {
    this.metreStrategyInterface = new MetreFactory(metreService).create(unite)
  }
  execute(formBuilder: FormBuilder) {
    this.metreStrategyInterface.createFormBuilder(formBuilder)
  }

}
