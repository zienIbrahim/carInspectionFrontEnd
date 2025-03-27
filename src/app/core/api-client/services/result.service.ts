import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CreateResultRequest, Result } from '../models/result.api.model';

@Injectable({
  providedIn: 'root'
})
export class ResultService {
  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {
  }
  GetResultById(Id: number) {
    return this.http.get(this.apiUrl + "Result/GetResultById?Id=" + Id);
  }
  CreateResult(model: CreateResultRequest) {
    return this.http.post(this.apiUrl + "Result/CreateResult", model);
  }
  EditResult(model: Result) {
    return this.http.put(this.apiUrl + "Result/EditResult", model);
  }
  DeleteResult(Id: number) {
    return this.http.delete(this.apiUrl + "Result/DeleteResult?Id=" + Id);
  }
}
