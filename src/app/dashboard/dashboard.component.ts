// angular import
import { Component, inject,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';



import { MonthlyBarChartComponent } from 'src/app/theme/shared/apexchart/monthly-bar-chart/monthly-bar-chart.component';
import { IncomeOverviewChartComponent } from 'src/app/theme/shared/apexchart/income-overview-chart/income-overview-chart.component';
import { AnalyticsChartComponent } from 'src/app/theme/shared/apexchart/analytics-chart/analytics-chart.component';
import { SalesReportChartComponent } from 'src/app/theme/shared/apexchart/sales-report-chart/sales-report-chart.component';
import moment from 'moment';
// icons
import { IconService, IconDirective } from '@ant-design/icons-angular';
import { FallOutline, GiftOutline, MessageOutline, RiseOutline, SettingOutline } from '@ant-design/icons-angular/icons';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { CommonApiService } from '../core/api-client/services/common-api.service';
import { DashboardQuery, InspectionsByMonth } from '../core/api-client/models/Dashboard.model';
import { TranslatePipe } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { LanguageService } from '../core/Service/language.service';
import { InspectionStatusOption } from '../core/data/inspections';
import { TagModule } from 'primeng/tag';
import { PieChartComponent } from '../theme/shared/apexchart/pie-chart/pie-chart.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    CardComponent,
    TranslatePipe,
    TagModule,PieChartComponent,
    MonthlyBarChartComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  private iconService = inject(IconService);
  private commonApiService = inject(CommonApiService);
  private router = inject(Router);
  private languageService = inject(LanguageService);
  dashboardQuery:DashboardQuery = <DashboardQuery>{};
  InspectionStatusOptionData=InspectionStatusOption;
  private cd=inject(ChangeDetectorRef) 
  AnalyticEcommerce:{
    title: string;
    amount: string;
    background: string;
    icon: string;
    number: string;
}[];
recentOrder = [];
  lang:string = 'ar';
  pieLabels = [];
  pieSeries = [];
  barChartData:InspectionsByMonth[] =[];
  pieColors = ['#1677ff', '#0050b3', '#8c8c8c', '#8c8c8c'];
  // constructor
  constructor() {
    const startDate = moment(new Date()).add(-3, 'M').format('MM-DD-YYYY HH:mm:ss');
    const endDate = moment(new Date()).format('MM-DD-YYYY HH:mm:ss');
    this.commonApiService.GetDashboard(startDate,endDate).subscribe((res:any) => {
      this.dashboardQuery = res;
      this.AnalyticEcommerce[0].amount = String(this.dashboardQuery.totalInspections);
      this.AnalyticEcommerce[1].amount = String(this.dashboardQuery.completedInspections);
      this.AnalyticEcommerce[2].amount = String(this.dashboardQuery.partiallyCompleted);
      this.AnalyticEcommerce[3].amount = String(this.dashboardQuery.pendingInspections);
      this.initPieChart();
      this.initBarChart();
    });
    this.languageService.language$.subscribe((lang) => {
      this.lang=lang
      this.initPieChart();
      this.initBarChart();
    });
    this.iconService.addIcon(...[RiseOutline, FallOutline, SettingOutline, GiftOutline, MessageOutline]);

    this.AnalyticEcommerce = [
      {
        title: 'dashboard.totalInspections',
        amount: '4,42,236',
        background: 'card-border-bg-info ',
        icon: 'bi-list-check	',
        number: '35,000'
      },
      {
        title: 'dashboard.completedInspections',
        amount: '78,250',
        background: 'card-border-bg-teal ',
        icon: 'bi-check-circle-fill	',
        number: '8,900'
      },
      {
        title: 'dashboard.partiallyCompletedInspections',
        amount: '18,800',
        background: 'card-border-bg-secondary ',
        icon: 'bi-clock-fill	',
        number: '1,943'
      },
      {
        title: 'dashboard.pendingInspections',
        amount: '$35,078',
        background: 'card-border-bg-primary ',
        icon: 'bi-hourglass-split',
        number: '$20,395'
      }
    ];
  }
  initBarChart() {
    this.barChartData=this.dashboardQuery.inspectionsByMonth;

  }
  initPieChart() {
    this.pieLabels=[];
    this.pieColors=[];
    this.pieSeries=[];
    this.pieLabels = [ this.lang=='ar'?this.InspectionStatusOptionData[3]?.nameAr:this.InspectionStatusOptionData[3]?.nameEn,
    this.lang=='ar'?this.InspectionStatusOptionData[2]?.nameAr:this.InspectionStatusOptionData[2]?.nameEn,
    this.lang=='ar'?this.InspectionStatusOptionData[1]?.nameAr:this.InspectionStatusOptionData[1]?.nameEn];
    this.pieColors = [this.InspectionStatusOptionData[3]?.color, this.InspectionStatusOptionData[2]?.color, this.InspectionStatusOptionData[1]?.color];
    this.pieSeries = [this.dashboardQuery.completedInspections, this.dashboardQuery.partiallyCompleted, this.dashboardQuery.pendingInspections]; 
  }
  openInspectionDetails = (id: number) => {
    this.router.navigate(['/inspection/details/'+id])
  }
}
