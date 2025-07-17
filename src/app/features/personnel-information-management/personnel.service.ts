import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map, catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  hireDate: string;
  status: string;
  profileImage?: string;
}

@Injectable({ providedIn: 'root' })
export class PersonnelService {
  private baseUrl = `${environment.apiUrl}/personnel`;

  constructor(private http: HttpClient) {}

  getDashboardEmployees(page = 1, limit = 10, search = ''): Observable<{ data: Employee[]; pagination: any }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    if (search) params = params.set('search', search);
    return this.http.get<{ data: Employee[]; pagination: any }>(`${this.baseUrl}/dashboard-employees`, { params });
  }

  getPersonnel(page = 1, limit = 10, search = ''): Observable<{ data: Employee[]; pagination: any }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    if (search) params = params.set('search', search);

    return this.http.get<any>(`${this.baseUrl}`, { params }).pipe(
      map(response => ({
        data: response.data.map((personnel: any) => this.transformPersonnelData(personnel)),
        pagination: response.pagination
      })),
      catchError(this.handleError)
    );
  }

  private transformPersonnelData(data: any): Employee {
    return {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.user?.email || '',
      department: data.department?.department_name || '',
      position: data.designation || '',
      hireDate: data.date_hired ? new Date(data.date_hired).toISOString().slice(0, 10) : '',
      status: data.user?.status || '',
      profileImage: data.user?.profile_picture || data.employeeSelfServiceProfile?.profilePicture || ''
    };
  }

  private handleError = (error: HttpErrorResponse) => {
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error('Personnel Service Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  };
} 