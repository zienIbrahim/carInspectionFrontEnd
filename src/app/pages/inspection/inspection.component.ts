import { CommonModule, DatePipe } from '@angular/common';
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
import { DatePicker } from 'primeng/datepicker';
import { AuthenticationService } from 'src/app/core/api-client/services/authentication.service';
import { UserRoles } from "src/app/core/data/UserRole";
import moment from 'moment';
import { TableModule } from 'primeng/table';
import { InspectionStatusOption } from 'src/app/core/data/inspections';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-inspection',
  imports: [
    NgbPaginationModule,
    TagModule,
    CommonModule,
    TableModule,
    PanelModule,
    FormsModule,
    TranslatePipe,
    DatePicker,
    DatePipe,
    RouterModule,
    ButtonModule,
    IconDirective,
    InputTextModule
  ],
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
  public _authService = inject(AuthenticationService);
  userRoles=UserRoles;
  isAccordionToggled: boolean = false;
  InspectionStatusOptionData=InspectionStatusOption;
  ngOnInit() {
    this.updatePagedData();
    this.languageService.language$.subscribe(lang => {
      this.lang = lang;
    });
  }
  updatePagedData() {
    if(this.filter.From)
      this.filter.From = this.formatDateTime(this.filter.From);
    if(this.filter.To)
      this.filter.To = this.formatDateTime(this.filter.To);
    this.paginatedApiService.fetchPaginatedData<GetAllInspectionRequest, GetAllInspectionReresponseData>(GetAllInspectionPath, this.filter).subscribe(res => {
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
  Edit(Id: number) {
    this.router.navigate(['Inspection/edit/' + Id])
  }
  ConfirmDelete(Id: number) {
    this.InspectionService.DeleteInspection(Id).subscribe(res => {
      this.sweetAlertService.show(this.translate.instant('sweetAlert.DeleteSuccess'), '', 'success').then(res => {
        this.updatePagedData()
      })
    });
  }
  formatDateTime(date: any) {
    return (moment(date)).format('MM-DD-YYYY HH:mm:ss')
  }
  details(Id:number){
    this.router.navigate(['inspection/details/'+Id])
  }
  
}
