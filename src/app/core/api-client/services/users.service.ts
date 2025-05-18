import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CreateResultRequest, Result } from '../models/result.api.model';
import { CreateUserRequest, UpdateUserRequest } from '../models/Users.api.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {
  }
  CreateResult(model: CreateUserRequest) {
    return this.http.post(this.apiUrl + "Users/CreateUser", model);
  }
  UpdateUser(model: UpdateUserRequest) {
    return this.http.put(this.apiUrl + "Users/UpdateUser", model);
  }
  DeleteUser(Id: number) {
    return this.http.delete(this.apiUrl + "Users/DeleteUser?id=" + Id);
  }}
