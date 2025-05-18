import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslatePipe } from '@ngx-translate/core';
import { ColorPickerModule } from 'primeng/colorpicker';
import { CreateUserRequest, User } from 'src/app/core/api-client/models/Users.api.model';
import { UsersService } from 'src/app/core/api-client/services/users.service';
import { LanguageService } from 'src/app/core/Service/language.service';
import { SweetAlertService } from 'src/app/core/Service/sweet-alert.service';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-create-user',
  imports: [TranslatePipe,ColorPickerModule,SelectModule, ReactiveFormsModule, CommonModule, NgSelectModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export class CreateUserComponent implements OnInit, OnDestroy {
  CreateUserForm: FormGroup;
  submitted = false;
  resultService = inject(UsersService);
  sweetAlertService = inject(SweetAlertService);
  router = inject(Router);
  languageService = inject(LanguageService);
  lang: string = 'ar';
  roles: any[] = [];

  constructor(private fb: FormBuilder) {
  }
  ngOnDestroy(): void {
  }
  ngOnInit(): void { 
    this.languageService.language$.subscribe(lang => {
      this.lang = lang;
      this.languageService.getTrnaslate('user.userRole').subscribe((res: any) => {
        this.roles = res;
      })
    });
    this.InitForm()
  }
  InitForm() {
    this.CreateUserForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['',[ Validators.required, Validators.email]],
      password: ['',[ Validators.required,Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/)]],
      phoneNumber: ['', [Validators.required,Validators.pattern(/^05\d{8}$/)
      ]],
      roles: ['', Validators.required],
    });
  }
  onSubmit() {
    console.log({FormValue:this.CreateUserForm.value})
    this.submitted = true;
    if (!this.CreateUserForm.valid) {
      this.CreateUserForm.markAllAsTouched();
      return
    }
    const model: CreateUserRequest = {
      fullName: this.f['fullName'].value,
      email: this.f['email'].value,
      password: this.f['password'].value,
      phoneNumber:this.f['phoneNumber'].value,
      role:this.f['roles'].value,
    }
    this.resultService.CreateResult(model).subscribe((res: User) => {
      this.sweetAlertService.SaveSuccess().then(result => {
        this.CreateUserForm.reset();
        this.submitted = false;
        this.router.navigate(['user/'])
      });
    });
  }
  get f() {
    return this.CreateUserForm.controls;
  }
}
