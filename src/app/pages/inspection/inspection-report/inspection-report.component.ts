import { AsyncPipe, DatePipe, KeyValuePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { InspectionDetails, InspectionDetailsResult } from 'src/app/core/api-client/models/Inspection.api.model';
import { InspectionService } from 'src/app/core/api-client/services/inspection.service';
import { LanguageService } from 'src/app/core/Service/language.service';
import html2pdf from 'html2pdf.js';
import AppUtils from 'src/app/core/Utilities/AppUtils';

@Component({
  selector: 'app-inspection-report',
  imports: [DatePipe,KeyValuePipe],
  templateUrl: './inspection-report.component.html',
  styleUrl: './inspection-report.component.scss'
})
export class InspectionReportComponent {
  router = inject(Router);
  route  = inject(ActivatedRoute);
  languageService = inject(LanguageService);
  inspectionService = inject(InspectionService);
  InspectionDetails: InspectionDetails;
  constructor(){
    const InspectionID=Number(this.route.snapshot.paramMap.get('id'));
    this.inspectionService.GetInspectionDetailsById(InspectionID).subscribe(res => {
      this.InspectionDetails = res as InspectionDetails;
      console.log('results: ', this.InspectionDetails);

    });
  }
  get groupedResults() {
    return AppUtils.groupBy<InspectionDetailsResult>(this.InspectionDetails.results,"categoryEn")
  }

  print() {
    window.print();
  }
    // Helper function to group results by category

    // Export to PDF functionality
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
}
