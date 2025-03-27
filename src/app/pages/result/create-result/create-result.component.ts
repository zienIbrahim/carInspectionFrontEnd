import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslatePipe } from '@ngx-translate/core';
import { ColorPickerModule } from 'primeng/colorpicker';
import { MasterData } from 'src/app/core/api-client/models/Common.api.model';
import { CreateResultRequest, Result } from 'src/app/core/api-client/models/result.api.model';
import { CommonApiService } from 'src/app/core/api-client/services/common-api.service';
import { ResultService } from 'src/app/core/api-client/services/result.service';
import { LanguageService } from 'src/app/core/Service/language.service';
import { SweetAlertService } from 'src/app/core/Service/sweet-alert.service';

@Component({
  selector: 'app-create-result',
  imports: [TranslatePipe,ColorPickerModule, ReactiveFormsModule, CommonModule, NgSelectModule],
  templateUrl: './create-result.component.html',
  styleUrl: './create-result.component.scss'
})
export class CreateResultComponent {
 CreateResultForm: FormGroup;
  submitted = false;
  resultService = inject(ResultService);
  sweetAlertService = inject(SweetAlertService);
  router = inject(Router);
  commonApiService = inject(CommonApiService);
  languageService = inject(LanguageService);
  lang: string = 'ar';
  checkPoints: MasterData[] = [];
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
    this.CreateResultForm = this.fb.group({
      nameAr: ['', Validators.required],
      description: ['', Validators.required],
      nameEn: ['', Validators.required],
      color: ['', Validators.required],
    });
  }
  onSubmit() {
    console.log({FormValue:this.CreateResultForm.value})
    this.submitted = true;
    if (!this.CreateResultForm.valid) {
      this.CreateResultForm.markAllAsTouched();
      return
    }
    const model: CreateResultRequest = {
      nameAr: this.f['nameAr'].value,
      nameEn: this.f['nameEn'].value,
      description: this.f['description'].value,
      color:this.f['color'].value,
    }
    this.resultService.CreateResult(model).subscribe((res: Result) => {
      this.sweetAlertService.SaveSuccess().then(result => {
        this.CreateResultForm.reset();
        this.submitted = false;
        this.router.navigate(['result/'])
      });
    });
  }
  FillCommonData() {
    this.commonApiService.GetCheckPointList().subscribe((res: any) => {
      this.checkPoints = res.data;
    });
  }
  get f() {
    return this.CreateResultForm.controls;
  }
}
