// angular import
import { Component, inject } from '@angular/core';
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
import { DashboardQuery } from '../core/api-client/models/Dashboard.model';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    CardComponent,
    IconDirective,
    MonthlyBarChartComponent,
    IncomeOverviewChartComponent,
    AnalyticsChartComponent,
    SalesReportChartComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  private iconService = inject(IconService);
  private commonApiService = inject(CommonApiService);
  dashboardQuery:DashboardQuery = <DashboardQuery>{};
  // constructor
  constructor() {
    const startDate = moment(new Date()).add('M', -3).format('MM-DD-YYYY HH:mm:ss');
    const endDate = moment(new Date()).format('MM-DD-YYYY HH:mm:ss');
    this.commonApiService.GetDashboard(startDate,endDate).subscribe((res:any) => {
      this.dashboardQuery = res;
      this.AnalyticEcommerce[0] =
      {
        title: 'Total Page Views',
        amount: String(this.dashboardQuery.totalInspections),
        background: 'bg-light-primary ',
        border: 'border-primary',
        icon: 'rise',
        percentage: '59.3%',
        color: 'text-primary',
        number: '35,000'
      } ;
      this.AnalyticEcommerce[1] =
      {
        title: 'Total Users',
        amount: String(this.dashboardQuery.completedInspections),
        background: 'bg-light-primary ',
        border: 'border-primary',
        icon: 'rise',
        percentage: '70.5%',
        color: 'text-primary',
        number: '8,900'
      } ;
      this.AnalyticEcommerce[2] =
      {
        title: 'Total Order',
        amount: String(this.dashboardQuery.pendingInspections),
        background: 'bg-light-warning ',
        border: 'border-warning',
        icon: 'fall',
        percentage: '27.4%',
        color: 'text-warning',
        number: '1,943'
      };
      this.AnalyticEcommerce[3] =
      {
        title: 'Total Sales',
        amount: String(this.dashboardQuery.partiallyCompleted),
        background: 'bg-light-warning ',
        border: 'border-warning',
        icon: 'fall',
        percentage: '27.4%',
        color: 'text-warning',
        number: '$20,395'
      };
    });
    this.iconService.addIcon(...[RiseOutline, FallOutline, SettingOutline, GiftOutline, MessageOutline]);
  }

  recentOrder = [];

  AnalyticEcommerce:{
    title: string;
    amount: string;
    background: string;
    border: string;
    icon: string;
    percentage: string;
    color: string;
    number: string;
}[];

  transaction = [
    {
      background: 'text-success bg-light-success',
      icon: 'gift',
      title: 'Order #002434',
      time: 'Today, 2:00 AM',
      amount: '+ $1,430',
      percentage: '78%'
    },
    {
      background: 'text-primary bg-light-primary',
      icon: 'message',
      title: 'Order #984947',
      time: '5 August, 1:45 PM',
      amount: '- $302',
      percentage: '8%'
    },
    {
      background: 'text-danger bg-light-danger',
      icon: 'setting',
      title: 'Order #988784',
      time: '7 hours ago',
      amount: '- $682',
      percentage: '16%'
    }
  ];
}
