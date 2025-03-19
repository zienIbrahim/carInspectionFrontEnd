import { CdkStepperModule } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IconDirective } from '@ant-design/icons-angular';
import { TranslatePipe } from '@ngx-translate/core';
import { WebcamImage, WebcamInitError, WebcamModule } from 'ngx-webcam';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { StepperModule } from 'primeng/stepper';
import { Subject } from 'rxjs';
import { CreateOrUpdateInspectionResultDto, Inspection, InspectionCheckList, InspectionDetails, InspectionDetailsResult } from 'src/app/core/api-client/models/Inspection.api.model';
import { InspectionService } from 'src/app/core/api-client/services/inspection.service';
import { StepperComponent } from 'src/app/core/components/stepper/stepper.component';
import { resultList, resultListData } from 'src/app/core/model/model';
import { LanguageService } from 'src/app/core/Service/language.service';
import { SweetAlertService } from 'src/app/core/Service/sweet-alert.service';

@Component({
  selector: 'app-inspection-details',
  imports: [TranslatePipe,
     Dialog,
     StepperModule,
     ReactiveFormsModule,
     FormsModule,
     WebcamModule,
     ButtonModule,
     CdkStepperModule,
     StepperComponent,
  CommonModule,FormsModule,IconDirective],
  templateUrl: './inspection-details.component.html',
  styleUrl: './inspection-details.component.scss'
})
export class InspectionDetailsComponent {
  lang: string = 'ar';
  InspectionID: number;
  InspectionDetails: InspectionDetails;
  languageService = inject(LanguageService);
  inspectionService = inject(InspectionService);
  sweetAlertService = inject(SweetAlertService);
  router = inject(Router);
  route  = inject(ActivatedRoute);
  fb: FormBuilder= inject(FormBuilder);
  searchText: string = '';
  currentPage = 1;
  selectedIndex = 0;
  itemsPerPage = 10;
  cardView = true;
  showImage = false;
  showEditFrom = false;
  submitted = false;
  showWebcam = false;
  EditInspectionResultForm: FormGroup;
  public InspectionResultListForm: FormArray;
  trigger: Subject<void> = new Subject<void>();

  resultOptions:resultList[] = [];
  selectCheckList:{checkId:number}[] = [];
  constructor() {
    this.InspectionID=Number(this.route.snapshot.paramMap.get('id'));
        this.resultOptions=resultListData
  }
  ngOnInit(): void {   
    this.languageService.language$.subscribe(lang => {
      this.lang = lang;
    }); 
    this.getCheckById();
    this.initEditResultForm();
  }
  getCheckById() {
      this.inspectionService.GetInspectionDetailsById(this.InspectionID).subscribe(res => {
        this.InspectionDetails = res as InspectionDetails;
      });
  }
  changePage(step: number) {
    this.currentPage += step;
  }
  get filteredResults() {
    return this.InspectionDetails?.results.filter(item => 
       Object.values(item).some(value => 
        value.toString().toLowerCase().includes(this.searchText.toLowerCase())
      )
    ).slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
  }
  exportToCSV() {
    this.router.navigate(['inspection/report/'+this.InspectionDetails.id])
  }
  OnShowImage(index:number){
    this.selectedIndex=index;
    this.showImage=true;
    console.log('selectedIndex: %d', this.selectedIndex);
    console.log('results:', this.InspectionDetails?.results[index]);
  }
  createInspectionResultForm(item:InspectionDetailsResult): FormGroup {
      return this.fb.group({
          checkId: [item.checkId, [Validators.required]],
          nameAr: [item.checkAr, [Validators.required]],
          nameEn: [item.checkEn, [Validators.required]],
          categoryAr: [item.categoryAr, [Validators.required]],
          categoryEn: [item.categoryEn, [Validators.required]],
          comment: [item.comment],
          result: [item.result, [Validators.required]],
          images: this.fb.array( item.images && item.images.length > 0 ? item.images.map(img => this.fb.group({ imagestring: [img] })) : [])
      });
  }
  initEditResultForm() {
    this.EditInspectionResultForm = this.fb.group({
      inspectionID: ['', Validators.required],
      inspectionResult:this.fb.array([])
    });
    this.InspectionResultListForm=this.inspectionResultList

  }
  get inspectionResultList() {
    return this.EditInspectionResultForm.get('inspectionResult') as FormArray;
  }
  get checkListMapName(){
    return this.inspectionResultList.controls.map(c=>{ return {name:this.lang==='ar' ? c.value.nameAr: c.value.nameEn, isValid:Boolean(this.submitted && !c.valid) } })
   }
  get f() {
     return this.EditInspectionResultForm.controls;
  }
  getControl(index: number, controlName: string): any {
    return this.inspectionResultList.at(index)?.get(controlName);
  }
  // get the formgroup under userList form array
  getInspectionResult(index:number): FormGroup {
    return this.inspectionResultList.controls[index] as FormGroup;
  }
  selectCheckChange(e:any, chechId:number){
    if(e.target.checked)
    {
      this.selectCheckList.push({checkId:chechId});
    }
    else
    {
      this.selectCheckList = this.selectCheckList.filter(x=> x.checkId!=chechId);
    }
  }
  selectAllCheckChange(e:any){
    if(e.target.checked){
      this.filteredResults.forEach(item=>{
        this.selectCheckList.push({checkId:item.checkId});
      });
    }
    else{
      this.selectCheckList = [];
    }
  }
  async EditResult(){
    await this.updateInspectionResultList()
    this.showEditFrom=true;
  }
  updateInspectionResultList() {
    this.EditInspectionResultForm.controls['inspectionID'].setValue(this.InspectionDetails.id)
    return new Promise<void>((resolve) => {
      this.InspectionResultListForm.reset();
      this.InspectionResultListForm.clear();
      this.InspectionDetails.results
      .filter(x=> this.selectCheckList.some(c=>x.checkId==c.checkId))
      .forEach(item => {
       this.InspectionResultListForm.push(this.createInspectionResultForm(item));
     }); 
     resolve();
    });
  }
  resultChecked(chechId:number){
   return this.selectCheckList.some(c=> chechId==c.checkId)
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
  closeShowEditFromDialog(){
    this.showEditFrom=false;
  }
  SaveEditResult(){
     this.submitted = true;
        if (!this.EditInspectionResultForm.valid) {
          this.EditInspectionResultForm.markAllAsTouched();
          return
        }
        const fromData=this.EditInspectionResultForm.value;
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
              this.closeShowEditFromDialog()
               this.EditInspectionResultForm.reset();
               this.submitted = false;
               this.router.navigate(['inspection/'])
             });
           });
  }
  showWebcamDialog(index:number){
    this.showWebcam=true;
    this.selectedIndex=index
    console.log({showWebcam:this.showWebcam})
    console.log({selectedIndex:this.selectedIndex})
  }
   takePicture() {
      this.trigger.next();
  }
  handleImage(image: WebcamImage) {
      this.addImage(this.selectedIndex,image.imageAsDataUrl)
      this.showWebcam=false;
  }
}
