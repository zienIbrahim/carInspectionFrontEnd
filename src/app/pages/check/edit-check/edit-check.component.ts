import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgSelectModule, NgSelectConfig } from '@ng-select/ng-select';
import { TranslatePipe } from '@ngx-translate/core';
import { Listbox } from 'primeng/listbox';
import { Check, CheckDetails } from 'src/app/core/api-client/models/Check.api.model';
import { MasterData } from 'src/app/core/api-client/models/Common.api.model';
import { CheckService } from 'src/app/core/api-client/services/check.service';
import { CommonApiService } from 'src/app/core/api-client/services/common-api.service';
import { LanguageService } from 'src/app/core/Service/language.service';
import { SweetAlertService } from 'src/app/core/Service/sweet-alert.service';

@Component({
  selector: 'app-edit-check',
  imports: [TranslatePipe,Listbox,ReactiveFormsModule,CommonModule,NgSelectModule],
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
  ngOnInit(): void {    
    this.FillCommonData();
    this.languageService.language$.subscribe(lang => {
      this.lang = lang;
    });
    this.InitForm()
    this.getCheckById();
  }
  InitForm() {
    this.EditCheckForm = this.fb.group({
      id: ['', Validators.required],
      nameAr: ['', Validators.required],
      nameEn: ['', Validators.required],
      categoryId: ['', Validators.required],
      resultList: [null, Validators.required],

    });
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
      results:this.f['resultList'].value.map((x: any)=>{ return{
        resultId:x
      }})

    }
    this.checkService.EditCheck(model).subscribe((res: Check) => {
      this.sweetAlertService.SaveSuccess().then(result => {
        this.EditCheckForm.reset();
        this.submitted = false;
        this.router.navigate(['check/'])
      });
    });

  }
  FillCommonData() {
    this.commonApiService.GetCategoryList().subscribe((res: any) => {
      this.categories = res.data;
    });
    this.commonApiService.GetResultList().subscribe((res:any)=>{
      this.results=res.data;
    });
  }
  getCheckById() {
    this.checkService.GetCheckById(this.CheckId).subscribe(res => {
      console.log(res)

      this.Check = res as CheckDetails;
      this.setFormValue();

    });
  }
  setFormValue() {
    console.log(this.Check.result)
    this.EditCheckForm.patchValue({
      id: this.Check.id,
      nameAr: this.Check.nameAr,
      nameEn: this.Check.nameEn,
      categoryId: this.Check.categoryId,
      resultList: this.Check.result.map(res=> { return res.id }) 
    });

  }
  get f() {
    return this.EditCheckForm.controls;
  }
}