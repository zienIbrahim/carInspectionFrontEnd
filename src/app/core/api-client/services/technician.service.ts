import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CreateTechnicianRequest, Technician } from '../models/Technician.api.model';

@Injectable({ providedIn: 'root' })
export class TechnicianService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }
  GetTechnicianById(Id: number) {
    return this.http.get(this.apiUrl + "Technician/GetTechnicianById?Id=" + Id);
  }
  CreateTechnician(model: CreateTechnicianRequest) {
    return this.http.post(this.apiUrl + "Technician/CreateTechnician", model);
  }
  EditTechnician(model: Technician) {
    return this.http.put(this.apiUrl + "Technician/EditTechnician", model);
  }
  DeleteTechnician(Id: number) {
    return this.http.delete(this.apiUrl + "Technician/DeleteTechnician?Id=" + Id);
  }
}
