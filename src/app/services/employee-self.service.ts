import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserProfile {
  general: {
    firstName: string;
    middleName: string;
    lastName: string;
    fullName: string;
    birthdate: string;
    contactNumber: string;
    address: string;
    email: string;
    gender: string;
    civilStatus: string;
    citizenship: string;
  };
  employment: {
    employmentType: string;
    designation: string;
    department: string;
    appointmentDate: string;
    startDate: string;
    employmentStatus: string;
    jobLevel: string;
    jobGrade: string;
  };
  membership: {
    gsis: string;
    pagibig: string;
    philhealth: string;
    sss: string;
  };
  other: {
    dependents: string;
    emergencyContactName: string;
    emergencyContactNumber: string;
    emergencyContactRelationship: string;
  };
}

export interface EmployeeDocument {
  id: string;
  personnelId: string;
  title: string;
  description: string | null;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  category: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UploadDocumentRequest {
  title: string;
  description?: string;
  category?: string;
  file: File;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeSelfService {
  private apiUrl = `${environment.apiUrl}/employee-self-service`;

  constructor(private http: HttpClient) {}

  // Profile management
  fetchMyProfile(): Observable<{success: boolean; data: UserProfile; message: string}> {
    return this.http.get<{success: boolean; data: UserProfile; message: string}>(`${this.apiUrl}/my-profile`);
  }

  updateMyProfile(profileData: Partial<UserProfile>): Observable<{success: boolean; message: string}> {
    return this.http.put<{success: boolean; message: string}>(`${this.apiUrl}/my-profile`, profileData);
  }

  // Document management
  getMyDocuments(): Observable<{success: boolean; data: EmployeeDocument[]; message: string}> {
    return this.http.get<{success: boolean; data: EmployeeDocument[]; message: string}>(`${this.apiUrl}/my-documents`);
  }

  uploadDocument(uploadData: UploadDocumentRequest): Observable<{success: boolean; data: EmployeeDocument; message: string}> {
    const formData = new FormData();
    formData.append('file', uploadData.file);
    formData.append('title', uploadData.title);
    if (uploadData.description) {
      formData.append('description', uploadData.description);
    }
    if (uploadData.category) {
      formData.append('category', uploadData.category);
    }

    return this.http.post<{success: boolean; data: EmployeeDocument; message: string}>(`${this.apiUrl}/upload-document`, formData);
  }

  deleteDocument(documentId: string): Observable<{success: boolean; message: string}> {
    return this.http.delete<{success: boolean; message: string}>(`${this.apiUrl}/documents/${documentId}`);
  }

  downloadDocument(document: EmployeeDocument): void {
    const downloadUrl = `${environment.apiUrl}${document.fileUrl}`;
    const link = window.document.createElement('a');
    link.href = downloadUrl;
    link.download = document.title;
    link.click();
  }
} 