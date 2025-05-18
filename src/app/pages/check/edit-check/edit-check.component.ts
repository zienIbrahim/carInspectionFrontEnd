import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgSelectModule, NgSelectConfig } from '@ng-select/ng-select';
import { TranslatePipe } from '@ngx-translate/core';
import { Listbox } from 'primeng/listbox';
import { TableModule } from 'primeng/table';
import { lastValueFrom } from 'rxjs';
import { Check, CheckDetails } from 'src/app/core/api-client/models/Check.api.model';
import { MasterData } from 'src/app/core/api-client/models/Common.api.model';
import { CheckService } from 'src/app/core/api-client/services/check.service';
import { CommonApiService } from 'src/app/core/api-client/services/common-api.service';
import { LanguageService } from 'src/app/core/Service/language.service';
import { SweetAlertService } from 'src/app/core/Service/sweet-alert.service';

@Component({
  selector: 'app-edit-check',
  imports: [TranslatePipe,TableModule,ReactiveFormsModule,CommonModule,NgSelectModule],
  templateUrl: './edit-check.component.html',
  styleUrl: './edit-check.component.scss'
})
export class EditCheckComponent implements OnInit {
  checkService = inject(CheckService);
  sweetAlertService = inject(SweetAlertService);
  commonApiService = inject(CommonApiService);
  router = inject(Router);
  route  = inject(ActivatedRoute);
  languageService = inject(LanguageService);
  lang: string = 'ar';
  EditCheckForm: FormGroup;
  categories: MasterData[] = [];
  results:MasterData[]=[];
  CheckId: number = 0;
  Check: CheckDetails = <CheckDetails>{};
  submitted = false;
  constructor(private fb: FormBuilder, private config: NgSelectConfig) {
    this.CheckId=Number(this.route.snapshot.paramMap.get('id'));
    this.config.notFoundText = 'Custom not found';
    this.config.appendTo = 'body';
  }
  async ngOnInit(): Promise<void> {
    this.InitForm();
    this.languageService.language$.subscribe(lang => {
      this.lang = lang;
    });
    await this.FillCommonData();
    this.fillResultList();
    this.getCheckById();
  }
  InitForm(){
     this.EditCheckForm = this.fb.group({
       id: ['', Validators.required],
       nameAr: ['', Validators.required],
       nameEn: ['', Validators.required],
       categoryId: [null, Validators.required],
       resultList: this.fb.array([])
     });
  }
  addResult() {
     const control = this.EditCheckForm.get('resultList') as FormArray;
     control.push(this.fb.group({
       resultId: [null, Validators.required],
       rate: [null, Validators.required],
     }));
  }
  onSubmit() {
    this.submitted = true;
    if (!this.EditCheckForm.valid) {
      this.EditCheckForm.markAllAsTouched();
      return
    }
    const model: Check = {
      id: this.f['id'].value,
      categoryId: this.f['categoryId'].value,
      nameAr: this.f['nameAr'].value,
      nameEn: this.f['nameEn'].value,
      results: this.resultList.controls.map((control: any) => {
        const item = control.getRawValue();
        if (!item.check) return null;
        return {
          resultId: item.resultId,
          rate: item.rate
        }
      }).filter((x: any) => x !== null)
    }
    this.checkService.EditCheck(model).subscribe((res: Check) => {
      this.sweetAlertService.SaveSuccess().then(result => {
        this.EditCheckForm.reset();
        this.submitted = false;
        this.router.navigate(['check/'])
      });
    });
  }
  async FillCommonData(){
     this.categories = (await lastValueFrom(this.commonApiService.GetCategoryList()) as any).data;
     this.results = (await lastValueFrom(this.commonApiService.GetResultList()) as any).data;
  }
  fillResultList() {
     const control = this.EditCheckForm.get('resultList') as FormArray;
     control.clear();
     this.results.forEach((result) => {
       control.push(this.fb.group({
         resultId: [{ value: result.id, disabled: true }, Validators.required],
         rate: [null],
         check: [false, Validators.required]
       }));
     });
  }
  getCheckById() {
    this.checkService.GetCheckById(this.CheckId).subscribe(res => {
      this.Check = res as CheckDetails;
      this.setFormValue();
    });
  }
  setFormValue() {
    this.EditCheckForm.patchValue({
      id: this.Check.id,
      nameAr: this.Check.nameAr,
      nameEn: this.Check.nameEn,
      categoryId: this.Check.categoryId,
    });
    this.Check.result.forEach((result) => {
      this.resultList.controls.forEach(control => {
        if (control.get('resultId')?.value == result.id) {
          control.get('check')?.setValue(true);
          control.get('rate')?.setValue(result.rate);
          control.get('rate')?.setValidators(Validators.required);
          control.get('rate')?.updateValueAndValidity();
        }
      });
    });
  }
  onCheckChange(e: any, index: number) {
    const control = this.EditCheckForm.get('resultList') as FormArray;
    control.at(index).get('rate')?.setValidators(e.target.checked ? Validators.required : null);
    control.at(index).get('rate')?.updateValueAndValidity();
    control.at(index).get('rate')?.setValue(e.target.checked ? control.at(index).get('rate')?.value : null);
  }
  get f() {
    return this.EditCheckForm.controls;
  }
  get resultList() {
    return this.EditCheckForm.get('resultList') as FormArray;
  }
}