import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IconDirective } from '@ant-design/icons-angular';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Check, GetAllCheckRequest, GetAllCheckReresponseData } from 'src/app/core/api-client/models/Check.api.model';
import { GetAllCheckPath } from 'src/app/core/api-client/services/apiRoutPath';
import { CheckService } from 'src/app/core/api-client/services/check.service';
import { PaginatedApiService } from 'src/app/core/api-client/services/paginated-api.service';
import { LanguageService } from 'src/app/core/Service/language.service';
import { SweetAlertService } from 'src/app/core/Service/sweet-alert.service';

@Component({
  selector: 'app-check',
  imports: [NgbPaginationModule,TranslatePipe,RouterModule,IconDirective],
  templateUrl: './check.component.html',
  styleUrl: './check.component.scss'
})
export class CheckComponent {
   paginatedApiService  = inject(PaginatedApiService);
   router  = inject(Router); 
   sweetAlertService = inject(SweetAlertService);
   languageService = inject(LanguageService);
   lang: string='ar';

   checkService = inject(CheckService);
   translate = inject(TranslateService);
   totalPages: number;
   filter:GetAllCheckRequest=<GetAllCheckRequest>{PageNumber:1,PageSize:6};
   pagedData: GetAllCheckReresponseData[];
   ngOnInit() {
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
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.filter.PageNumber = page;
      this.updatePagedData();
    }
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

 
}
