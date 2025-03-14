import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MasterTableService {
  private apiUrl = environment.apiUrl;

  constructor(public http: HttpClient) {
  }
  GetOrdersList(filter: any) {
    let params = new HttpParams();
    params = params.append('PageNumber', String(filter.pageNumber));
    params = params.append('PageSize', String(filter.pageSize));
    if (filter.planId) {
      params = params.append('PlanId', filter.planId);
    }
    if (filter.tenantId) {
      params = params.append('TenantId', filter.tenantId);
    }
    if (filter.userId) {
      params = params.append('UserId', filter.userId);
    }
    if (filter.from) {
      params = params.append('From', filter.from);
    }
    if (filter.to) {
      params = params.append('To', filter.to);
    }
    if (filter.status) {
      params = params.append('Status', filter.status);
    }
    if (filter.orderType) {
      params = params.append('OrderType', filter.orderType);
    }
    return this.http.get(this.apiUrl + "Order/GetOrdersList", { params });
  }
}
