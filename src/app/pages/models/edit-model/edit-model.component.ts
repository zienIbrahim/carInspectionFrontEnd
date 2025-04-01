import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslatePipe } from '@ngx-translate/core';
import { MasterData } from 'src/app/core/api-client/models/Common.api.model';
import { Model } from 'src/app/core/api-client/models/model.api.model';
import { CommonApiService } from 'src/app/core/api-client/services/common-api.service';
import { ModelService } from 'src/app/core/api-client/services/model.service';
import { ModelType, modelTypeData } from 'src/app/core/data/modelType';
import { LanguageService } from 'src/app/core/Service/language.service';
import { SweetAlertService } from 'src/app/core/Service/sweet-alert.service';

@Component({
  selector: 'app-edit-model',
  imports: [TranslatePipe, ReactiveFormsModule, CommonModule, NgSelectModule],
  templateUrl: './edit-model.component.html',
  styleUrl: './edit-model.component.scss'
})
export class EditModelComponent {
  modelService = inject(ModelService);
  commonApiService = inject(CommonApiService);
  sweetAlertService = inject(SweetAlertService);
  languageService = inject(LanguageService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  EditModelForm: FormGroup;
  submitted = false;
  makes: MasterData[] = [];
  lang: string = 'ar';
  modelId: number = 0;
  Model: Model = <Model>{};
  modelTypeList: ModelType[] = [];

  constructor(private fb: FormBuilder) {
    this.modelTypeList = modelTypeData

    this.modelId = Number(this.route.snapshot.paramMap.get('id'));
  }
  ngOnInit(): void {
    this.FillCommonData();
    this.languageService.language$.subscribe(lang => this.lang = lang);
    this.InitForm()
    this.GetModelById()
  }
  InitForm() {
    this.EditModelForm = this.fb.group({
      nameAr: ['', Validators.required],
      nameEn: ['', Validators.required],
      makeId: ['', Validators.required],
      type: ['', Validators.required],
      id: ['', Validators.required],

    });
  }
  onSubmit() {
    this.submitted = true;
    if (!this.EditModelForm.valid) {
      this.EditModelForm.markAllAsTouched();
      return
    }
    const model = { id: this.f['id'].value, nameAr: this.f['nameAr'].value, nameEn: this.f['nameEn'].value, makeId: this.f['makeId'].value, modelType: this.f['type'].value }
    this.modelService.EditModel(model).subscribe((res: Model) => {
      this.sweetAlertService.SaveSuccess().then(result => {
        this.EditModelForm.reset();
        this.submitted = false;
        this.router.navigate(['model/'])
      });
    });

  }
  GetModelById() {
    this.modelService.GetModelById(this.modelId).subscribe(res => {
      this.Model = res as Model;
      this.setFormValue();
    });
  }
  setFormValue() {
    this.EditModelForm.patchValue({
      id: this.Model.id,
      nameAr: this.Model.nameAr,
      nameEn: this.Model.nameEn,
      makeId: this.Model.makeId,
      type: this.Model.modelType,
    });
  }
  FillCommonData() {
    this.commonApiService.GetMakeList().subscribe((res: any) => {
      this.makes = res.data;
    });
  }
  get f() {
    return this.EditModelForm.controls;
  }
}


