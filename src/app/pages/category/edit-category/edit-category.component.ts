import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Category } from 'src/app/core/api-client/models/Category.api.model';
import { CategoryService } from 'src/app/core/api-client/services/category.service';
import { SweetAlertService } from 'src/app/core/Service/sweet-alert.service';

@Component({
  selector: 'app-edit-category',
  imports: [TranslatePipe,ReactiveFormsModule,CommonModule],
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.scss'
})
export class EditCategoryComponent {
  CategoryForm: FormGroup;  
  submitted = false;
  router  = inject(Router);
  route  = inject(ActivatedRoute);
  categoryService  = inject(CategoryService);
    sweetAlertService  = inject(SweetAlertService);
  
  CategoryId:number=0;
  Category:Category=<Category>{};

  constructor(private fb: FormBuilder) {
    this.CategoryId=Number(this.route.snapshot.paramMap.get('id'));
  }
  ngOnInit(): void {
    this.InitForm();
    this.getCategoryId();

  }
  InitForm(){
    this.CategoryForm = this.fb.group({
      nameAr: ['', Validators.required],
      nameEn: ['', Validators.required],
      id: [0, Validators.required],
    });
  }
  getCategoryId(){
    this.categoryService.GetCategoryById(this.CategoryId).subscribe(res=>{
      this.Category=res as Category;
      this.setFormValue();
    });
  }  
  setFormValue(){
    this.CategoryForm.patchValue({
      id:this.Category.id,
      nameAr:this.Category.nameAr,
      nameEn:this.Category.nameEn,

    });
  }
  onSubmit(){
    this.submitted=true;
    if (!this.CategoryForm.valid) {
      this.CategoryForm.markAllAsTouched();
      return 
    }
    const model:Category={nameAr:this.f['nameAr'].value,nameEn:this.f['nameEn'].value, id:this.f['id'].value}
    this.categoryService.EditCategory(model).subscribe((res:Category)=>{
      this.sweetAlertService.SaveSuccess().then(result=>{
        this.CategoryForm.reset();
        this.submitted=false;
        this.router.navigate(['category/'])
      });
    });
  }
  get f() {
    return this.CategoryForm.controls;
  }
}
