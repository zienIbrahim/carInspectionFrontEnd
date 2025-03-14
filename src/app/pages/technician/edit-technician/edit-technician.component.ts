import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgSelectConfig, NgSelectModule } from '@ng-select/ng-select';
import { TranslatePipe } from '@ngx-translate/core';
import { MasterData } from 'src/app/core/api-client/models/Common.api.model';
import { Technician } from 'src/app/core/api-client/models/Technician.api.model';
import { CommonApiService } from 'src/app/core/api-client/services/common-api.service';
import { TechnicianService } from 'src/app/core/api-client/services/technician.service';
import { LanguageService } from 'src/app/core/Service/language.service';
import { SweetAlertService } from 'src/app/core/Service/sweet-alert.service';

@Component({
  selector: 'app-edit-technician',
  imports: [TranslatePipe, ReactiveFormsModule, CommonModule, NgSelectModule],
  templateUrl: './edit-technician.component.html',
  styleUrl: './edit-technician.component.scss'
})
export class EditTechnicianComponent {
  TechnicianService = inject(TechnicianService);
  sweetAlertService = inject(SweetAlertService);
  commonApiService = inject(CommonApiService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  languageService = inject(LanguageService);
  lang: string = 'ar';
  EditTechnicianForm: FormGroup;
  categories: MasterData[] = [];
  users: MasterData[] = [];
  technician: Technician;
  technicianId: number = 0;
  submitted = false;
  constructor(private fb: FormBuilder, private config: NgSelectConfig) {
    this.technicianId = Number(this.route.snapshot.paramMap.get('id'));
    this.config.notFoundText = 'Custom not found';
    this.config.appendTo = 'body';
  }
  ngOnInit(): void {
    this.languageService.language$.subscribe(lang => {
      this.lang = lang;
    })
    this.InitForm()
    this.getTechnicianById()
    this.FillCommonData()
  }
  InitForm() {
    this.EditTechnicianForm = this.fb.group({
      id: ['', Validators.required],
      nameAr: ['', Validators.required],
      nameEn: ['', Validators.required],
      categoryId: [null, Validators.required],
      userId: [null, Validators.required],
    });
  }
  onSubmit() {
    this.submitted = true;
    if (!this.EditTechnicianForm.valid) {
      this.EditTechnicianForm.markAllAsTouched();
      return
    }
    const model: Technician = {
      id: this.f['id'].value,
      userId: this.f['userId'].value,
      categoryId: this.f['categoryId'].value,
      nameAr: this.f['nameAr'].value,
      nameEn: this.f['nameEn'].value
    }
    this.TechnicianService.EditTechnician(model).subscribe((res: Technician) => {
      this.sweetAlertService.SaveSuccess().then(result => {
        this.EditTechnicianForm.reset();
        this.submitted = false;
        this.router.navigate(['Technician/'])
      });
    });

  }
  FillCommonData() {
    this.commonApiService.GetCategoryList().subscribe((res: any) => {
      this.categories = res.data;
    });
    this.commonApiService.GetUsersList().subscribe((res: any) => {
      this.users = res.data;
    });
  }
  getTechnicianById() {
    this.TechnicianService.GetTechnicianById(this.technicianId).subscribe(res => {
      this.technician = res as Technician;
      console.log({technician:this.technician})
      this.setFormValue();
    });
  }
  setFormValue() {
    this.EditTechnicianForm.patchValue({
      id: this.technician.id,
      nameAr: this.technician.nameAr,
      nameEn: this.technician.nameEn,
      categoryId: this.technician.categoryId,
      userId: this.technician.userId,
    });
  }
  get f() {
    return this.EditTechnicianForm.controls;
  }
}
