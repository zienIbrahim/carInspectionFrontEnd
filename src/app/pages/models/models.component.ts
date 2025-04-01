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
import { ToolbarModule } from 'primeng/toolbar';
import { MasterData } from 'src/app/core/api-client/models/Common.api.model';
import { GetAllModelRequest, Model } from 'src/app/core/api-client/models/model.api.model';
import { GetAllModelPath } from 'src/app/core/api-client/services/apiRoutPath';
import { CommonApiService } from 'src/app/core/api-client/services/common-api.service';
import { ModelService } from 'src/app/core/api-client/services/model.service';
import { PaginatedApiService } from 'src/app/core/api-client/services/paginated-api.service';
import { ModelType, modelTypeData } from 'src/app/core/data/modelType';
import { LanguageService } from 'src/app/core/Service/language.service';
import { SweetAlertService } from 'src/app/core/Service/sweet-alert.service';

@Component({
  selector: 'app-models',
  imports: [NgbPaginationModule,FormsModule,PanelModule,CommonModule,NgSelectModule,ToolbarModule,TranslatePipe,RouterModule,IconDirective,TableModule,ButtonModule],
  templateUrl: './models.component.html',
  styleUrl: './models.component.scss'
})
export class ModelsComponent {
  paginatedApiService  = inject(PaginatedApiService);
  router  = inject(Router); 
  sweetAlertService = inject(SweetAlertService);
  modelService = inject(ModelService);
  languageService = inject(LanguageService);
  commonApiService = inject(CommonApiService);
  lang: string='ar';
  translate = inject(TranslateService);
  totalPages: number;
  filter:GetAllModelRequest=<GetAllModelRequest>{PageNumber:1,PageSize:6};
  pagedData: Model[];
  makes: MasterData[] = [];
  isAccordionToggled: boolean = false;
  modelTypeList: ModelType[] = [];
   
  ngOnInit() {
    this.modelTypeList = modelTypeData
    this.FillCommonData();
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
  changePage(page: any) {
    this.filter.PageSize= page.rows
    this.filter.PageNumber=  Math.floor(page.first / page.rows) + 1;
    this.updatePagedData();
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
  FillCommonData() {
    this.commonApiService.GetMakeList().subscribe((res: any) => {
      this.makes = res.data;
    });
  }
}
