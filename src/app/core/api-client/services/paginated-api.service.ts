import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginatedResult } from '../models/pagnation.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaginatedApiService {  
  constructor(private http: HttpClient) {}
  apiUrl = environment.apiUrl;

fetchPaginatedData<TFilter , TData>(endpoint: string,params: TFilter){    
  let httpParams = new HttpParams();
  Object.keys(params).forEach(key => {
    const value = (params as any)[key]; // Ensure correct type access
    if (value !== null && value !== undefined) {
      httpParams = httpParams.append(key, value.toString()); // ✅ Reassign httpParams
    }
  });

  return this.http.get<PaginatedResult<TData>>(this.apiUrl+endpoint, { params: httpParams });
}
}
