import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectConfig, NgSelectModule } from '@ng-select/ng-select';
import { TranslatePipe } from '@ngx-translate/core';
import { Listbox } from 'primeng/listbox';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { lastValueFrom } from 'rxjs';
import { Check, CreateCheckRequest } from 'src/app/core/api-client/models/Check.api.model';
import { MasterData } from 'src/app/core/api-client/models/Common.api.model';
import { CheckService } from 'src/app/core/api-client/services/check.service';
import { CommonApiService } from 'src/app/core/api-client/services/common-api.service';
import { LanguageService } from 'src/app/core/Service/language.service';
import { SweetAlertService } from 'src/app/core/Service/sweet-alert.service';

@Component({
  selector: 'app-create-check',
  imports: [TranslatePipe,TableModule,ReactiveFormsModule,CommonModule,NgSelectModule],
  templateUrl: './create-check.component.html',
  styleUrl: './create-check.component.scss'
})
export class CreateCheckComponent implements OnInit { 
  checkService = inject(CheckService);
  sweetAlertService = inject(SweetAlertService);
  commonApiService = inject(CommonApiService);
  router = inject(Router);
  languageService = inject(LanguageService);
  lang: string = 'ar';
  CreateCheckForm: FormGroup;
  categories: MasterData[] = [];
  results: MasterData[] = [];
  submitted = false;
  constructor(private fb: FormBuilder,private config: NgSelectConfig) {
    this.config.notFoundText = 'Custom not found';
    this.config.appendTo = 'body';
  }
  async ngOnInit(): Promise<void> {
    this.InitForm()
    this.languageService.language$.subscribe(lang=>{
      this.lang=lang;
    })
    await this.FillCommonData()
    this.fillResultList();
  }
  InitForm(){
    this.CreateCheckForm = this.fb.group({
      nameAr: ['', Validators.required],
      nameEn: ['', Validators.required],
      categoryId: [null, Validators.required],
      resultList: this.fb.array([])
    });
    
  }
  onSubmit(){
    this.submitted=true;
    if (!this.CreateCheckForm.valid) {
      this.CreateCheckForm.markAllAsTouched();
      return 
    }
    console.log(this.CreateCheckForm.value);
    const formData = this.CreateCheckForm.value;
    const model:CreateCheckRequest = {
      categoryId:  this.f['categoryId'].value,
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
    this.checkService.CreateCheck(model).subscribe((res: Check) => {
      this.sweetAlertService.SaveSuccess().then(result => {
        this.CreateCheckForm.reset();
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
    const control = this.CreateCheckForm.get('resultList') as FormArray;
    control.clear();
    this.results.forEach((result) => {
      control.push(this.fb.group({
        resultId: [{ value: result.id, disabled: true }, Validators.required],
        rate: [null],
        check: [false, Validators.required]
      }));
    });
  }
  onCheckChange(e: any, index: number) {
    const control = this.CreateCheckForm.get('resultList') as FormArray;
    control.at(index).get('rate')?.setValidators(e.target.checked ? Validators.required : null);
    control.at(index).get('rate')?.updateValueAndValidity();
    control.at(index).get('rate')?.setValue(e.target.checked ? control.at(index).get('rate')?.value : null);
  }
  get f() {
    return this.CreateCheckForm.controls;
  } 
  get resultList() {
    return this.CreateCheckForm.get('resultList') as FormArray;
  }
}