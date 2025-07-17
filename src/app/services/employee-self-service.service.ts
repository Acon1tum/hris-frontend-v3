import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MyProfileResponse } from '../interfaces/my-profile.interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeeSelfService {
  private apiUrl = `${environment.apiUrl}/employee-self-service`;

  constructor(private http: HttpClient) {}

  fetchMyProfile(): Observable<MyProfileResponse> {
    return this.http.get<MyProfileResponse>(`${this.apiUrl}/my-profile`);
  }

  updateMyProfile(payload: any): Observable<MyProfileResponse> {
    return this.http.put<MyProfileResponse>(`${this.apiUrl}/my-profile`, payload);
  }
} 