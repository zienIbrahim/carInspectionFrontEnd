import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectConfig, NgSelectModule } from '@ng-select/ng-select';
import { TranslatePipe } from '@ngx-translate/core';
import { MasterData } from 'src/app/core/api-client/models/Common.api.model';
import { CreateTechnicianRequest, Technician } from 'src/app/core/api-client/models/Technician.api.model';
import { CommonApiService } from 'src/app/core/api-client/services/common-api.service';
import { TechnicianService } from 'src/app/core/api-client/services/technician.service';
import { LanguageService } from 'src/app/core/Service/language.service';
import { SweetAlertService } from 'src/app/core/Service/sweet-alert.service';

@Component({
  selector: 'app-create-technician',
  imports: [TranslatePipe,ReactiveFormsModule,CommonModule,NgSelectModule],
  templateUrl: './create-technician.component.html',
  styleUrl: './create-technician.component.scss'
})
export class CreateTechnicianComponent {
 TechnicianService = inject(TechnicianService);
  sweetAlertService = inject(SweetAlertService);
  commonApiService = inject(CommonApiService);
  router = inject(Router);
  languageService = inject(LanguageService);
  lang: string='ar';
  CreateTechnicianForm: FormGroup;  
  categories:MasterData[]=[];
  users:MasterData[]=[];
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
    this.CreateTechnicianForm = this.fb.group({
      nameAr: ['', Validators.required],
      nameEn: ['', Validators.required],
      categoryId: [0, Validators.required],
      userId: [0, Validators.required],
    });
  }
  onSubmit(){
    this.submitted=true;
    if (!this.CreateTechnicianForm.valid) {
      this.CreateTechnicianForm.markAllAsTouched();
      return 
    }    
    const model:CreateTechnicianRequest = {
       userId:this.f['userId'].value,
       categoryId:  this.f['categoryId'].value,
       nameAr: this.f['nameAr'].value,
       nameEn: this.f['nameEn'].value
      }
    this.TechnicianService.CreateTechnician(model).subscribe((res: Technician) => {
      this.sweetAlertService.SaveSuccess().then(result => {
        this.CreateTechnicianForm.reset();
        this.submitted = false;
        this.router.navigate(['Technician/'])
      });
    });

  }
  FillCommonData(){
    this.commonApiService.GetCategoryList().subscribe((res:any)=>{
      this.categories=res.data;
    });
    this.commonApiService.GetUsersList().subscribe((res:any)=>{
      this.users=res.data;
    });
  }
  get f() {
    return this.CreateTechnicianForm.controls;
  }
}
