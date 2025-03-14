import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IconDirective } from '@ant-design/icons-angular';
import { TranslatePipe } from '@ngx-translate/core';
import { InspectionDetails } from 'src/app/core/api-client/models/Inspection.api.model';
import { InspectionService } from 'src/app/core/api-client/services/inspection.service';
import { LanguageService } from 'src/app/core/Service/language.service';

@Component({
  selector: 'app-inspection-details',
  imports: [TranslatePipe, CommonModule,FormsModule,IconDirective],
  templateUrl: './inspection-details.component.html',
  styleUrl: './inspection-details.component.scss'
})
export class InspectionDetailsComponent {
  lang: string = 'ar';
  InspectionID: number;
  InspectionDetails: InspectionDetails;
  languageService = inject(LanguageService);
  inspectionService = inject(InspectionService);
  router = inject(Router);
  route  = inject(ActivatedRoute);
  searchText: string = '';
  currentPage = 1;
  itemsPerPage = 10;
  cardView = true;
  constructor() {
    this.InspectionID=Number(this.route.snapshot.paramMap.get('id'));
  }
  ngOnInit(): void {   
    this.languageService.language$.subscribe(lang => {
      this.lang = lang;
    }); 
    this.getCheckById();
  }
  getCheckById() {
      this.inspectionService.GetInspectionDetailsById(this.InspectionID).subscribe(res => {
        this.InspectionDetails = res as InspectionDetails;

      });
  }
  changePage(step: number) {
    this.currentPage += step;
  }
  get filteredResults() {
    return this.InspectionDetails?.results.filter(item => 
       Object.values(item).some(value => 
        value.toString().toLowerCase().includes(this.searchText.toLowerCase())
      )
    ).slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
  }
  exportToCSV() {
    const headers = ['الفحص', 'الفئة', 'الفني', 'النتيجة', 'التعليق'];
    const csvData = this.InspectionDetails?.results.map(row => [row.checkAr, row.categoryAr, row.technicianAr, row.result, row.comment].join(','));
    csvData.unshift(headers.join(','));
    const csvContent = 'data:text/csv;charset=utf-8,' + csvData.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'inspection_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
