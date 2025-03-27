import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslatePipe } from '@ngx-translate/core';
import { MasterData } from 'src/app/core/api-client/models/Common.api.model';
import { Model } from 'src/app/core/api-client/models/model.api.model';
import { CommonApiService } from 'src/app/core/api-client/services/common-api.service';
import { ModelService } from 'src/app/core/api-client/services/model.service';
import { LanguageService } from 'src/app/core/Service/language.service';
import { SweetAlertService } from 'src/app/core/Service/sweet-alert.service';

@Component({
  selector: 'app-create-model',
  imports: [TranslatePipe, ReactiveFormsModule, CommonModule, NgSelectModule],
  templateUrl: './create-model.component.html',
  styleUrl: './create-model.component.scss'
})
export class CreateModelComponent {
  modelService = inject(ModelService);
  commonApiService = inject(CommonApiService);
  sweetAlertService = inject(SweetAlertService);
  languageService = inject(LanguageService);
  
  router = inject(Router);
  CreateModelForm: FormGroup;
  submitted = false;
  makes: MasterData[] = [];
  lang: string = 'ar';
  constructor(private fb: FormBuilder) {
  }
  ngOnInit(): void {
    this.FillCommonData();
    this.languageService.language$.subscribe(lang => {
      this.lang = lang;
    });
    this.InitForm()
  }
  InitForm() {
    this.CreateModelForm = this.fb.group({
      nameAr: ['', Validators.required],
      nameEn: ['', Validators.required],
      makeId: ['', Validators.required],
    });
  }
  onSubmit() {
      this.submitted = true;
      if (!this.CreateModelForm.valid) {
        this.CreateModelForm.markAllAsTouched();
        return
      }
      const model = { nameAr: this.f['nameAr'].value, nameEn: this.f['nameEn'].value ,makeId:this.f['makeId'].value}
      this.modelService.CreateModel(model).subscribe((res: Model) => {
        this.sweetAlertService.SaveSuccess().then(result => {
          this.CreateModelForm.reset();
          this.submitted = false;
          this.router.navigate(['model/'])
        });
      });
  
  } 
  FillCommonData() {
    this.commonApiService.GetMakeList().subscribe((res: any) => {
      this.makes = res.data;
   });
  }
  get f() {
      return this.CreateModelForm.controls;
  }
}
