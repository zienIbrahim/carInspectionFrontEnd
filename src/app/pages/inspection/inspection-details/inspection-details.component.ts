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
import { CreateOrUpdateInspectionResultDto, CreateOrUpdateInspectionVisualResultDto, Inspection, InspectionDetails, InspectionDetailsResult, Result } from 'src/app/core/api-client/models/Inspection.api.model';
import { InspectionService } from 'src/app/core/api-client/services/inspection.service';
import { StepperComponent } from 'src/app/core/components/stepper/stepper.component';
import { resultList, resultListData } from 'src/app/core/model/model';
import { LanguageService } from 'src/app/core/Service/language.service';
import { SweetAlertService } from 'src/app/core/Service/sweet-alert.service';
import { GalleriaComponent } from 'src/app/core/components/galleria/galleria.component';
import { PanelModule } from 'primeng/panel';
import AppUtils from 'src/app/core/Utilities/AppUtils';
import { AuthenticationService } from 'src/app/core/api-client/services/authentication.service';
import { UserRoles } from 'src/app/core/data/UserRole';
import { DrawerModule } from 'primeng/drawer';
import { ImageEditorComponent } from 'src/app/core/components/image-editor/image-editor.component';
import { ImageDirction, ImageType } from 'src/app/core/data/inspections';
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-inspection-details',
  imports: [
    TranslatePipe,
    PanelModule,
    StepperModule,
    ReactiveFormsModule,
    FormsModule,
    DrawerModule,
    GalleriaComponent,
    TabsModule,
    ImageEditorComponent,
    WebcamModule,
    ButtonModule,
    CdkStepperModule,
    StepperComponent,
    CommonModule,
    IconDirective
  ],
  templateUrl: './inspection-details.component.html',
  styleUrl: './inspection-details.component.scss'
})
export class InspectionDetailsComponent {
  lang: string = 'ar';
  InspectionID: number;
  UserCategoryId: number = 0;
  InspectionDetails: InspectionDetails;
  languageService = inject(LanguageService);
  inspectionService = inject(InspectionService);
  sweetAlertService = inject(SweetAlertService);
  router = inject(Router);
  route  = inject(ActivatedRoute);
  fb: FormBuilder= inject(FormBuilder);
  searchText: string = '';
  selectedIndex = 0;
  selectedDir = 0;
  cardView = true;
  showImage = false;
  showEditFrom = false;
  showVisualResult = false;
  submitted = false;
  showWebcam = false;
  inspectionimage = false;
  EditInspectionResultForm: FormGroup;
  VisualResultForm: FormGroup;
  public VisualResultDetailsForm: FormArray;
  public InspectionResultListForm: FormArray;
  _authService = inject(AuthenticationService);
  _userRoles =UserRoles;
  imageMarks: {
    images:string[],
    imageData:{
     id: number;
     name: string;
     url: string;
     markers: any[];
    }[]
  };
  trigger: Subject<void> = new Subject<void>();
  log=(e:any) => console.log(e);
  responsiveOptions: any[] = [
  {
    breakpoint: '1300px',
    numVisible: 4
  },
  {
    breakpoint: '575px',
    numVisible: 1
  }
  ];
  resultOptions:resultList[] = [];
  selectCheckList:{checkId:number}[] = [];
  constructor() {
    this.UserCategoryId = Number(this._authService.getUserCategoryId());
    this.InspectionID=Number(this.route.snapshot.paramMap.get('id'));
    this.resultOptions=resultListData
  }
  ngOnInit(): void {   
    this.languageService.language$.subscribe(lang => {
      this.lang = lang;
    }); 
    this.GetInspectionDetailsById();
    this.initEditResultForm();
  }
  GetInspectionDetailsById() {
      this.inspectionService.GetInspectionDetailsById(this.InspectionID).subscribe(res => {
        this.InspectionDetails = res as InspectionDetails;
      });
  }
  exportToCSV() {
    this.router.navigate(['inspection/report/'+this.InspectionDetails.id])
  }
  createVisualResultForm(isVisualResult:boolean) {
    this.initVisualResultForm();
    Object.keys(ImageType).filter(c=> isVisualResult? c==='1':c==='2').forEach(ImageTypeKey => {
      Object.keys(ImageDirction).forEach(ImageDirctionKey => {
       const item= this.InspectionDetails?.visualResult.filter(x=> x.imageType==Number(ImageTypeKey) && x.imageDirction==Number(ImageDirctionKey))[0];
       this.VisualResultDetailsForm.push(this.fb.group({
        imageDirction: [Number(ImageDirctionKey), [Validators.required]],
        imageType: [Number(ImageTypeKey), [Validators.required]],
        lableAr: [ImageDirction[ImageDirctionKey].nameAr, []],
        lableEn: [ImageDirction[ImageDirctionKey].nameEn, []],
        imageUrl: [item?.imageUrl, [Validators.required]],
        comment: [item?.comment, []],
        markers: [item?.markers, []],
        technicianEn: [item?.technicianEn, []],
        technicianAr: [item?.technicianAr, []],
        technicianID: [item?.technicianID, []],
        inspectionResultId: [item?.inspectionResultId, []],
      }));
      });
    });
  }
  showVisualInspection(isVisualResult:boolean) {
    if(this.InspectionDetails?.haveVisualInspection==false) return;
    this.showVisualResult = true;  
    this.createVisualResultForm(isVisualResult);
  }
  createInspectionResultForm(item:InspectionDetailsResult): FormGroup {
      return this.fb.group({
          checkId: [item.checkId, [Validators.required]],
          nameAr: [item.checkAr, [Validators.required]],
          nameEn: [item.checkEn, [Validators.required]],
          categoryAr: [item.categoryAr, [Validators.required]],
          categoryEn: [item.categoryEn, [Validators.required]],
          comment: [item?.inspectionResult?.comment? item?.inspectionResult?.comment : ''],
          resultId: [item?.inspectionResult?.inspectionResultId, [Validators.required]],
          images: this.fb.array( item?.inspectionResult?.images && item?.inspectionResult?.images?.length > 0 ? item?.inspectionResult?.images.map(img => this.fb.group({ imagestring: [img] })) : [])
      });
  }
  viusalResultImage(type :number)
  {
    const images= this.InspectionDetails?.visualResult?.filter((x: { imageType: number; imageUrl: string; })=> x.imageType==type && x.imageUrl!=undefined)
    .map(item=> {return {src:item.imageUrl, comment:item?.comment}}) as {src:string,comment?:string}[];
    return images
  }
  initEditResultForm() {
    this.EditInspectionResultForm = this.fb.group({
      inspectionID: ['', Validators.required],
      inspectionResult:this.fb.array([])
    });
    this.InspectionResultListForm=this.inspectionResultList
  }
  initVisualResultForm() {
    this.VisualResultForm = this.fb.group({
      inspectionID: [this.InspectionID, Validators.required],
      VisualResultDetails:this.fb.array([])
    });
    this.VisualResultDetailsForm=this.VisualResultDetailsFormList;
  }
  getControl(index: number, controlName: string): any {
    return this.inspectionResultList.at(index)?.get(controlName);
  }
  getInspectionResult(index:number): FormGroup {
    return this.inspectionResultList.controls[index] as FormGroup;
  }
  selectChange(e:any, chechId:number){
    if(e.target.checked)
    {
      this.selectCheckList.push({checkId:chechId});
    }
    else
    {
      this.selectCheckList = this.selectCheckList.filter(x=> x.checkId!=chechId);
    }
  }
  selectAllChange(e:any){
    if(e.target.checked){
      this.InspectionDetails?.results?.forEach(item=>{
        if(this.UserCategoryId == item.categoryId || this._authService.UserInRole(this._userRoles.Admin))
        this.selectCheckList.push({checkId:item.checkId});
      });
    }
    else{
      this.selectCheckList = [];
    }
  }
  indeterminateSelectGroup(array:InspectionDetailsResult[])
  { 
    return this.selectCheckList.some(x => array.some(c => c.checkId === x.checkId)) && !this.checkedSelectGroup(array);
  }
  checkedSelectGroup(array:InspectionDetailsResult[])
  { 
    return array.every(item => this.selectCheckList.some(x => x.checkId === item.checkId));
  }
  selectGroupChange(e: any, array: InspectionDetailsResult[]) {
    if (e.target.checked) {
      array.forEach(item => {
        if (!this.selectCheckList.some(x => x.checkId === item.checkId) && (this.UserCategoryId == item.categoryId ||this._authService.UserInRole(this._userRoles.Admin))) {
          this.selectCheckList.push({ checkId: item.checkId });
        }
      });
    } 
    else {
      this.selectCheckList = this.selectCheckList.filter(
        x => !array.some(c => c.checkId === x.checkId)
      );
    }
  }
  resultChecked(chechId:number){
    return this.selectCheckList.some(c=> chechId==c.checkId)
  }
  async EditResult(){
   if(this.selectCheckList.length>0){
      await this.updateInspectionResultList()
      this.showEditFrom=true;
    }
    else{
      this.sweetAlertService.show('No Data Selected', '', 'warning').then(res => {
    });
    }
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
  handleInitError(error: WebcamInitError): void {
    console.warn(error);
  }
  addImage(checkIndex:number,imagestring:string){
    console.log({checkIndex,imagestring })
    this.inspectionimage=false;
    const arr:FormArray=this.inspectionResultList.controls[checkIndex].get("images") as FormArray;
    arr.push( this.fb.group({
      imagestring: [imagestring]
    }))
  }
  addVisualImage(imagestring:string){
    this.VisualResultDetailsFormList.controls[this.selectedDir].get('imageUrl').setValue(imagestring);
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
                  resultId:item.resultId,
                  comment:item.comment,
                  images:item.images.map((p: { imagestring: string; })=> {return p.imagestring}),
                }
              })
        };
           this.inspectionService.CreateOrUpdateInspectionResult(model).subscribe((res: Inspection) => {
            this.closeShowEditFromDialog()
             this.sweetAlertService.SaveSuccess().then(result => {
               this.EditInspectionResultForm.reset();
               this.submitted = false;
              this.reloadCurrentRoute();
             });
      });
  }
  reloadCurrentRoute() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
  SaveVisualResult(){ 
    this.submitted = true;
    if (!this.VisualResultForm.valid) {
      this.VisualResultForm.markAllAsTouched();
      return
    } 
    const fromData=this.VisualResultForm.value;
    const model: CreateOrUpdateInspectionVisualResultDto = {
          inspectionId:fromData.inspectionID,
          results:fromData.VisualResultDetails.map((item: any)=>{
            return{
              imageDirction:item.imageDirction,
              imageType:item.imageType,
              imageUrl:item.imageUrl,
              markers:item.markers,
              comment: item.comment,
            }
          })
    };
    this.inspectionService.CreateInspectionVisualResult(model).subscribe((res: Inspection) => {
      this.showVisualResult=false;
      this.sweetAlertService.SaveSuccess().then(result => {
         this.EditInspectionResultForm.reset();
         this.submitted = false;
         this.reloadCurrentRoute();
       });
});
  }
  showWebcamDialog(index:number){
    this.showWebcam=true;
    this.selectedIndex=index
   
  }
  takePicture() {
      this.trigger.next();
  }
  handleImage(image: WebcamImage ,imageType:boolean=false) {
    
    this.inspectionimage?this.addImage(this.selectedIndex,image.imageAsDataUrl): this.addVisualImage(image.imageAsDataUrl)
    this.showWebcam=false;
  }
  getResultOptions(checkId:number):Result[]{
    return this.InspectionDetails.results.filter(x=> x.checkId==checkId)[0].checkResult.map(item=> {
      return {
        id:item.id,
        nameAr:item.nameAr,
        nameEn:item.nameEn,
        color:item.color,
        description:item.description
      }
    }) as Result[];
  }
  getResultData(result: InspectionDetailsResult) {
    const res=   result.checkResult.find(x => x.id == result?.inspectionResult?.inspectionResultId);
    const   data =res ? res :{
      color: "#000",
      description: "N/A",
      nameEn: "N/A",
      nameAr: "N/A", 
      id: 0
  }
    return data
  }
  OnSaveImags(e:any,index:number){
    console.log(JSON.stringify(e.markers))
    this.VisualResultDetailsFormList.controls[index].patchValue({
      imageUrl: e.imageUrl,
      markers: JSON.stringify(e.markers),
    });

  }
  get VisualResultDetailsFormList() {
    return this.VisualResultForm.get('VisualResultDetails') as FormArray;
  }
  get VisualResultControls(){
    return this.VisualResultDetailsForm.controls;
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
  get groupedResults() {
    if(!this.InspectionDetails?.results) return null;
    return AppUtils.groupBy<InspectionDetailsResult>(this.InspectionDetails?.results,"categoryEn")
  }
  imageMarkers(type:number,dir:number):{ x: number; y: number; text: string }[]| null{ 
    const markersObj= this.InspectionDetails?.visualResult.filter(x=> x.imageType==type && x.imageDirction==dir)[0]?.markers;
    const markers= JSON.parse(markersObj?? "{}") as { x: number; y: number; text: string }[];
    if(!markers || markers.length==0 || markers==undefined) return null;
    return markers
  }
  mapImageResulrt(images:string[]):{src:string,comment?:string}[]{
    return images.map(item=> {return {src:item}}) as {src:string,comment?:string}[];
  }
}
