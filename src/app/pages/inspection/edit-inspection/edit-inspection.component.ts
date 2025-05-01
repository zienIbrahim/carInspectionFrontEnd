import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTimepickerModule, NgbDatepickerModule, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslatePipe } from '@ngx-translate/core';
import { MasterData, ModelListData } from 'src/app/core/api-client/models/Common.api.model';
import { EditInspectionRequest, Inspection, InspectionById } from 'src/app/core/api-client/models/Inspection.api.model';
import { CommonApiService } from 'src/app/core/api-client/services/common-api.service';
import { InspectionService } from 'src/app/core/api-client/services/inspection.service';
import { LanguageService } from 'src/app/core/Service/language.service';
import { SweetAlertService } from 'src/app/core/Service/sweet-alert.service';

@Component({
  selector: 'app-edit-inspection',
  imports: [TranslatePipe,
      ReactiveFormsModule,
      CommonModule,
      NgSelectModule,
      FormsModule,
      NgbTimepickerModule,
      NgbDatepickerModule],
  templateUrl: './edit-inspection.component.html',
  styleUrl: './edit-inspection.component.scss'
})
export class EditInspectionComponent {
EditInspectionForm: FormGroup;
  submitted = false;
  inspectionService = inject(InspectionService);
  sweetAlertService = inject(SweetAlertService);
  router = inject(Router);
  route  = inject(ActivatedRoute);
    commonApiService = inject(CommonApiService);
  languageService = inject(LanguageService);
  lang: string = 'ar';
  time: NgbTimeStruct = { hour: 0, minute: 0, second: 0 };
  packages: MasterData[] = [];
  models: ModelListData[] = [];
  makes: MasterData[] = [];
  InspectionID: number;
  InspectionById: InspectionById;
  constructor(private fb: FormBuilder) {
    this.InspectionID=Number(this.route.snapshot.paramMap.get('id'));
    this.languageService.language$.subscribe(lang => {
      this.lang = lang;
    })
  }
    ngOnInit(): void {
      this.InitForm()
      this.FillCommonData();
      this.GetInspectionDetailsById()
    }
    InitForm() {
      this.EditInspectionForm = this.fb.group({
        id: [0],
        packageId: ['', Validators.required],
        letters: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]{1,3}$/)]],
        numbers: ['', [Validators.required, Validators.pattern(/^[0-9]{1,4}$/)]],
        vINNumber: ['', Validators.required],
        odometer: ['', Validators.required],
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
    GetInspectionDetailsById() {
        this.inspectionService.GetInspectionById(this.InspectionID).subscribe(res => {
          this.InspectionById = res as InspectionById;
          this.EditInspectionForm.patchValue({
            id: this.InspectionById.id, 
            packageId: this.InspectionById.packageId,
            letters: this.InspectionById.plateNumber.split('-')[0],
            numbers: this.InspectionById.plateNumber.split('-')[1],
            vINNumber: this.InspectionById.vinNumber,
            makeId: this.InspectionById.makeId,
            modelId: this.InspectionById.modelId,
            color: this.InspectionById.color,
            year: this.InspectionById.year,
            name: this.InspectionById.name,
            phoneNumber: this.InspectionById.phoneNumber,
            email: this.InspectionById.email,
            note: this.InspectionById.note,
            odometer: this.InspectionById.odometer,

          })
        });
    }
    onSubmit() {
      this.submitted = true;
      if (!this.EditInspectionForm.valid) {
        this.EditInspectionForm.markAllAsTouched();
        return
      }
      const fromData = this.EditInspectionForm.value;
      const model: EditInspectionRequest = {
        id: fromData.id, 
        packageId: fromData.packageId,
        vINNumber: fromData.vINNumber,
        plateNumber: fromData.letters + '-' + fromData.numbers,
        makeId: fromData.makeId,
        modelId: fromData.modelId,
        color: fromData.color,
        year: fromData.year,
        odometer: fromData.odometer,
        name: fromData.name,
        phoneNumber: fromData.phoneNumber,
        email: fromData.email,
        note: fromData.note,
      };
      this.inspectionService.EditInspection(model).subscribe((res: Inspection) => {
        this.sweetAlertService.SaveSuccess().then(result => {
          this.EditInspectionForm.reset();
          this.submitted = false;
          this.router.navigate(['inspection/'])
        });
      });
    }
    get f() {
      return this.EditInspectionForm.controls;
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
