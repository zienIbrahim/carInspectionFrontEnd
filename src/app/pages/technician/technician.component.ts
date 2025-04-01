import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IconDirective } from '@ant-design/icons-angular';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { MasterData } from 'src/app/core/api-client/models/Common.api.model';
import { GetAllTechnicianRequest, GetAllTechnicianReresponseData } from 'src/app/core/api-client/models/Technician.api.model';
import { GetAllTechnicianPath } from 'src/app/core/api-client/services/apiRoutPath';
import { CommonApiService } from 'src/app/core/api-client/services/common-api.service';
import { PaginatedApiService } from 'src/app/core/api-client/services/paginated-api.service';
import { TechnicianService } from 'src/app/core/api-client/services/technician.service';
import { LanguageService } from 'src/app/core/Service/language.service';
import { SweetAlertService } from 'src/app/core/Service/sweet-alert.service';

@Component({
  selector: 'app-technician',
  imports: [NgbPaginationModule,NgSelectModule,ButtonModule,FormsModule,CommonModule,PanelModule,TableModule,TranslatePipe,RouterModule,IconDirective],
  templateUrl: './technician.component.html',
  styleUrl: './technician.component.scss'
})
export class TechnicianComponent {
   paginatedApiService  = inject(PaginatedApiService);
   router  = inject(Router); 
   sweetAlertService = inject(SweetAlertService);
   languageService = inject(LanguageService);
   lang: string='ar';
   isAccordionToggled:boolean=false;
   TechnicianService = inject(TechnicianService);
   translate = inject(TranslateService);
   commonApiService = inject(CommonApiService);
   totalPages: number;
   filter:GetAllTechnicianRequest=<GetAllTechnicianRequest>{PageNumber:1,PageSize:6};
   pagedData: GetAllTechnicianReresponseData[];
   categories: MasterData[] = [];
   
   ngOnInit() {
    this.updatePagedData();
    this.FillCommonData();
    this.languageService.language$.subscribe(lang=>{
      this.lang=lang;
    })
  }
  updatePagedData() {
      this.paginatedApiService.fetchPaginatedData<GetAllTechnicianRequest, GetAllTechnicianReresponseData>(GetAllTechnicianPath, this.filter).subscribe(res => {
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
    this.router.navigate(['technician/edit/'+Id])
  }  
  delete(item:GetAllTechnicianReresponseData){
    this.sweetAlertService.showConfirm(this.translate.instant('sweetAlert.delete'),` ${this.translate.instant('sweetAlert.deleteMsg',{name:item.nameAr,Id:item.id})}` ,'warning')
    .then(result=>{
      if(result.isConfirmed){
        this.ConfirmDelete(item.id)
      }
    });
  }
   ConfirmDelete(Id:number){
    this.TechnicianService.DeleteTechnician(Id).subscribe(res=>{
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
