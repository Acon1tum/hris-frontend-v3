import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface UserDetails {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  contact_number?: string;
  phone?: string;
}

export interface UserDetailsResponse {
  success: boolean;
  data?: UserDetails;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Fetch current user details from the database
   */
  getCurrentUserDetails(): Observable<UserDetails> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('No authenticated user found');
    }

    // Check if user is an applicant
    if (currentUser.role === 'Applicant') {
      // Use job portal endpoint for applicants
      return this.http.get<{ success: boolean; data: any }>(`${environment.apiUrl}/job-portal/current-profile`)
        .pipe(
          map(response => {
            if (response.success && response.data) {
              // Map job applicant data to UserDetails format
              return {
                id: response.data.id,
                first_name: response.data.first_name,
                middle_name: response.data.middle_name,
                last_name: response.data.last_name,
                email: response.data.email,
                contact_number: response.data.phone,
                phone: response.data.phone
              };
            } else {
              throw new Error('Failed to fetch applicant details');
            }
          })
        );
    } else {
      // Use regular user endpoint for other roles
      return this.http.get<UserDetailsResponse>(`${environment.apiUrl}/system/users/current-user-details`)
        .pipe(
          map(response => {
            if (response.success && response.data) {
              return response.data;
            } else {
              throw new Error(response.message || 'Failed to fetch user details');
            }
          })
        );
    }
  }

  /**
   * Fetch user details by user ID
   */
  getUserDetailsById(userId: string): Observable<UserDetails> {
    return this.http.get<UserDetailsResponse>(`${environment.apiUrl}/system/users/${userId}/details`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          } else {
            throw new Error(response.message || 'Failed to fetch user details');
          }
        })
      );
  }
} 