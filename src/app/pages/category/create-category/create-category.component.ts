import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Category } from 'src/app/core/api-client/models/Category.api.model';
import { CategoryService } from 'src/app/core/api-client/services/category.service';
import { SweetAlertService } from 'src/app/core/Service/sweet-alert.service';

@Component({
  selector: 'app-create-category',
  imports: [TranslatePipe, ReactiveFormsModule, CommonModule],
  templateUrl: './create-category.component.html',
  styleUrl: './create-category.component.scss'
})
export class CreateCategoryComponent implements OnInit {
  categoryService = inject(CategoryService);
  sweetAlertService = inject(SweetAlertService);
  router = inject(Router);
  CreateCategoryForm: FormGroup;
  submitted = false;
  constructor(private fb: FormBuilder) {

  }
  ngOnInit(): void {
    this.InitForm()
  }
  InitForm() {
    this.CreateCategoryForm = this.fb.group({
      nameAr: ['', Validators.required],
      nameEn: ['', Validators.required],
    });
  }
  onSubmit() {
    this.submitted = true;
    if (!this.CreateCategoryForm.valid) {
      this.CreateCategoryForm.markAllAsTouched();
      return
    }
    const model = { nameAr: this.f['nameAr'].value, nameEn: this.f['nameEn'].value }
    this.categoryService.CreateCategory(model).subscribe((res: Category) => {
      this.sweetAlertService.SaveSuccess().then(result => {
        this.CreateCategoryForm.reset();
        this.submitted = false;
        this.router.navigate(['category/'])
      });
    });

  }
  get f() {
    return this.CreateCategoryForm.controls;
  }
}
