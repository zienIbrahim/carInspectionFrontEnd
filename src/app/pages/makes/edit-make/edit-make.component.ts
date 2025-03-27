import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Make } from 'src/app/core/api-client/models/make.api.model';
import { MakeService } from 'src/app/core/api-client/services/make.service';
import { SweetAlertService } from 'src/app/core/Service/sweet-alert.service';

@Component({
  selector: 'app-edit-make',
  imports: [TranslatePipe,ReactiveFormsModule,CommonModule],
  templateUrl: './edit-make.component.html',
  styleUrl: './edit-make.component.scss'
})
export class EditMakeComponent {
 MakeForm: FormGroup;  
  submitted = false;
  router  = inject(Router);
  route  = inject(ActivatedRoute);
  makeService  = inject(MakeService);
    sweetAlertService  = inject(SweetAlertService);
  
  MakeId:number=0;
  Make:Make=<Make>{};

  constructor(private fb: FormBuilder) {
    this.MakeId=Number(this.route.snapshot.paramMap.get('id'));
  }
  ngOnInit(): void {
    this.InitForm();
    this.getMakeId();

  }
  InitForm(){
    this.MakeForm = this.fb.group({
      nameAr: ['', Validators.required],
      nameEn: ['', Validators.required],
      id: [0, Validators.required],
    });
  }
  getMakeId(){
    this.makeService.GetMakeById(this.MakeId).subscribe(res=>{
      this.Make=res as Make;
      this.setFormValue();
    });
  }  
  setFormValue(){
    this.MakeForm.patchValue({
      id:this.Make.id,
      nameAr:this.Make.nameAr,
      nameEn:this.Make.nameEn,

    });
  }
  onSubmit(){
    this.submitted=true;
    if (!this.MakeForm.valid) {
      this.MakeForm.markAllAsTouched();
      return 
    }
    const model:Make={nameAr:this.f['nameAr'].value,nameEn:this.f['nameEn'].value, id:this.f['id'].value}
    this.makeService.EditMake(model).subscribe((res:Make)=>{
      this.sweetAlertService.SaveSuccess().then(result=>{
        this.MakeForm.reset();
        this.submitted=false;
        this.router.navigate(['make/'])
      });
    });
  }
  get f() {
    return this.MakeForm.controls;
  }
}
