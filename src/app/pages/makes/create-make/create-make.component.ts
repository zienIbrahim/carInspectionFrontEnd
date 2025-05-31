import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, OutputEmitterRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IconDirective } from '@ant-design/icons-angular';
import { TranslatePipe } from '@ngx-translate/core';
import { Make } from 'src/app/core/api-client/models/make.api.model';
import { MakeService } from 'src/app/core/api-client/services/make.service';
import { SweetAlertService } from 'src/app/core/Service/sweet-alert.service';

@Component({
  selector: 'app-create-make',
  imports: [TranslatePipe, ReactiveFormsModule,IconDirective, CommonModule],
  templateUrl: './create-make.component.html',
  styleUrl: './create-make.component.scss'
})
export class CreateMakeComponent {
 makeService = inject(MakeService);
  sweetAlertService = inject(SweetAlertService);
  router = inject(Router);
  CreateMakeForm: FormGroup;
  submitted = false;
  @Output() OnSave = new EventEmitter<Make>();
  @Output() OnClose = new EventEmitter<boolean>();
  @Input() dialog: boolean = false;
  createEvent: any;
  constructor(private fb: FormBuilder) {

  }
  ngOnInit(): void {
    this.InitForm()
  }
  InitForm() {
    this.CreateMakeForm = this.fb.group({
      nameAr: ['', Validators.required],
      logo: ['', Validators.required],
      nameEn: ['', Validators.required],
    });
  }
  onSubmit() {
    this.submitted = true;
    if (!this.CreateMakeForm.valid) {
      this.CreateMakeForm.markAllAsTouched();
      return
    }
    const model = { nameAr: this.f['nameAr'].value, nameEn: this.f['nameEn'].value, logo: this.f['logo'].value }
    this.makeService.CreateMake(model).subscribe((res: Make) => {
      this.sweetAlertService.SaveSuccess().then(result => {
        this.CreateMakeForm.reset();
        this.submitted = false;
         if (this.dialog) {
          this.OnSave.emit({
            id: res.id,
            nameAr: res.nameAr,
            nameEn: res.nameEn,
            logo:null
          });
        }
        else{
          this.router.navigate(['make/'])

        }
      });
    });

  }
  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.f['logo'].setValue( e.target?.result );
      };
      reader.readAsDataURL(file);
    }
  }
  get f() {
    return this.CreateMakeForm.controls;
  }
}
