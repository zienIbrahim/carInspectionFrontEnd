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
import { InspectionCheckList } from 'src/app/core/api-client/models/Inspection.api.model';
import { LanguageService } from 'src/app/core/Service/language.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslatePipe } from '@ngx-translate/core';
import { resultList, resultListData } from 'src/app/core/model/model';
import { Dialog } from 'primeng/dialog';
import {WebcamImage, WebcamModule, WebcamInitError, WebcamUtil} from 'ngx-webcam';

@Component({
  selector: 'app-process-inspection',
  imports: [    
    CommonModule,
    NgSelectModule,
    FormsModule,
    TranslatePipe,
    ReactiveFormsModule,
    StepperModule,
    WebcamModule,
    ButtonModule,
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
  checklists:InspectionCheckList[] = [];
  resultOptions:resultList[] = [];
  lang: string = 'ar';
  ProcessInspectionForm: FormGroup;
  public InspectionResultListForm: FormArray;
  trigger: Subject<void> = new Subject<void>();
   selectedIndex=-1;
  webcamImage: WebcamImage | null = null;
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
    this.webcamImage = image;
    this.addImage(this.selectedIndex,image.imageAsDataUrl)
    this.showWebcam=false;
  }
  ngOnInit(): void {
    this.InitForm()
    this.inspectionService.GetInspectionCheckListById(5).subscribe((res:any)=>{
      this.checklists = res.data;
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

  }
  get checkListMapName(){
   return this.checklists.map(c=>{ return {name:this.lang==='ar' ? c.nameAr: c.nameEn} })
  }
  get f() {
    return this.ProcessInspectionForm.controls;
  }
  get inspectionResultList() {
    return this.ProcessInspectionForm.get('inspectionResult') as FormArray;
  }
  createInspectionResultForm(item:InspectionCheckList): FormGroup {
    return this.fb.group({
        checkId: [item.id, [Validators.required]],
        nameAr: [item.nameAr, [Validators.required]],
        nameEn: [item.nameEn, [Validators.required]],
        categoryAr: [item.categoryAr, [Validators.required]],
        categoryEn: [item.categoryEn, [Validators.required]],
        comment: ['',[Validators.required]],
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
    console.log("checkIndex",checkIndex)
    console.log("imagestring",imagestring)
    const arr:FormArray=this.inspectionResultList.controls[checkIndex].get("images") as FormArray;
    console.log("images",arr)

    arr.push( this.fb.group({
      imagestring: [imagestring, [Validators.required]]
    }))
  }
  log(msg:any){
    console.log(msg);

  }
}
