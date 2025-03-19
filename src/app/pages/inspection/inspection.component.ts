import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbPaginationModule, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { GetAllInspectionRequest, GetAllInspectionReresponseData } from 'src/app/core/api-client/models/Inspection.api.model';
import { GetAllInspectionPath } from 'src/app/core/api-client/services/apiRoutPath';
import { InspectionService } from 'src/app/core/api-client/services/inspection.service';
import { PaginatedApiService } from 'src/app/core/api-client/services/paginated-api.service';
import { LanguageService } from 'src/app/core/Service/language.service';
import { SweetAlertService } from 'src/app/core/Service/sweet-alert.service';
import { IconDirective } from '@ant-design/icons-angular';
import { PanelModule } from 'primeng/panel';
import { FormsModule } from '@angular/forms';
import { DateTimePickerComponent } from 'src/app/core/components/date-time-picker/date-time-picker.component';

@Component({
  selector: 'app-inspection',
  imports: [NgbPaginationModule,PanelModule,FormsModule, TranslatePipe,DateTimePickerComponent, DatePipe, RouterModule, ButtonModule, IconDirective,InputTextModule],
  templateUrl: './inspection.component.html',
  styleUrl: './inspection.component.scss'
})
export class InspectionComponent {
  paginatedApiService = inject(PaginatedApiService);
  router = inject(Router);
  route  = inject(ActivatedRoute);
  sweetAlertService = inject(SweetAlertService);
  languageService = inject(LanguageService);
  lang: string = 'ar';
  InspectionService = inject(InspectionService);
  translate = inject(TranslateService);
  totalPages: number;
  filter: GetAllInspectionRequest = <GetAllInspectionRequest>{ PageNumber: 1, PageSize: 6 };
  pagedData: GetAllInspectionReresponseData[];
  time: NgbTimeStruct = { hour: 0, minute: 0, second: 0 };
  visibleFilters = false;

  ngOnInit() {
    this.updatePagedData();
    this.languageService.language$.subscribe(lang => {
      this.lang = lang;
    })
  }
  updatePagedData() {
    this.paginatedApiService.fetchPaginatedData<GetAllInspectionRequest, GetAllInspectionReresponseData>(GetAllInspectionPath, this.filter).subscribe(res => {
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
  Edit(Id: number) {
    this.router.navigate(['Inspection/edit/' + Id])
  }
  // delete(item:GetAllInspectionReresponseData){
  //   this.sweetAlertService.showConfirm(this.translate.instant('sweetAlert.delete'),` ${this.translate.instant('sweetAlert.deleteMsg',{name:item.nameAr,Id:item.id})}` ,'warning')
  //   .then(result=>{
  //     if(result.isConfirmed){
  //       this.ConfirmDelete(item.id)
  //     }

  //   });
  // }
  ConfirmDelete(Id: number) {
    this.InspectionService.DeleteInspection(Id).subscribe(res => {
      this.sweetAlertService.show(this.translate.instant('sweetAlert.DeleteSuccess'), '', 'success').then(res => {
        this.updatePagedData()
      })
    });
  }
  formatDate(data: any) {
    if (data.month.toString().length < 2) {
      data.month = '0' + data.month;
    }
    if (data.day.toString().length < 2) {
      data.day = '0' + data.day;
    }
    return [data.year, data.month, data.day].join('-');
  }
  formatDateTime(date: any) {
    let dd = this.formatDate(date);
    return dd + "T" + [this.time.hour, this.time.hour, this.time.second].join(':')
  }
  details(Id:number){
    this.router.navigate(['inspection/details/'+Id])
  }
  process(Id:number){
    this.router.navigate(['inspection/process/'+Id])
  }
 
}
