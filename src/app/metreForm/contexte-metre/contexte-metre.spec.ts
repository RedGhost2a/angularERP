import {TestBed} from '@angular/core/testing';
import {MetreContext} from './contexte-metre';
import {MetreService} from "../../_service/metre.service";
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {HttpClient, HttpHandler} from "@angular/common/http";
import {of} from "rxjs";
import {Metre} from "../../_models/metre";

describe('MetreInputsStategyFactoryComponent', () => {
  let metreService: MetreService
  let formBuilder: FormBuilder
  let metreContexte: MetreContext
  let metre: Metre [];


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [MetreService, FormBuilder, HttpClient, HttpHandler],
    })
      .compileComponents();
    metreService = TestBed.inject(MetreService);
    formBuilder = TestBed.inject(FormBuilder);
    metreContexte = new MetreContext();

  });

  function setValue(metre: Metre []) {
    const metres = metreContexte.metreStrategyInterface.formGroup.get('metres') as FormArray
    for (let i = 0; i < metre.length; i++) {
      metreContexte.metreStrategyInterface.setValueInForm(i, metre[i])
      if (i < metre.length - 1) {
        metres.push(metreContexte.metreStrategyInterface.dynamicInputs(formBuilder))
      }
    }
  }

  fit('should create a successful strategy "M2 " and verify formGroup controls', () => {
    metreContexte.runStrategy("M2 " , metreService)
    metreContexte.execute(formBuilder)
    let formArray = metreContexte.metreStrategyInterface.formGroup.get('metres') as FormArray
    for (const formArrayKey in formArray.controls) {
      expect(formArray.controls[formArrayKey]
        .get('longueur')).toBeDefined()
      expect(formArray.controls[formArrayKey]
        .get('largueur')).toBeDefined()
      expect(formArray.controls[formArrayKey]
        .get('hauteur')).toBeNull()
      expect(formArray.controls[formArrayKey]
        .get('metreId')).toBeDefined()
    }
  })


  fit('should create a successful strategy M2 and and retrieve it assign retrieved values', () => {
    metre = [
      {
        id: 1,
        longueur: 1,
        largeur: 1,
        OuvrageDuDeviId: 1
      },
      {
        id: 2,
        longueur: 2,
        largeur: 2,
        OuvrageDuDeviId: 1
      },
      {
        id: 3,
        longueur: 3,
        largeur: 3,
        OuvrageDuDeviId: 1
      }
    ]
    spyOn(metreService, 'getMetreByOuvrage').and.returnValue(of(metre));
    metreContexte.runStrategy("M2", metreService)
    metreContexte.execute(formBuilder)
    setValue(metre)
    let formArray = metreContexte.metreStrategyInterface.formGroup.get('metres') as FormArray
    for (let i = 0; i < formArray.length; i++) {
      expect(formArray.controls[i].get('longueur')?.value).toEqual(metre[i].longueur);
      expect(formArray.controls[i].get('largeur')?.value).toEqual(metre[i].largeur);
      expect(formArray.controls[i].get('metreId')?.value).toEqual(metre[i].id);
    }
  })


  fit('should create a successful strategy M2 and add new formGroup in formBuilder', () => {
    metreContexte.runStrategy("M2", metreService)
    metreContexte.execute(formBuilder)
    let formArray = metreContexte.metreStrategyInterface.formGroup.get('metres') as FormArray
    expect(formArray.length).toEqual(1)
    const metres = metreContexte.metreStrategyInterface.formGroup.get('metres') as FormArray
    metres.push(metreContexte.metreStrategyInterface.dynamicInputs(formBuilder))
    expect(formArray.length).toEqual(2)
  })

  fit('should create a successful strategy M2 and delete formGroup in formBuilder', () => {
    metreContexte.runStrategy("M2", metreService)
    metreContexte.execute(formBuilder)
    let formArray = metreContexte.metreStrategyInterface.formGroup.get('metres') as FormArray
    formArray.push(metreContexte.metreStrategyInterface.dynamicInputs(formBuilder))
    expect(formArray.length).toEqual(2)
    console.log(metreContexte.metreStrategyInterface.formGroup)
    metreService.deleteFormGroup(formArray, 1)
    expect(formArray.length).toEqual(1)
  })


})
;

