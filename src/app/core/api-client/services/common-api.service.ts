import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonApiService {
  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {
    
  }
  GetCategoryList(){
    return this.http.get(this.apiUrl + "Common/GetCategoryList");
  }
  GetCheckPointList(){
    return this.http.get(this.apiUrl + "Common/GetCheckPointList");
  }
  GetUsersList(){
    return this.http.get(this.apiUrl + "Common/GetUsersList");
  }
  GetPackageList(){
    return this.http.get(this.apiUrl + "Common/GetPackageList");
  }
}
