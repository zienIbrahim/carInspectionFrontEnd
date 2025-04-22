import { AsyncPipe, CommonModule, DatePipe, KeyValuePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { InspectionDetails, InspectionDetailsResult, InspectionDetailsVisualResult } from 'src/app/core/api-client/models/Inspection.api.model';
import { InspectionService } from 'src/app/core/api-client/services/inspection.service';
import { LanguageService } from 'src/app/core/Service/language.service';
import html2pdf from 'html2pdf.js';
import AppUtils from 'src/app/core/Utilities/AppUtils';
import { ImageDirction } from 'src/app/core/data/inspections';
import { TranslatePipe } from '@ngx-translate/core';
import { SuadiPalteImageComponent } from 'src/app/core/components/suadi-palte-image/suadi-palte-image.component';
import { LoadingService } from 'src/app/core/Service/loading.service';

@Component({
  selector: 'app-inspection-report',
  imports: [DatePipe,KeyValuePipe,SuadiPalteImageComponent
  ,CommonModule],
  templateUrl: './inspection-report.component.html',
  styleUrl: './inspection-report.component.scss'
})
export class InspectionReportComponent {
  router = inject(Router);
  route  = inject(ActivatedRoute);
  languageService = inject(LanguageService);
  inspectionService = inject(InspectionService);
  loadingService = inject(LoadingService);
  lang: string = 'ar';
  isloading=false;
  InspectionDetails: InspectionDetails;
  groupedVisualResults: { [key: number]: InspectionDetailsVisualResult[] } = {};
  groupedResults: Record<any, InspectionDetailsResult[]> = {};
  ImageDirction = ImageDirction
  constructor(){
    const InspectionID=Number(this.route.snapshot.paramMap.get('id'));
    this.languageService.language$.subscribe(lang => {
      this.lang = lang;
    }); 
    this.inspectionService.GetInspectionDetailsById(InspectionID).subscribe(res => {
      this.InspectionDetails = res as InspectionDetails;
      this.groupedVisualResults = AppUtils.groupBy<InspectionDetailsVisualResult>(this.InspectionDetails?.visualResult || [],"imageType");
    this.groupedResults=  AppUtils.groupBy<InspectionDetailsResult>(this.InspectionDetails?.results,"categoryEn")

      console.log('results: ', this.InspectionDetails);

    });
  }

  print() {
    window.print();
  }
  getResultData(result: InspectionDetailsResult) {
   return result.checkResult.find(x => x.id == result.inspectionResult?.inspectionResultId)
  }
  exportToPDF() {
    this.loadingService.show();
        const element = document.getElementById('report-container');
    const options = {
      margin: 0,
      pagebreak: {
        mode: ['avoid-all', 'css', 'legacy'],
      },
      html2canvas: {
        scale: 3, 
        useCORS: true,
        logging: true
      },
      filename: `Car_Inspection_Report-${this.InspectionDetails.id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(element).set(options).toPdf().get('pdf').then((pdf) =>{
      this.loadingService.hide();
      window.open(pdf.output('bloburl'), '_blank');

    });

  } 
  getImageTypeLabel(type: number): string {
    return type === 1 ? 'Vehicle Images' : 'Visual Check Images';
  }
}
