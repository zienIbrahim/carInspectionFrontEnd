import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslatePipe } from '@ngx-translate/core';
import { MasterData } from 'src/app/core/api-client/models/Common.api.model';
import { CreatePackageRequest, Package } from 'src/app/core/api-client/models/Package.api.model';
import { CommonApiService } from 'src/app/core/api-client/services/common-api.service';
import { PackageService } from 'src/app/core/api-client/services/package.service';
import { Listbox } from 'primeng/listbox';
import { LanguageService } from 'src/app/core/Service/language.service';
import { SweetAlertService } from 'src/app/core/Service/sweet-alert.service';

@Component({
  selector: 'app-create-package',
  imports: [TranslatePipe,Listbox, ReactiveFormsModule, CommonModule, NgSelectModule],
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
  checkPoints: MasterData[] = [];
  headers = [
    { key: 'nameAr', displayName: 'nameAr' },
    { key: 'id', displayName: 'ID' },
  ];
  clickableColumns =['name']

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
      checkList: ['', Validators.required],
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
      packageDetails: this.f['checkList'].value.map((check: any) => {
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
  }
  get f() {
    return this.CreatePackageForm.controls;
  }
  
}