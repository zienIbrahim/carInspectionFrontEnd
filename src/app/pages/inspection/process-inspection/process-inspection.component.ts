import { Component, inject, OnInit } from '@angular/core';
import { Stepper, StepperModule } from 'primeng/stepper';
import { InputTextModule } from 'primeng/inputtext';
import { Subject } from 'rxjs';
import {CdkStepperModule} from '@angular/cdk/stepper';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StepperComponent } from 'src/app/core/components/stepper/stepper.component';
import { InspectionService } from 'src/app/core/api-client/services/inspection.service';
import { CreateOrUpdateInspectionResultDto, Inspection, InspectionCheckList } from 'src/app/core/api-client/models/Inspection.api.model';
import { LanguageService } from 'src/app/core/Service/language.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslatePipe } from '@ngx-translate/core';
import { resultList, resultListData } from 'src/app/core/model/model';
import { Dialog } from 'primeng/dialog';
import {WebcamImage, WebcamModule, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlertService } from 'src/app/core/Service/sweet-alert.service';
import { IconDirective } from '@ant-design/icons-angular';

@Component({
  selector: 'app-process-inspection',
  imports: [    
    CommonModule,
    NgSelectModule,
    TranslatePipe,
    ReactiveFormsModule,
    StepperModule,
    WebcamModule,
    ButtonModule,
    IconDirective,
    Dialog,
    StepperComponent,
    InputTextModule,
    CdkStepperModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './process-inspection.component.html',
  providers: [Stepper] ,
  styleUrl: './process-inspection.component.scss'
})
export class ProcessInspectionComponent implements OnInit{
  languageService = inject(LanguageService);
  inspectionService = inject(InspectionService);
  sweetAlertService = inject(SweetAlertService);
  router = inject(Router);
  route  = inject(ActivatedRoute);
  checklists:InspectionCheckList[] = [];
  resultOptions:resultList[] = [];
  lang: string = 'ar';
  ProcessInspectionForm: FormGroup;
  public InspectionResultListForm: FormArray;
  trigger: Subject<void> = new Subject<void>();
  selectedIndex=-1;
  inspectionID=0;
  submitted = false;
  showWebcam=false;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  constructor(private fb: FormBuilder) {
    this.resultOptions=resultListData
    this.languageService.language$.subscribe(lang => {
      this.lang = lang;
    })
  }
  InitForm() {
      this.ProcessInspectionForm = this.fb.group({
        inspectionID: ['', Validators.required],
        inspectionResult:this.fb.array([])
      });
      this.InspectionResultListForm=this.inspectionResultList
  }
  takePicture() {
    this.trigger.next();
  }
  handleImage(image: WebcamImage) {
    this.addImage(this.selectedIndex,image.imageAsDataUrl)
    this.showWebcam=false;
  }
  ngOnInit(): void {
    this.InitForm()
    this.inspectionID=Number(this.route.snapshot.paramMap.get('id'));
    this.inspectionService.GetInspectionCheckListById(this.inspectionID).subscribe((res:any)=>{
      this.checklists = res.data;
      this.f['inspectionID'].setValue( this.inspectionID)
      this.checklists.forEach(element => {
        this.InspectionResultListForm.push(this.createInspectionResultForm(element));
      });
    });
    WebcamUtil.getAvailableVideoInputs()
    .then((mediaDevices: MediaDeviceInfo[]) => {
      this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
    });
  }
  onSubmit(){
    this.submitted = true;
    if (!this.ProcessInspectionForm.valid) {
      this.ProcessInspectionForm.markAllAsTouched();
      return
    }
    const fromData=this.ProcessInspectionForm.value;
    const model: CreateOrUpdateInspectionResultDto = {
          inspectionID:fromData.inspectionID,
          data:fromData.inspectionResult.map((item: any)=>{
            return{
              inspectionID:fromData.inspectionID,
              checkId:item.checkId,
              result:item.result,
              comment:item.comment,
              images:item.images.map((p: { imagestring: string; })=> {return p.imagestring}),
            }
          })
    };
       this.inspectionService.CreateOrUpdateInspectionResult(model).subscribe((res: Inspection) => {
         this.sweetAlertService.SaveSuccess().then(result => {
           this.ProcessInspectionForm.reset();
           this.submitted = false;
           this.router.navigate(['inspection/'])
         });
       });
  }
  createInspectionResultForm(item:InspectionCheckList): FormGroup {
    return this.fb.group({
        checkId: [item.id, [Validators.required]],
        nameAr: [item.nameAr, [Validators.required]],
        nameEn: [item.nameEn, [Validators.required]],
        categoryAr: [item.categoryAr, [Validators.required]],
        categoryEn: [item.categoryEn, [Validators.required]],
        comment: [''],
        result: ['', [Validators.required]],
        images:this.fb.array([])
    });
  }
  // get the formgroup under userList form array
  getInspectionResult(index:number): FormGroup {
  return this.inspectionResultList.controls[index] as FormGroup;
  }
  getControl(index: number, controlName: string): any {
    return this.inspectionResultList.at(index)?.get(controlName);
  }
  handleInitError(error: WebcamInitError): void {
    console.warn(error);
  }
  addImage(checkIndex:number,imagestring:string){
    const arr:FormArray=this.inspectionResultList.controls[checkIndex].get("images") as FormArray;
    arr.push( this.fb.group({
      imagestring: [imagestring]
    }))
  }
  removeImage(checkIndex:number, index:number){
    const arr:FormArray=this.inspectionResultList.controls[checkIndex].get("images") as FormArray;
    arr.removeAt(index);
  }
  get checkListMapName(){
   return this.inspectionResultList.controls.map(c=>{ return {name:this.lang==='ar' ? c.value.nameAr: c.value.nameEn, isValid:Boolean(this.submitted && !c.valid) } })
  }
  get f() {
    return this.ProcessInspectionForm.controls;
  }
  get inspectionResultList() {
    return this.ProcessInspectionForm.get('inspectionResult') as FormArray;
  }
}
