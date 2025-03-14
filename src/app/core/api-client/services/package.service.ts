import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CreatePackageRequest, Package } from '../models/Package.api.model';

@Injectable({ providedIn: 'root' })
export class PackageService{
  apiUrl = environment.apiUrl;
    
      constructor(private http: HttpClient) {
      }
      GetPackageById(Id: number) {
        return this.http.get(this.apiUrl + "Package/GetPackageById?Id=" + Id);
      }
      CreatePackage(model: CreatePackageRequest) {
        return this.http.post(this.apiUrl + "Package/CreatePackage", model);
      }
      EditPackage(model: Package) {
        return this.http.put(this.apiUrl + "Package/EditPackage", model);
      }
      DeletePackage(Id: number) {
        return this.http.delete(this.apiUrl + "Package/DeletePackage?Id=" + Id);
      }

}