import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CreateModelRequest, Model } from '../models/model.api.model';

@Injectable({
  providedIn: 'root'
})
export class ModelService {

apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }
   GetModelById(Id: number) {
      return this.http.get(this.apiUrl + "Model/GetModelById?Id=" + Id);
    }
    CreateModel(model: CreateModelRequest) {
      return this.http.post(this.apiUrl + "Model/CreateModel", model);
    }
    EditModel(model: Model) {
      return this.http.put(this.apiUrl + "Model/EditModel", model);
    }
    DeleteModel(Id: number) {
      return this.http.delete(this.apiUrl + "Model/DeleteModel?Id=" + Id);
    }
}
