import { Component, ElementRef, inject, TemplateRef, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Category, GetAllCategoryRequest } from 'src/app/core/api-client/models/Category.api.model';
import { GetAllCategoryPath } from 'src/app/core/api-client/services/apiRoutPath';
import { PaginatedApiService } from 'src/app/core/api-client/services/paginated-api.service';
import { IconDirective } from '@ant-design/icons-angular';
import { SweetAlertService } from 'src/app/core/Service/sweet-alert.service';
import { CategoryService } from 'src/app/core/api-client/services/category.service';

@Component({
  selector: 'app-category',
  imports: [NgbPaginationModule,TranslatePipe,RouterModule,IconDirective],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent {
  paginatedApiService  = inject(PaginatedApiService);
  router  = inject(Router); 
  sweetAlertService = inject(SweetAlertService);
  categoryService = inject(CategoryService);
  
  translate = inject(TranslateService);
  totalPages: number;
  filter:GetAllCategoryRequest=<GetAllCategoryRequest>{PageNumber:1,PageSize:6};
  pagedData: Category[];
  ngOnInit() {
    this.updatePagedData();
  }
  updatePagedData() {
    this.paginatedApiService.fetchPaginatedData<GetAllCategoryRequest, Category>(GetAllCategoryPath, this.filter).subscribe(res => {
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
    this.router.navigate(['category/edit/'+Id])
  }
  delete(item:Category){
    this.sweetAlertService.showConfirm(this.translate.instant('sweetAlert.delete'),` ${this.translate.instant('sweetAlert.deleteMsg',{name:item.nameAr,Id:item.id})}` ,'warning')
    .then(result=>{
      if(result.isConfirmed){
        this.ConfirmDelete(item.id)
      }

    });
  }
  ConfirmDelete(Id:number){
    this.categoryService.DeleteCategory(Id).subscribe(res=>{
      this.sweetAlertService.show(this.translate.instant('sweetAlert.DeleteSuccess'),'','success').then(res=>{
        this.updatePagedData()
      })
    });
  }
}
