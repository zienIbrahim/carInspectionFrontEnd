import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CreateMakeRequest, Make } from '../models/make.api.model';

@Injectable({
  providedIn: 'root'
})
export class MakeService {

apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  GetMakeById(Id: number) {
    return this.http.get(this.apiUrl + "Make/GetMakeById?Id=" + Id);
  }
  CreateMake(model: CreateMakeRequest) {
    return this.http.post(this.apiUrl + "Make/CreateMake", model);
  }
  EditMake(model: Make) {
    return this.http.put(this.apiUrl + "Make/EditMake", model);
  }
  DeleteMake(Id: number) {
    return this.http.delete(this.apiUrl + "Make/DeleteMake?Id=" + Id);
  }
}
