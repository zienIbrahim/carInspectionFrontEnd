import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectConfig, NgSelectModule } from '@ng-select/ng-select';
import { TranslatePipe } from '@ngx-translate/core';
import { Check, CreateCheckRequest } from 'src/app/core/api-client/models/Check.api.model';
import { MasterData } from 'src/app/core/api-client/models/Common.api.model';
import { CheckService } from 'src/app/core/api-client/services/check.service';
import { CommonApiService } from 'src/app/core/api-client/services/common-api.service';
import { LanguageService } from 'src/app/core/Service/language.service';
import { SweetAlertService } from 'src/app/core/Service/sweet-alert.service';

@Component({
  selector: 'app-create-check',
  imports: [TranslatePipe,ReactiveFormsModule,CommonModule,NgSelectModule],
  templateUrl: './create-check.component.html',
  styleUrl: './create-check.component.scss'
})
export class CreateCheckComponent implements OnInit { 
  checkService = inject(CheckService);
  sweetAlertService = inject(SweetAlertService);
  commonApiService = inject(CommonApiService);
  router = inject(Router);
  languageService = inject(LanguageService);
  lang: string='ar';
  CreateCheckForm: FormGroup;  
  categories:MasterData[]=[];
  submitted = false;
  constructor(private fb: FormBuilder,private config: NgSelectConfig) {
    this.config.notFoundText = 'Custom not found';
      this.config.appendTo = 'body';
  }
  ngOnInit(): void {
    this.languageService.language$.subscribe(lang=>{
      this.lang=lang;
    })
    this.InitForm()
    this.FillCommonData()
  }
  InitForm(){
    this.CreateCheckForm = this.fb.group({
      nameAr: ['', Validators.required],
      nameEn: ['', Validators.required],
      categoryId: [0, Validators.required],
    });
  }
  onSubmit(){
    this.submitted=true;
    if (!this.CreateCheckForm.valid) {
      this.CreateCheckForm.markAllAsTouched();
      return 
    }    
    const model:CreateCheckRequest = {categoryId:  this.f['categoryId'].value,nameAr: this.f['nameAr'].value, nameEn: this.f['nameEn'].value }
   this.checkService.CreateCheck(model).subscribe((res: Check) => {
      this.sweetAlertService.SaveSuccess().then(result => {
        this.CreateCheckForm.reset();
        this.submitted = false;
        this.router.navigate(['check/'])
      });
    });

  }
  FillCommonData(){
    this.commonApiService.GetCategoryList().subscribe((res:any)=>{
      this.categories=res.data;
    });
  }
  get f() {
    return this.CreateCheckForm.controls;
  }
  
}