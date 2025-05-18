// angular import
import { ChangeDetectorRef, Component, inject, Input, OnChanges, OnInit, SimpleChanges, viewChild } from '@angular/core';

// project import

// third party
import { NgApexchartsModule, ChartComponent, ApexOptions } from 'ng-apexcharts';

@Component({
  selector: 'app-monthly-bar-chart',
  imports: [NgApexchartsModule],
  templateUrl: './monthly-bar-chart.component.html',
  styleUrl: './monthly-bar-chart.component.scss'
})
export class MonthlyBarChartComponent implements OnInit, OnChanges {
  private cd = inject(ChangeDetectorRef)

  // public props
  chart = viewChild.required<ChartComponent>('chart');
  @Input() title: string;
  @Input() data: { year: number; month: number; count: number }[] = [];
  chartOptions: Partial<ApexOptions> = {
    chart: {
      height: 450,
      type: 'bar',
      toolbar: {
        show: false
      },
      background: 'transparent'
    },
    dataLabels: {
      enabled: false
    },
    colors: ['#1677ff', '#0050b3'],
    series: [],
    stroke: {
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      categories: [],
      labels: {
        style: {
          colors: [
            '#8c8c8c',
            '#8c8c8c',
            '#8c8c8c',
            '#8c8c8c',
            '#8c8c8c',
            '#8c8c8c',
            '#8c8c8c',
            '#8c8c8c',
            '#8c8c8c',
            '#8c8c8c',
            '#8c8c8c',
            '#8c8c8c'
          ]
        }
      },
      axisBorder: {
        show: true,
        color: '#f0f0f0'
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: ['#8c8c8c']
        }
      }
    },
    grid: {
      strokeDashArray: 0,
      borderColor: '#f5f5f5'
    },
    theme: {
      mode: 'light'
    }
  };
  // life cycle hook
  ngOnInit() {
     this.updateChartOptions();

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.updateChartOptions();
    }
  }
  private updateChartOptions(): void {
    if (!this.data || this.data.length === 0)
      return;
    this.chartOptions = {
      ...this.chartOptions, // keep other existing options
      series: [
        {
          name: 'Inspections',
          data: this.data.map(x => x.count)
        }
      ],
      xaxis: {
        categories: this.data.map(x => `${x.month}/${x.year}`)
      }
    };
    
  }
}
