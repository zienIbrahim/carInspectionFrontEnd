import { AsyncPipe, CommonModule, DatePipe, KeyValuePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { InspectionDetails, InspectionDetailsResult, InspectionDetailsVisualResult } from 'src/app/core/api-client/models/Inspection.api.model';
import { InspectionService } from 'src/app/core/api-client/services/inspection.service';
import { LanguageService } from 'src/app/core/Service/language.service';
import html2pdf from 'html2pdf.js';
import AppUtils from 'src/app/core/Utilities/AppUtils';
import { ImageDirction } from 'src/app/core/data/inspections';

@Component({
  selector: 'app-inspection-report',
  imports: [DatePipe,KeyValuePipe,CommonModule],
  templateUrl: './inspection-report.component.html',
  styleUrl: './inspection-report.component.scss'
})
export class InspectionReportComponent {
  router = inject(Router);
  route  = inject(ActivatedRoute);
  languageService = inject(LanguageService);
  inspectionService = inject(InspectionService);
  lang: string = 'ar';
  InspectionDetails: InspectionDetails;
  groupedVisualResults: { [key: number]: InspectionDetailsVisualResult[] } = {};
  ImageDirction = ImageDirction
  constructor(){
    const InspectionID=Number(this.route.snapshot.paramMap.get('id'));
    this.languageService.language$.subscribe(lang => {
      this.lang = lang;
    }); 
    this.inspectionService.GetInspectionDetailsById(InspectionID).subscribe(res => {
      this.InspectionDetails = res as InspectionDetails;
      this.groupedVisualResults = AppUtils.groupBy<InspectionDetailsVisualResult>(this.InspectionDetails?.visualResult || [],"imageType");

      console.log('results: ', this.InspectionDetails);

    });
  }
  get groupedResults() {
     if(!this.InspectionDetails?.results) return null;
    return AppUtils.groupBy<InspectionDetailsResult>(this.InspectionDetails?.results,"categoryEn")
  }
  print() {
    window.print();
  }
  getResultData(result: InspectionDetailsResult) {
   return result.checkResult.find(x => x.id == result.inspectionResult.inspectionResultId)
  }
  exportToPDF() {
    const element = document.getElementById('report-container');
    const options = {
      margin: 10,
      pagebreak: {
        mode: ['avoid-all', 'css', 'legacy']
      },
      filename: `Car_Inspection_Report-${this.InspectionDetails.id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, logging: true, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(element).set(options).save();
  } 
  getImageDirectionLabel(dir: number): string {
    return ['Front', 'Back', 'Left', 'Right'][dir] ?? 'Unknown';
  }
  getImageTypeLabel(type: number): string {
    return type === 1 ? 'Vehicle Images' : 'Visual Check Images';
  }
 
}
