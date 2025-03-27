import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-edit-result',
  imports: [TranslatePipe,ColorPickerModule, ReactiveFormsModule, CommonModule, NgSelectModule],
  templateUrl: './edit-result.component.html',
  styleUrl: './edit-result.component.scss'
})
export class EditResultComponent {
   EditResultForm: FormGroup;
   submitted = false;
   resultService = inject(ResultService);
   sweetAlertService = inject(SweetAlertService);
   router = inject(Router);
   commonApiService = inject(CommonApiService);
   languageService = inject(LanguageService);
   route = inject(ActivatedRoute);
   lang: string = 'ar';
   checkPoints: MasterData[] = [];
   Result: Result = <Result>{};
   ResultId: number = 0;

   constructor(private fb: FormBuilder) {
     this.ResultId = Number(this.route.snapshot.paramMap.get('id'));
   }
   ngOnInit(): void {
     this.FillCommonData();
     this.languageService.language$.subscribe(lang => {
       this.lang = lang;
     });
     this.InitForm()
     this.getCheckById()
   }
   InitForm() {
     this.EditResultForm = this.fb.group({
       id: ['', Validators.required],
       nameAr: ['', Validators.required],
       nameEn: ['', Validators.required],
       description: ['', Validators.required],
       color: ['', Validators.required],
 
     });
   }
   onSubmit() {
     this.submitted = true;
     if (!this.EditResultForm.valid) {
       this.EditResultForm.markAllAsTouched();
       return
     }
     const model: Result = {
       id: this.f['id'].value,
       nameAr: this.f['nameAr'].value,
       nameEn: this.f['nameEn'].value,
       description: this.f['description'].value,
       color: this.f['color'].value,
     }
     this.resultService.EditResult(model).subscribe((res: Result) => {
       this.sweetAlertService.SaveSuccess().then(result => {
         this.EditResultForm.reset();
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
   getCheckById() {
     this.resultService.GetResultById(this.ResultId).subscribe(res => {
       this.Result = res as Result;
       this.setFormValue();
    
     });
   }
   setFormValue() {
     this.EditResultForm.patchValue({
       id: this.Result.id,
       nameAr: this.Result.nameAr,
       nameEn: this.Result.nameEn,
       description: this.Result.description,
       color: this.Result.color,
     });
   }
   get f() {
     return this.EditResultForm.controls;
   }
  }
