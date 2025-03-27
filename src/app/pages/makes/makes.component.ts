import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IconDirective } from '@ant-design/icons-angular';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { GetAllMakeRequest, Make } from 'src/app/core/api-client/models/make.api.model';
import { GetAllMakePath } from 'src/app/core/api-client/services/apiRoutPath';
import { MakeService } from 'src/app/core/api-client/services/make.service';
import { PaginatedApiService } from 'src/app/core/api-client/services/paginated-api.service';
import { SweetAlertService } from 'src/app/core/Service/sweet-alert.service';

@Component({
  selector: 'app-makes',
  imports: [NgbPaginationModule,TranslatePipe,RouterModule,IconDirective],
  templateUrl: './makes.component.html',
  styleUrl: './makes.component.scss'
})
export class MakesComponent {
 paginatedApiService  = inject(PaginatedApiService);
  router  = inject(Router); 
  sweetAlertService = inject(SweetAlertService);
  makeService = inject(MakeService);
  
  translate = inject(TranslateService);
  totalPages: number;
  filter:GetAllMakeRequest=<GetAllMakeRequest>{PageNumber:1,PageSize:6};
  pagedData: Make[];
  ngOnInit() {
    this.updatePagedData();
  }
  updatePagedData() {
    this.paginatedApiService.fetchPaginatedData<GetAllMakeRequest, Make>(GetAllMakePath, this.filter).subscribe(res => {
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
    this.router.navigate(['make/edit/'+Id])
  }
  delete(item:Make){
    this.sweetAlertService.showConfirm(this.translate.instant('sweetAlert.delete'),` ${this.translate.instant('sweetAlert.deleteMsg',{name:item.nameAr,Id:item.id})}` ,'warning')
    .then(result=>{
      if(result.isConfirmed){
        this.ConfirmDelete(item.id)
      }

    });
  }
  ConfirmDelete(Id:number){
    this.makeService.DeleteMake(Id).subscribe(res=>{
      this.sweetAlertService.show(this.translate.instant('sweetAlert.DeleteSuccess'),'','success').then(res=>{
        this.updatePagedData()
      })
    });
  }
}
