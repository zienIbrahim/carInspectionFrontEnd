import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IconDirective } from '@ant-design/icons-angular';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { GetAllPackageRequest, GetAllPackageReresponseData } from 'src/app/core/api-client/models/Package.api.model';
import { GetAllPackagePath } from 'src/app/core/api-client/services/apiRoutPath';
import { PackageService } from 'src/app/core/api-client/services/package.service';
import { PaginatedApiService } from 'src/app/core/api-client/services/paginated-api.service';
import { LanguageService } from 'src/app/core/Service/language.service';
import { SweetAlertService } from 'src/app/core/Service/sweet-alert.service';

@Component({
  selector: 'app-package',
  imports: [NgbPaginationModule,ButtonModule,FormsModule,CommonModule,PanelModule,TableModule,TranslatePipe,RouterModule,IconDirective],
  templateUrl: './package.component.html',
  styleUrl: './package.component.scss'
})
export class PackageComponent {
 paginatedApiService  = inject(PaginatedApiService);
    router  = inject(Router); 
    sweetAlertService = inject(SweetAlertService);
    languageService = inject(LanguageService);
    lang: string='ar';
    packageService = inject(PackageService);
    translate = inject(TranslateService);
    totalPages: number;
    isAccordionToggled: boolean = false;
    filter:GetAllPackageRequest=<GetAllPackageRequest>{PageNumber:1,PageSize:6};
    pagedData: GetAllPackageReresponseData[];
   ngOnInit() {
    this.updatePagedData();
    this.languageService.language$.subscribe(lang=>{
      this.lang=lang;
    })  
   }
   updatePagedData() {
       this.paginatedApiService.fetchPaginatedData<GetAllPackageRequest, GetAllPackageReresponseData>(GetAllPackagePath, this.filter).subscribe(res => {
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
     this.router.navigate(['package/edit/'+Id])
   }  
   delete(item:GetAllPackageReresponseData){
     this.sweetAlertService.showConfirm(this.translate.instant('sweetAlert.delete'),` ${this.translate.instant('sweetAlert.deleteMsg',{name:item.nameAr,Id:item.id})}` ,'warning')
     .then(result=>{
       if(result.isConfirmed){
         this.ConfirmDelete(item.id)
       }
 
     });
   }
   ConfirmDelete(Id:number){
     this.packageService.DeletePackage(Id).subscribe(res=>{
       this.sweetAlertService.show(this.translate.instant('sweetAlert.DeleteSuccess'),'','success').then(res=>{
         this.updatePagedData()
       })
     });
   }
}
