import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ApexChart, ApexNonAxisChartSeries, ApexOptions, ApexResponsive, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-pie-chart',
  imports: [NgApexchartsModule],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss'
})
export class PieChartComponent implements OnChanges{
  @ViewChild("chart") chart: ChartComponent;
  @Input() labels: string[] = [];
  @Input() series: number[] =  [];
  @Input() colors: string[] = [];
  @Input() title: string;
  public chartOptions : Partial<ApexOptions>= {
    series: [...this.series],
    colors: [...this.colors],
    chart: {
      width: 450,
      type: "pie"
    },
    labels: [...this.labels],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: "bottom"
          }
        }
      }
    ]
  };
  constructor() {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['series'] && this.series.length > 0) {
      this.updateChartOptions();
    }
  }
  ngOnInit() {
    this.updateChartOptions();
  }
  private updateChartOptions(): void {
    this.chartOptions.series = [...this.series];
    this.chartOptions.labels = [...this.labels];
    this.chartOptions.colors = [...this.colors];
  }
}

