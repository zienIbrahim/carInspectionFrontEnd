import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IconDirective } from '@ant-design/icons-angular';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Check, GetAllCheckRequest, GetAllCheckReresponseData } from 'src/app/core/api-client/models/Check.api.model';
import { GetAllCheckPath } from 'src/app/core/api-client/services/apiRoutPath';
import { CheckService } from 'src/app/core/api-client/services/check.service';
import { PaginatedApiService } from 'src/app/core/api-client/services/paginated-api.service';
import { LanguageService } from 'src/app/core/Service/language.service';
import { SweetAlertService } from 'src/app/core/Service/sweet-alert.service';
import { ToolbarModule } from 'primeng/toolbar';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { FormsModule } from '@angular/forms';
import { MasterData } from 'src/app/core/api-client/models/Common.api.model';
import { CommonApiService } from 'src/app/core/api-client/services/common-api.service';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-check',
  imports: [NgbPaginationModule,FormsModule,PanelModule,CommonModule,NgSelectModule,ToolbarModule,TranslatePipe,RouterModule,IconDirective,TableModule,ButtonModule],
  templateUrl: './check.component.html',
  styleUrl: './check.component.scss'
})
export class CheckComponent {
   paginatedApiService  = inject(PaginatedApiService);
   router  = inject(Router); 
   sweetAlertService = inject(SweetAlertService);
   languageService = inject(LanguageService);
   lang: string='ar';
   isAccordionToggled: boolean = false;
   checkService = inject(CheckService);
   translate = inject(TranslateService);
   commonApiService = inject(CommonApiService);
   totalPages: number;
   filter:GetAllCheckRequest=<GetAllCheckRequest>{PageNumber:1,PageSize:6};
   pagedData: GetAllCheckReresponseData[];
   categories: MasterData[] = [];

   ngOnInit() {
    this.FillCommonData();
    this.updatePagedData();
    this.languageService.language$.subscribe(lang=>{
      this.lang=lang;
    })
  }
   updatePagedData() {
      this.paginatedApiService.fetchPaginatedData<GetAllCheckRequest, GetAllCheckReresponseData>(GetAllCheckPath, this.filter).subscribe(res => {
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
    this.router.navigate(['check/edit/'+Id])
  }  
  delete(item:GetAllCheckReresponseData){
    this.sweetAlertService.showConfirm(this.translate.instant('sweetAlert.delete'),` ${this.translate.instant('sweetAlert.deleteMsg',{name:item.nameAr,Id:item.id})}` ,'warning')
    .then(result=>{
      if(result.isConfirmed){
        this.ConfirmDelete(item.id)
      }

    });
  }
   ConfirmDelete(Id:number){
    this.checkService.DeleteCheck(Id).subscribe(res=>{
      this.sweetAlertService.show(this.translate.instant('sweetAlert.DeleteSuccess'),'','success').then(res=>{
        this.updatePagedData()
      })
    });
  }
  FillCommonData() {
    this.commonApiService.GetCategoryList().subscribe((res: any) => {
      this.categories = res.data;
    });
  }
 
}
