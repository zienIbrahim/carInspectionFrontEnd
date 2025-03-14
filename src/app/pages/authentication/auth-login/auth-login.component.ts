// project import
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LoginRequest } from 'src/app/core/api-client/models/login-request';
import { AuthenticationService } from 'src/app/core/api-client/services/authentication.service';

@Component({
  selector: 'app-auth-login',
  imports: [RouterModule, TranslatePipe,ReactiveFormsModule,CommonModule],
  templateUrl: './auth-login.component.html',
  styleUrl: './auth-login.component.scss'
})
export class AuthLoginComponent implements OnInit  {
  LoginForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder,private authService: AuthenticationService) {

  }
  ngOnInit(): void {
    this.InitForm()
  }
  onSubmit() {
    this.submitted=true;
    if (!this.LoginForm.valid) {
      this.LoginForm.markAllAsTouched();
      return 
    }
    const loginData: LoginRequest = {
      userName: this.LoginForm.value.userName,
      password: this.LoginForm.value.password,
      rememberMe: this.LoginForm.value.rememberMe,
    };
    this.authService.Login(loginData).subscribe(res=>{
      this.submitted = false;
    })

  }
  InitForm() {
    this.LoginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [true, Validators.required],
    });

  }
}
