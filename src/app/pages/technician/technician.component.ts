import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IconDirective } from '@ant-design/icons-angular';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { GetAllTechnicianRequest, GetAllTechnicianReresponseData } from 'src/app/core/api-client/models/Technician.api.model';
import { GetAllTechnicianPath } from 'src/app/core/api-client/services/apiRoutPath';
import { PaginatedApiService } from 'src/app/core/api-client/services/paginated-api.service';
import { TechnicianService } from 'src/app/core/api-client/services/technician.service';
import { LanguageService } from 'src/app/core/Service/language.service';
import { SweetAlertService } from 'src/app/core/Service/sweet-alert.service';

@Component({
  selector: 'app-technician',
  imports: [NgbPaginationModule,TranslatePipe,RouterModule,IconDirective],
  templateUrl: './technician.component.html',
  styleUrl: './technician.component.scss'
})
export class TechnicianComponent {
   paginatedApiService  = inject(PaginatedApiService);
   router  = inject(Router); 
   sweetAlertService = inject(SweetAlertService);
   languageService = inject(LanguageService);
   lang: string='ar';

   TechnicianService = inject(TechnicianService);
   translate = inject(TranslateService);
   totalPages: number;
   filter:GetAllTechnicianRequest=<GetAllTechnicianRequest>{PageNumber:1,PageSize:6};
   pagedData: GetAllTechnicianReresponseData[];
   ngOnInit() {
    this.updatePagedData();
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
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.filter.PageNumber = page;
      this.updatePagedData();
    }
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
}
