import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IconDirective } from '@ant-design/icons-angular';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { GetAllModelRequest, Model } from 'src/app/core/api-client/models/model.api.model';
import { GetAllCategoryPath, GetAllModelPath } from 'src/app/core/api-client/services/apiRoutPath';
import { ModelService } from 'src/app/core/api-client/services/model.service';
import { PaginatedApiService } from 'src/app/core/api-client/services/paginated-api.service';
import { LanguageService } from 'src/app/core/Service/language.service';
import { SweetAlertService } from 'src/app/core/Service/sweet-alert.service';

@Component({
  selector: 'app-models',
  imports: [NgbPaginationModule,TranslatePipe,RouterModule,IconDirective],
  templateUrl: './models.component.html',
  styleUrl: './models.component.scss'
})
export class ModelsComponent {
   paginatedApiService  = inject(PaginatedApiService);
   router  = inject(Router); 
   sweetAlertService = inject(SweetAlertService);
   modelService = inject(ModelService);
   languageService = inject(LanguageService);
   lang: string='ar';
   translate = inject(TranslateService);
   totalPages: number;
   filter:GetAllModelRequest=<GetAllModelRequest>{PageNumber:1,PageSize:6};
   pagedData: Model[];
   
ngOnInit() {
    this.updatePagedData();
  }
  updatePagedData() {
    this.paginatedApiService.fetchPaginatedData<GetAllModelRequest, Model>(GetAllModelPath, this.filter).subscribe(res => {
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
    this.router.navigate(['model/edit/'+Id])
  }
  delete(item:Model){
      this.sweetAlertService.showConfirm(this.translate.instant('sweetAlert.delete'),` ${this.translate.instant('sweetAlert.deleteMsg',{name:item.nameAr,Id:item.id})}` ,'warning')
      .then(result=>{
        if(result.isConfirmed){
          this.ConfirmDelete(item.id)
        }
  
      });
    }
  ConfirmDelete(Id:number){
      this.modelService.DeleteModel(Id).subscribe(res=>{
        this.sweetAlertService.show(this.translate.instant('sweetAlert.DeleteSuccess'),'','success').then(res=>{
          this.updatePagedData()
        })
      });
  }
}
