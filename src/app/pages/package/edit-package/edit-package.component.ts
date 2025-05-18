import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslatePipe } from '@ngx-translate/core';
import { CheckListData } from 'src/app/core/api-client/models/Common.api.model';
import { Package } from 'src/app/core/api-client/models/Package.api.model';
import { CommonApiService } from 'src/app/core/api-client/services/common-api.service';
import { PackageService } from 'src/app/core/api-client/services/package.service';
import { LanguageService } from 'src/app/core/Service/language.service';
import { SweetAlertService } from 'src/app/core/Service/sweet-alert.service';
import { TableModule } from 'primeng/table';
import AppUtils from 'src/app/core/Utilities/AppUtils';
import { IconDirective } from '@ant-design/icons-angular';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-edit-package',
  imports: [TranslatePipe,TableModule,CheckboxModule,IconDirective, ReactiveFormsModule, CommonModule, NgSelectModule],
  templateUrl: './edit-package.component.html',
  styleUrl: './edit-package.component.scss'
})
export class EditPackageComponent {
  EditPackageForm: FormGroup;
  submitted = false;
  packageService = inject(PackageService);
  sweetAlertService = inject(SweetAlertService);
  router = inject(Router);
  commonApiService = inject(CommonApiService);
  languageService = inject(LanguageService);
  route = inject(ActivatedRoute);
  log=console.log;
  lang: string = 'ar';
  checkPoints:CheckListData[]= [];
  Package: Package = <Package>{};
  PackageId: number = 0;
  selectedcheckPoints: number[] = [];
  checkPointsGroubByCategory: {
  categoryId: any;
  categoryEn: any;
  categoryAr: any; }[] = [];
  constructor(private fb: FormBuilder) {
    this.PackageId = Number(this.route.snapshot.paramMap.get('id'));
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
    this.EditPackageForm = this.fb.group({
      id: ['', Validators.required],
      nameAr: ['', Validators.required],
      nameEn: ['', Validators.required],
      description: ['', Validators.required],
      haveVisualInspection: [false, Validators.required],
      checkList: [''],

    });
  }
  onSubmit() {
    this.submitted = true;
    console.log({selected:this.selectedcheckPoints})
    if (!this.EditPackageForm.valid) {
      this.EditPackageForm.markAllAsTouched();
      return
    }
    const model: Package = {
      id: this.f['id'].value,
      nameAr: this.f['nameAr'].value,
      nameEn: this.f['nameEn'].value,
      description: this.f['description'].value,
      haveVisualInspection:this.f['haveVisualInspection'].value,
      packageDetails:  this.selectedcheckPoints.map(check => {
        return { checkId: check }
      })
    }
    this.packageService.EditPackage(model).subscribe((res: Package) => {
      this.sweetAlertService.SaveSuccess().then(result => {
        this.EditPackageForm.reset();
        this.submitted = false;
        this.router.navigate(['package/'])
      });
    });

  }
  FillCommonData() {
    this.commonApiService.GetCheckPointList().subscribe((res: any) => {
      this.checkPoints = res.data as CheckListData[];
       const groupedData = AppUtils.groupBy<any>(res.data as [], 'categoryId');
      this.checkPointsGroubByCategory= Object.entries(groupedData).map(([key, items]) => {
        const category = items[0]; // Assuming at least one item per category
        return {
          categoryId: category.categoryId,
          categoryEn: category.categoryEn,
          categoryAr: category.categoryAr,
        };
      });
    });
  }
  getCheckById() {
    this.packageService.GetPackageById(this.PackageId).subscribe(res => {
      this.Package = res as Package;
      this.setFormValue();
   
    });
  }
  setFormValue() {
    this.EditPackageForm.patchValue({
      id: this.Package.id,
      nameAr: this.Package.nameAr,
      nameEn: this.Package.nameEn,
      description: this.Package.description,
      haveVisualInspection: this.Package.haveVisualInspection,
      checkList:this.Package.packageDetails.map(x=> {return x.checkId}) as []
    });
    this.selectedcheckPoints =this.Package.packageDetails.map(x=> {return x.checkId}) as []
  }
  selectCategory(categoryId: number, e: any) {
    const isChecked = e.target.checked; // Ensure correct event property
    const categoryItemIds = this.checkPoints
      .filter(c => c.categoryId === categoryId)
      .map(x => x.id);
    if (isChecked) {
      // Use Set to avoid duplicates
      const selectedSet = new Set(this.selectedcheckPoints);
      categoryItemIds.forEach(id => selectedSet.add(id));
      this.selectedcheckPoints = Array.from(selectedSet);
    } 
    else {
      // Remove category items from selected list
      this.selectedcheckPoints = this.selectedcheckPoints.filter(
        id => !categoryItemIds.includes(id)
      );
    }
  }
  isCategoryIndeterminate(categoryId: number): boolean {
    const categoryItemIds = this.checkPoints
      .filter(c => c.categoryId === categoryId)
      .map(x => x.id);
  
    const selectedCount = categoryItemIds.filter(id => this.selectedcheckPoints.includes(id)).length;
  
    return selectedCount > 0 && selectedCount < categoryItemIds.length;
  }
  checkedSelectGroup(categoryId: number)
    { 
      const categoryItemIds = this.checkPoints
      .filter(c => c.categoryId === categoryId)
      .map(x => x.id);
      return categoryItemIds.every(item => this.selectedcheckPoints.some(x => x === item));
  }
  selectAll(e:any){
    const isChecked =e.target.checked; // Ensure correct event property
    const categoryItemIds = this.checkPoints.map(x => x.id);
    if (isChecked) {
      // Use Set to avoid duplicates
      const selectedSet = new Set(this.selectedcheckPoints);
      categoryItemIds.forEach(id => selectedSet.add(id));
      this.selectedcheckPoints = Array.from(selectedSet);
    } 
    else{
      // Remove category items from selected list
      this.selectedcheckPoints = this.selectedcheckPoints.filter(
        id => !categoryItemIds.includes(id)
      );
    }
  }
  get isAllIndeterminate(): boolean {
    const categoryItemIds = this.checkPoints .map(x => x.id);
  
    const selectedCount = categoryItemIds.filter(id => this.selectedcheckPoints.includes(id)).length;
  
    return selectedCount > 0 && selectedCount < categoryItemIds.length;
  }
  get isAllSelected(){
    const categoryItemIds = this.checkPoints.map(x => x.id);
    const selectedCount = categoryItemIds.filter(id => this.selectedcheckPoints.includes(id)).length;
   return selectedCount == this.checkPoints.length
  }
  get f() {
    return this.EditPackageForm.controls;
  }
}