import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslatePipe } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { MasterData } from 'src/app/core/api-client/models/Common.api.model';
import { Make } from 'src/app/core/api-client/models/make.api.model';
import { Model } from 'src/app/core/api-client/models/model.api.model';
import { CommonApiService } from 'src/app/core/api-client/services/common-api.service';
import { ModelService } from 'src/app/core/api-client/services/model.service';
import { ModelType, modelTypeData } from 'src/app/core/data/modelType';
import { LanguageService } from 'src/app/core/Service/language.service';
import { SweetAlertService } from 'src/app/core/Service/sweet-alert.service';
import { CreateMakeComponent } from '../../makes/create-make/create-make.component';
import { IconDirective } from '@ant-design/icons-angular';

@Component({
  selector: 'app-create-model',
  imports: [TranslatePipe, ReactiveFormsModule,DialogModule,CreateMakeComponent,IconDirective, CommonModule, NgSelectModule],
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
  CreateMakevisible=false;
  makes: MasterData[] = [];
  modelTypeList: ModelType[] = [];
  lang: string = 'ar';
  @Output() OnSave = new EventEmitter<Model>();
  @Output() OnClose = new EventEmitter<boolean>();
  @Input() dialog: boolean = false;
  constructor(private fb: FormBuilder,private cd: ChangeDetectorRef) {
    this.modelTypeList=modelTypeData
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
      type: ['', Validators.required],
    });
  }
  onSubmit() {
      this.submitted = true;
      if (!this.CreateModelForm.valid) {
        this.CreateModelForm.markAllAsTouched();
        return
      }
      const model = { nameAr: this.f['nameAr'].value, nameEn: this.f['nameEn'].value ,makeId:this.f['makeId'].value,modelType:this.f['type'].value}
      this.modelService.CreateModel(model).subscribe((res: Model) => {
        this.sweetAlertService.SaveSuccess().then(result => {
          this.CreateModelForm.reset();
          this.submitted = false;
           if (this.dialog) {
            this.OnSave.emit({
              id: res.id,
              nameAr: res.nameAr,
              nameEn: res.nameEn,
              makeId:res.makeId,
              modelType:res.modelType,
            });
          }
          else{
            this.router.navigate(['model/'])
          }
        });
      });
  
  } 
  FillCommonData() {
    this.commonApiService.GetMakeList().subscribe((res: any) => {
      this.makes = res.data;
   });
  }
  onMakeCreated(event: Make) {
    this.CreateMakevisible = false;
    this.makes.push({
      id: event.id,
      nameAr: event.nameAr,
      nameEn: event.nameEn,
    });
    this.f['makeId'].setValue(event.id)
        this.cd.detectChanges()
  }
  get f() {
      return this.CreateModelForm.controls;
  }
}
