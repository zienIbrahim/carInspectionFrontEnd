import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IconDirective } from '@ant-design/icons-angular';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { GetAllResultRequest } from 'src/app/core/api-client/models/result.api.model';
import { GetAllUsersRequest, GetAllUsersReresponseData } from 'src/app/core/api-client/models/Users.api.model';
import { GetAllUsersPath } from 'src/app/core/api-client/services/apiRoutPath';
import { PaginatedApiService } from 'src/app/core/api-client/services/paginated-api.service';
import { UsersService } from 'src/app/core/api-client/services/users.service';
import { LanguageService } from 'src/app/core/Service/language.service';
import { SweetAlertService } from 'src/app/core/Service/sweet-alert.service';

@Component({
  selector: 'app-users',
  imports: [NgbPaginationModule,ButtonModule,ColorPickerModule,FormsModule,CommonModule,PanelModule,TableModule,TranslatePipe,RouterModule,IconDirective],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  paginatedApiService  = inject(PaginatedApiService);
  router  = inject(Router); 
  sweetAlertService = inject(SweetAlertService);
  languageService = inject(LanguageService);
  lang: string='ar';
  usersService = inject(UsersService);
  translate = inject(TranslateService);
  totalPages: number;
  filter:GetAllUsersRequest=<GetAllUsersRequest>{PageNumber:1,PageSize:6};
  pagedData: GetAllUsersReresponseData[];
  isAccordionToggled:boolean=false;
  constructor() { }
  ngOnInit(): void {
    
    this.updatePagedData();
    this.languageService.language$.subscribe(lang=>{
      this.lang=lang;
    })  
  }
  updatePagedData() {
    this.paginatedApiService.fetchPaginatedData<GetAllResultRequest, GetAllUsersReresponseData>(GetAllUsersPath, this.filter).subscribe(res => {
    this.pagedData = res.data;
    this.filter.PageNumber = res.pageNumber;
    this.filter.PageSize = res.pageSize;
    this.totalPages = res.totalCount;
  });
  }
  changePage(page: any) {
    this.filter.PageSize= page.rows
    this.filter.PageNumber=  Math.floor(page.first / page.rows) + 1;
    this.updatePagedData();
  }
  Edit(Id:number){
    const selectedUser = this.pagedData.find((item) => item.id === Id);
    const encodedUser = encodeURIComponent(JSON.stringify(selectedUser));

    console.log({selectedUser})
     this.router.navigate(['user/edit/'+Id],{
      queryParams: { d: encodedUser } 
     })
  }
  delete(item:GetAllUsersReresponseData){
        this.sweetAlertService.showConfirm(this.translate.instant('sweetAlert.delete'),` ${this.translate.instant('sweetAlert.deleteMsg',{name:item.fullName,Id:item.id})}` ,'warning')
        .then(result=>{
          if(result.isConfirmed){
            this.ConfirmDelete(item.id)
          }
    
        });
  }
  ConfirmDelete(Id:number){
        this.usersService.DeleteUser(Id).subscribe(res=>{
          this.sweetAlertService.show(this.translate.instant('sweetAlert.DeleteSuccess'),'','success').then(res=>{
            this.updatePagedData()
          })
  });
  } 
}
