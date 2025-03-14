import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslatePipe } from '@ngx-translate/core';
import { MasterData } from 'src/app/core/api-client/models/Common.api.model';
import { Package } from 'src/app/core/api-client/models/Package.api.model';
import { CommonApiService } from 'src/app/core/api-client/services/common-api.service';
import { PackageService } from 'src/app/core/api-client/services/package.service';
import { LanguageService } from 'src/app/core/Service/language.service';
import { SweetAlertService } from 'src/app/core/Service/sweet-alert.service';

@Component({
  selector: 'app-edit-package',
  imports: [TranslatePipe, ReactiveFormsModule, CommonModule, NgSelectModule],
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

  lang: string = 'ar';
  checkPoints: MasterData[] = [];
  Package: Package = <Package>{};
  PackageId: number = 0;
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
      checkList: ['', Validators.required],

    });
  }
  onSubmit() {
    this.submitted = true;
    if (!this.EditPackageForm.valid) {
      this.EditPackageForm.markAllAsTouched();
      return
    }
    const model: Package = {
      id: this.f['id'].value,
      nameAr: this.f['nameAr'].value,
      nameEn: this.f['nameEn'].value,
      description: this.f['description'].value,
      packageDetails: this.f['checkList'].value.map(check => {
        return { checkId: check }
      })
    }
    console.log({model});
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
      this.checkPoints = res.data;
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
      checkList:this.Package.packageDetails.map(x=> {return x.checkId}) as []
    });
  }
  get f() {
    return this.EditPackageForm.controls;
  }
}