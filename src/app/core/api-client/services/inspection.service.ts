import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CreateInspectionRequest, CreateOrUpdateInspectionResultDto, Inspection } from '../models/Inspection.api.model';

@Injectable({
  providedIn: 'root'
})
export class InspectionService {
 apiUrl = environment.apiUrl;
    
      constructor(private http: HttpClient) {
      }
      GetInspectionById(Id: number) {
        return this.http.get(this.apiUrl + "Inspection/GetInspectionById?Id=" + Id);
      }
      GetInspectionDetailsById(Id: number) {
        return this.http.get(this.apiUrl + "Inspection/GetInspectionDetailsById?InspectionID=" + Id);
      }
      GetInspectionCheckListById(Id: number) {
        return this.http.get(this.apiUrl + "Inspection/GetInspectionCheckListById?InspectionID=" + Id);
      }
      CreateInspection(model: CreateInspectionRequest) {
        return this.http.post(this.apiUrl + "Inspection/CreateInspection", model);
      }
      GetChecksResultOptionByCheckIDS(model: {checkIDs: number[]}) {
        return this.http.post(this.apiUrl + "Inspection/GetChecksResultOptionByCheckIDS", model);
      }
      CreateOrUpdateInspectionResult(model: CreateOrUpdateInspectionResultDto) {
        return this.http.post(this.apiUrl + "Inspection/CreateOrUpdateInspectionResult", model);
      }
      EditInspection(model: Inspection) {
        return this.http.put(this.apiUrl + "Inspection/EditInspection", model);
      }
      DeleteInspection(Id: number) {
        return this.http.delete(this.apiUrl + "Inspection/DeleteInspection?Id=" + Id);
      }
}
