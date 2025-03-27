import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslatePipe } from '@ngx-translate/core';
import { CheckListData, MasterData } from 'src/app/core/api-client/models/Common.api.model';
import { CreatePackageRequest, Package } from 'src/app/core/api-client/models/Package.api.model';
import { CommonApiService } from 'src/app/core/api-client/services/common-api.service';
import { PackageService } from 'src/app/core/api-client/services/package.service';
import { LanguageService } from 'src/app/core/Service/language.service';
import { SweetAlertService } from 'src/app/core/Service/sweet-alert.service';
import { TableModule } from 'primeng/table';
import { IconDirective } from '@ant-design/icons-angular';

@Component({
  selector: 'app-create-package',
  imports: [TranslatePipe,TableModule,IconDirective, ReactiveFormsModule, CommonModule, NgSelectModule],
  templateUrl: './create-package.component.html',
  styleUrl: './create-package.component.scss'
})
export class CreatePackageComponent implements OnInit {
  CreatePackageForm: FormGroup;
  submitted = false;
  packageService = inject(PackageService);
  sweetAlertService = inject(SweetAlertService);
  router = inject(Router);
  commonApiService = inject(CommonApiService);
  languageService = inject(LanguageService);
  lang: string = 'ar';
  checkPoints:CheckListData[]= [];
  checkPointsGroubByCategory: {
    categoryId: any;
    categoryEn: any;
    categoryAr: any; }[] = [];
  selectedcheckPoints: number[] = [];

  constructor(private fb: FormBuilder) {
  }
  ngOnInit(): void {
    this.FillCommonData();
    this.languageService.language$.subscribe(lang => {
      this.lang = lang;
    });
    this.InitForm()
  }
  InitForm() {
    this.CreatePackageForm = this.fb.group({
      nameAr: ['', Validators.required],
      description: ['', Validators.required],
      nameEn: ['', Validators.required],
      checkList: [''],
    });
  }
  onSubmit() {
    console.log({FormValue:this.CreatePackageForm.value})
    this.submitted = true;
    if (!this.CreatePackageForm.valid) {
      this.CreatePackageForm.markAllAsTouched();
      return
    }
    const model: CreatePackageRequest = {
      nameAr: this.f['nameAr'].value,
      nameEn: this.f['nameEn'].value,
      description: this.f['description'].value,
      packageDetails:  this.selectedcheckPoints.map(check => {
        return { checkId: check }
      })
    }
    this.packageService.CreatePackage(model).subscribe((res: Package) => {
      this.sweetAlertService.SaveSuccess().then(result => {
        this.CreatePackageForm.reset();
        this.submitted = false;
        this.router.navigate(['package/'])
      });
    });
  }
  FillCommonData() {
    this.commonApiService.GetCheckPointList().subscribe((res: any) => {
      this.checkPoints = res.data;
    });
  }  selectCategory(categoryId: number, e: any) {
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
    return this.CreatePackageForm.controls;
  }
  
}