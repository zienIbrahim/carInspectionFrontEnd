import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IconDirective, IconService } from '@ant-design/icons-angular';
import { CalendarOutline } from '@ant-design/icons-angular/icons';
import { NgbDatepickerModule, NgbDateStruct, NgbTimepickerModule, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslatePipe } from '@ngx-translate/core';
import { MasterData } from 'src/app/core/api-client/models/Common.api.model';
import { CreateInspectionRequest, Inspection } from 'src/app/core/api-client/models/Inspection.api.model';
import { CreatePackageRequest } from 'src/app/core/api-client/models/Package.api.model';
import { CommonApiService } from 'src/app/core/api-client/services/common-api.service';
import { InspectionService } from 'src/app/core/api-client/services/inspection.service';
import { DateTimePickerComponent } from 'src/app/core/components/date-time-picker/date-time-picker.component';
import { LanguageService } from 'src/app/core/Service/language.service';
import { SweetAlertService } from 'src/app/core/Service/sweet-alert.service';

@Component({
  selector: 'app-create-inspection',
  imports: [TranslatePipe,
    ReactiveFormsModule,
    CommonModule,
    NgSelectModule,
    FormsModule,
    NgbTimepickerModule,
    NgbDatepickerModule,DateTimePickerComponent,
    ],
  templateUrl: './create-inspection.component.html',
  styleUrl: './create-inspection.component.scss'
})
export class CreateInspectionComponent implements OnInit {
  CreateInspectionForm: FormGroup;
  submitted = false;
  inspectionService = inject(InspectionService);
  sweetAlertService = inject(SweetAlertService);
  router = inject(Router);
  commonApiService = inject(CommonApiService);
  languageService = inject(LanguageService);
  lang: string = 'ar';
	time: NgbTimeStruct = { hour: 0, minute: 0, second: 0 };
  packages: MasterData[] = [];
  constructor(private fb: FormBuilder) {
    this.languageService.language$.subscribe(lang => {
      this.lang = lang;
    })
  }

  ngOnInit(): void {
    this.InitForm()
    this.FillCommonData()
  }
  InitForm() {
    this.CreateInspectionForm = this.fb.group({
      packageId: ['', Validators.required],
      inspectionDate: ['', Validators.required],
      plateNumber: ['', Validators.required],
      vINNumber: ['', Validators.required],
      make: ['', Validators.required],
      model: ['', Validators.required],
      color: ['', Validators.required],
      year: ['', Validators.required],
      name: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: [''],
      note: [''],
    });

  }
  onSubmit() {
    this.submitted = true;
    if (!this.CreateInspectionForm.valid) {
      this.CreateInspectionForm.markAllAsTouched();
      return
    }
    const fromData = this.CreateInspectionForm.value;
    const model: CreateInspectionRequest = {
      packageId: fromData.packageId,
      vINNumber: fromData.vINNumber,
      inspectionDate: fromData.inspectionDate,
      plateNumber: fromData.plateNumber,
      make: fromData.make,
      model: fromData.model,
      color: fromData.color,
      year: fromData.year,
      name: fromData.name,
      phoneNumber: fromData.phoneNumber,
      email: fromData.email,
      note: fromData.note,
    };
    this.inspectionService.CreateInspection(model).subscribe((res: Inspection) => {
      this.sweetAlertService.SaveSuccess().then(result => {
        this.CreateInspectionForm.reset();
        this.submitted = false;
        this.router.navigate(['inspection/'])
      });
    });
  }
  get f() {
    return this.CreateInspectionForm.controls;
  }
  FillCommonData() {
    this.commonApiService.GetPackageList().subscribe((res: any) => {
      this.packages = res.data;
    });
  }
formatDate(data: any) {
    if (data.month.toString().length < 2) {
        data.month = '0' + data.month;
    }
    if (data.day.toString().length < 2) {
        data.day = '0' + data.day;
    }
    return [data.year, data.month, data.day].join('-');
}
formatDateTime(date:any){
 let dd= this.formatDate(date);
 return   dd +" " +[
   String(this.time.hour).padStart(2, '0') ,
   String(this.time.minute).padStart(2, '0'),
   String(this.time.second).padStart(2, '0') 
  ].join(':')
}
}
