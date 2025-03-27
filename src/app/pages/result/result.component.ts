import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IconDirective } from '@ant-design/icons-angular';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ColorPickerModule } from 'primeng/colorpicker';
import { GetAllResultRequest, GetAllResultReresponseData } from 'src/app/core/api-client/models/result.api.model';
import { GetAllResultPath } from 'src/app/core/api-client/services/apiRoutPath';
import { PaginatedApiService } from 'src/app/core/api-client/services/paginated-api.service';
import { ResultService } from 'src/app/core/api-client/services/result.service';
import { LanguageService } from 'src/app/core/Service/language.service';
import { SweetAlertService } from 'src/app/core/Service/sweet-alert.service';

@Component({
  selector: 'app-result',
  imports: [NgbPaginationModule,FormsModule,ColorPickerModule,TranslatePipe,RouterModule,IconDirective],
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss'
})
export class ResultComponent {
    paginatedApiService  = inject(PaginatedApiService);
    router  = inject(Router); 
    sweetAlertService = inject(SweetAlertService);
    languageService = inject(LanguageService);
    lang: string='ar';
    resultService = inject(ResultService);
    translate = inject(TranslateService);
    totalPages: number;
    filter:GetAllResultRequest=<GetAllResultRequest>{PageNumber:1,PageSize:6};
    pagedData: GetAllResultReresponseData[];
   ngOnInit() {
    this.updatePagedData();
    this.languageService.language$.subscribe(lang=>{
      this.lang=lang;
    })  
   }
   updatePagedData() {
       this.paginatedApiService.fetchPaginatedData<GetAllResultRequest, GetAllResultReresponseData>(GetAllResultPath, this.filter).subscribe(res => {
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
     this.router.navigate(['result/edit/'+Id])
   }  
   delete(item:GetAllResultReresponseData){
     this.sweetAlertService.showConfirm(this.translate.instant('sweetAlert.delete'),` ${this.translate.instant('sweetAlert.deleteMsg',{name:item.nameAr,Id:item.id})}` ,'warning')
     .then(result=>{
       if(result.isConfirmed){
         this.ConfirmDelete(item.id)
       }
 
     });
   }
   ConfirmDelete(Id:number){
     this.resultService.DeleteResult(Id).subscribe(res=>{
       this.sweetAlertService.show(this.translate.instant('sweetAlert.DeleteSuccess'),'','success').then(res=>{
         this.updatePagedData()
       })
     });
   }
}
