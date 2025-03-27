import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Make } from 'src/app/core/api-client/models/make.api.model';
import { MakeService } from 'src/app/core/api-client/services/make.service';
import { SweetAlertService } from 'src/app/core/Service/sweet-alert.service';

@Component({
  selector: 'app-create-make',
  imports: [TranslatePipe, ReactiveFormsModule, CommonModule],
  templateUrl: './create-make.component.html',
  styleUrl: './create-make.component.scss'
})
export class CreateMakeComponent {
 makeService = inject(MakeService);
  sweetAlertService = inject(SweetAlertService);
  router = inject(Router);
  CreateMakeForm: FormGroup;
  submitted = false;
  constructor(private fb: FormBuilder) {

  }
  ngOnInit(): void {
    this.InitForm()
  }
  InitForm() {
    this.CreateMakeForm = this.fb.group({
      nameAr: ['', Validators.required],
      nameEn: ['', Validators.required],
    });
  }
  onSubmit() {
    this.submitted = true;
    if (!this.CreateMakeForm.valid) {
      this.CreateMakeForm.markAllAsTouched();
      return
    }
    const model = { nameAr: this.f['nameAr'].value, nameEn: this.f['nameEn'].value }
    this.makeService.CreateMake(model).subscribe((res: Make) => {
      this.sweetAlertService.SaveSuccess().then(result => {
        this.CreateMakeForm.reset();
        this.submitted = false;
        this.router.navigate(['make/'])
      });
    });

  }
  get f() {
    return this.CreateMakeForm.controls;
  }
}
