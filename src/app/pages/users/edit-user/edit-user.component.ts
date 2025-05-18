import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslatePipe } from '@ngx-translate/core';
import { ColorPickerModule } from 'primeng/colorpicker';
import { SelectModule } from 'primeng/select';
import { UpdateUserRequest, User } from 'src/app/core/api-client/models/Users.api.model';
import { UsersService } from 'src/app/core/api-client/services/users.service';
import { LanguageService } from 'src/app/core/Service/language.service';
import { SweetAlertService } from 'src/app/core/Service/sweet-alert.service';

@Component({
  selector: 'app-edit-user',
  imports: [TranslatePipe,ColorPickerModule,SelectModule, ReactiveFormsModule, CommonModule, NgSelectModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent {
  EditUserForm: FormGroup;
  submitted = false;
  resultService = inject(UsersService);
  sweetAlertService = inject(SweetAlertService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  languageService = inject(LanguageService);
  lang: string = 'ar';
  roles: any[] = [];
  UseerId: number = 0;
  User: User = <User>{};
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
    this.route.queryParams.subscribe(params => {
      if (params['d']) {
        try {
          this.User = JSON.parse(decodeURIComponent(params['d']));
          this.setFormValue();
        } catch (e) {
          console.error('Invalid user data in query params', e);
        }
      } else {
        // fallback or redirect
      }
    });
   
   
  }
  InitForm() {
    this.EditUserForm = this.fb.group({
      id: ['', Validators.required],
      fullName: ['', Validators.required],
      email: ['',[ Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required,Validators.pattern(/^05\d{8}$/)
      ]],
      roles: ['', Validators.required],
    });
  }
  setFormValue() {
    this.EditUserForm.patchValue({
      id: this.User.id,
      fullName: this.User.fullName,
      email: this.User.email,
      phoneNumber: this.User.phoneNumber,
      role: this.User.role,
  });
  }
  onSubmit() {
    console.log({FormValue:this.EditUserForm.value})
    this.submitted = true;
    if (!this.EditUserForm.valid) {
      this.EditUserForm.markAllAsTouched();
      return
    }
    const model: UpdateUserRequest = {
      id: this.f['id'].value,
      fullName: this.f['fullName'].value,
      email: this.f['email'].value,
      phoneNumber:this.f['phoneNumber'].value,
      role:this.f['roles'].value,
    }
    this.resultService.UpdateUser(model).subscribe((res: User) => {
      this.sweetAlertService.SaveSuccess().then(result => {
        this.EditUserForm.reset();
        this.submitted = false;
        this.router.navigate(['user/'])
      });
    });
  }
  get f() {
    return this.EditUserForm.controls;
  }
}
