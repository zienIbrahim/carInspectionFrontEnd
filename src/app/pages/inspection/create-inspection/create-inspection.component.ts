import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDatepickerModule, NgbTimepickerModule, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslatePipe } from '@ngx-translate/core';
import { MasterData, ModelListData } from 'src/app/core/api-client/models/Common.api.model';
import { CreateInspectionRequest, Inspection } from 'src/app/core/api-client/models/Inspection.api.model';
import { CommonApiService } from 'src/app/core/api-client/services/common-api.service';
import { InspectionService } from 'src/app/core/api-client/services/inspection.service';
import { LanguageService } from 'src/app/core/Service/language.service';
import { SweetAlertService } from 'src/app/core/Service/sweet-alert.service';
import { SuadiPalteImageComponent } from 'src/app/core/components/suadi-palte-image/suadi-palte-image.component';

@Component({
  selector: 'app-create-inspection',
  imports: [TranslatePipe,
    ReactiveFormsModule,
    CommonModule,
    NgSelectModule,
    FormsModule,
    SuadiPalteImageComponent,
    NgbTimepickerModule,
    NgbDatepickerModule],
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
  models: ModelListData[] = [];
  makes: MasterData[] = [];
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
      letters: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]{1,3}$/)]],
      numbers: ['', [Validators.required, Validators.pattern(/^[0-9]{1,4}$/)]],
      vINNumber: ['', Validators.required],
      makeId: ['', Validators.required],
      modelId: ['', Validators.required],
      color: ['', Validators.required],
      year: ['', Validators.required],
      name: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: [''],
      note: [''],
    });

  } 
  toArLetters(english: string): string {
    const map: { [key: string]: string } = {
      'A': 'ا', 'B': 'ب', 'J': 'ح', 'D': 'د', 'R': 'ر',
      'S': 'س', 'X': 'ص', 'T': 'ط', 'E': 'ع', 'G': 'ق',
      'K': 'ك', 'L': 'ل', 'Z': 'م', 'N': 'ن', 'H': 'هـ',
      'U': 'و', 'V': 'ى'
    };
    return english.toUpperCase().split('').map(ch => map[ch] || ch).join(' ');
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
      plateNumber: fromData.letters + '-' + fromData.numbers,
      makeId: fromData.makeId,
      modelId: fromData.modelId,
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
  get getModels(){
    return this.models.filter(x=>x.makeId== this.f['makeId'].value)
  }
  FillCommonData() {
    this.commonApiService.GetPackageList().subscribe((res: any) => {
      this.packages = res.data;
    });
    this.commonApiService.GetModelList().subscribe((res: any) => {
      this.models = res.data;
    });
    this.commonApiService.GetMakeList().subscribe((res: any) => {
      this.makes = res.data;
    });
  }
  changeMake(){
    this.f['modelId'].setValue("")
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
