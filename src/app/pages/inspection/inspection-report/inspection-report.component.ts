import { AsyncPipe, CommonModule, DatePipe, KeyValuePipe } from '@angular/common';
import { Component, inject, Pipe, PipeTransform } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CheckResult, InspectionDetails, InspectionDetailsResult, InspectionDetailsVisualResult } from 'src/app/core/api-client/models/Inspection.api.model';
import { InspectionService } from 'src/app/core/api-client/services/inspection.service';
import { LanguageService } from 'src/app/core/Service/language.service';
import html2pdf from 'html2pdf.js';
import AppUtils from 'src/app/core/Utilities/AppUtils';
import { ImageDirction } from 'src/app/core/data/inspections';
import { SuadiPalteImageComponent } from 'src/app/core/components/suadi-palte-image/suadi-palte-image.component';
import { LoadingService } from 'src/app/core/Service/loading.service';
import { forwardRef } from "@angular/core";

@Component({
  selector: 'app-inspection-report',
  imports: [DatePipe, KeyValuePipe, SuadiPalteImageComponent,
    CommonModule, forwardRef(() => GetResultPipe)],
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
  ImageDirction = ImageDirction;
  SummaryReport:boolean = false;
  constructor(){
    const InspectionID=Number(this.route.snapshot.paramMap.get('id'));
    this.SummaryReport=Boolean(this.route.snapshot.paramMap.get('isSummaryReport'));
    this.languageService.language$.subscribe(lang => {
      this.lang = lang;
    }); 
    this.inspectionService.GetInspectionDetailsById(InspectionID).subscribe(res => {
      this.InspectionDetails = res as InspectionDetails;
      this.groupedVisualResults = AppUtils.groupBy<InspectionDetailsVisualResult>(this.InspectionDetails?.visualResult.filter(x=> x) || [],"imageType");
      if(this.SummaryReport){
        const items= this.InspectionDetails?.results.filter(item=>item.checkResult.find(x => x.id === item.inspectionResult?.inspectionResultId).rate!=0)
          this.groupedResults=  AppUtils.groupBy<InspectionDetailsResult>(items,"categoryEn");
      }
      else{
      this.groupedResults=  AppUtils.groupBy<InspectionDetailsResult>(this.InspectionDetails?.results,"categoryEn");
      }
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
  getWarnningCount(items: InspectionDetailsResult[]) :number{
    const count= items.filter(item=>item.checkResult.find(x => x.id === item.inspectionResult?.inspectionResultId).rate!=0).length;
    console.log(count)
    return count
  }
}

@Pipe({name: 'getResult'})
export class GetResultPipe implements PipeTransform {
  transform(result: InspectionDetailsResult): CheckResult | undefined {
    return result.checkResult.find(x => x.id === result.inspectionResult?.inspectionResultId);
  }
}
