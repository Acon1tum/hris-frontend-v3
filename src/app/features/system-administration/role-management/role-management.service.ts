import { Injectable } from '@angular/core';
import { Observable, throwError, forkJoin, of } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Permission } from '../../../interfaces/auth.interface';

export interface Role {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  role_permissions?: RolePermission[];
  userCount?: number;
  permissions?: Permission[];
}

export interface RolePermission {
  id: string;
  role_id: string;
  permission: Permission;
  created_at: string;
}

export interface RoleCreateRequest {
  name: string;
  description?: string;
  permissions?: Permission[];
}

export interface RoleUpdateRequest {
  name?: string;
  description?: string;
  is_active?: boolean;
  permissions?: Permission[];
}

export interface PermissionInfo {
  name: Permission;
  displayName: string;
  category: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoleManagementService {
  private readonly rolesApiUrl = `${environment.apiUrl}/system/roles`;
  private readonly permissionsApiUrl = `${environment.apiUrl}/system/permissions`;
  private readonly usersApiUrl = `${environment.apiUrl}/system/users`;

  constructor(private http: HttpClient) {}

  // Get all roles with permissions and user counts
  getRoles(): Observable<Role[]> {
    return forkJoin({
      roles: this.http.get<any>(this.rolesApiUrl),
      users: this.http.get<any>(this.usersApiUrl)
    }).pipe(
      map(({ roles, users }) => {
        const rolesData = roles.data || [];
        const usersData = users.data || [];
        
        return rolesData.map((role: any) => {
          // Count users assigned to this role
          const userCount = usersData.filter((user: any) => 
            user.user_roles?.some((userRole: any) => 
              userRole.role_id === role.id && userRole.is_active
            )
          ).length;

          return {
            ...role,
            userCount,
            permissions: role.role_permissions?.map((rp: any) => rp.permission) || []
          };
        });
      }),
      catchError(this.handleError)
    );
  }

  // Get a single role by ID
  getRole(id: string): Observable<Role> {
    return this.http.get<any>(`${this.rolesApiUrl}/${id}`).pipe(
      map(response => ({
        ...response.data,
        permissions: response.data.role_permissions?.map((rp: any) => rp.permission) || []
      })),
      catchError(this.handleError)
    );
  }

  // Create a new role
  createRole(roleData: RoleCreateRequest): Observable<Role> {
    const { permissions, ...roleInfo } = roleData;
    
    return this.http.post<any>(this.rolesApiUrl, roleInfo).pipe(
      map(response => {
        const newRole = response.data;
        
        // If permissions are provided, assign them
        if (permissions && permissions.length > 0) {
          this.assignPermissions(newRole.id, permissions).subscribe();
        }
        
        return newRole;
      }),
      catchError(this.handleError)
    );
  }

  // Update an existing role
  updateRole(id: string, roleData: RoleUpdateRequest): Observable<Role> {
    const { permissions, ...roleInfo } = roleData;
    
    return this.http.put<any>(`${this.rolesApiUrl}/${id}`, roleInfo).pipe(
      map(response => {
        const updatedRole = response.data;
        
        // If permissions are provided, update them
        if (permissions !== undefined) {
          this.assignPermissions(id, permissions).subscribe();
        }
        
        return updatedRole;
      }),
      catchError(this.handleError)
    );
  }

  // Delete a role
  deleteRole(id: string): Observable<void> {
    return this.http.delete<any>(`${this.rolesApiUrl}/${id}`).pipe(
      map(() => void 0),
      catchError(this.handleError)
    );
  }

  // Assign permissions to a role (replaces all existing permissions)
  assignPermissions(roleId: string, permissions: Permission[]): Observable<void> {
    return this.http.patch<any>(`${this.rolesApiUrl}/${roleId}/permissions`, { permissions }).pipe(
      map(() => void 0),
      catchError(this.handleError)
    );
  }

  // Get all available permissions
  getAllPermissions(): Observable<Permission[]> {
    return this.http.get<any>(`${this.permissionsApiUrl}/permissions`).pipe(
      map(response => {
        const permissions = response.data || [];
        // Ensure we always return an array of Permission enum values
        return Array.isArray(permissions) ? permissions : Object.values(Permission);
      }),
      catchError(() => {
        // Fallback to enum values if API fails
        return of(Object.values(Permission));
      })
    );
  }

  // Get permissions grouped by category for better UI
  getGroupedPermissions(): Observable<{ [category: string]: PermissionInfo[] }> {
    return this.getAllPermissions().pipe(
      map(permissions => {
        const grouped: { [category: string]: PermissionInfo[] } = {};
        
        permissions.forEach(permission => {
          const category = this.getPermissionCategory(permission);
          if (!grouped[category]) {
            grouped[category] = [];
          }
          
          grouped[category].push({
            name: permission,
            displayName: this.getPermissionDisplayName(permission),
            category,
            description: this.getPermissionDescription(permission)
          });
        });
        
        return grouped;
      })
    );
  }

  // Get user count for a specific role
  getRoleUserCount(roleId: string): Observable<number> {
    const params = new HttpParams().set('roleId', roleId);
    return this.http.get<any>(this.usersApiUrl, { params }).pipe(
      map(response => {
        const users = response.data || [];
        return users.filter((user: any) => 
          user.user_roles?.some((userRole: any) => 
            userRole.role_id === roleId && userRole.is_active
          )
        ).length;
      }),
      catchError(() => [])
    );
  }

  // Helper methods for permission display
  private getPermissionCategory(permission: Permission): string {
    if (permission.includes('user_') || permission.includes('role_') || permission.includes('permission_')) {
      return 'System Administration';
    } else if (permission.includes('employee_') || permission.includes('employment_')) {
      return 'Personnel Information';
    } else if (permission.includes('leave_')) {
      return 'Leave Management';
    } else if (permission.includes('payroll_')) {
      return 'Payroll Management';
    } else if (permission.includes('attendance_') || permission.includes('schedule_') || permission.includes('dtr_')) {
      return 'Timekeeping & Attendance';
    } else if (permission.includes('performance_') || permission.includes('kpi_')) {
      return 'Performance Management';
    } else if (permission.includes('training_')) {
      return 'Learning & Development';
    } else if (permission.includes('applicant_') || permission.includes('job_') || permission.includes('application_')) {
      return 'Recruitment';
    } else if (permission.includes('report_')) {
      return 'Report Generation';
    } else {
      return 'Other';
    }
  }

  private getPermissionDisplayName(permission: Permission): string {
    return permission
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  private getPermissionDescription(permission: Permission): string {
    const action = permission.split('_').pop();
    const module = permission.replace(`_${action}`, '').replace(/_/g, ' ');
    
    switch (action) {
      case 'create': return `Create new ${module} records`;
      case 'read': return `View ${module} information`;
      case 'update': return `Modify existing ${module} records`;
      case 'delete': return `Remove ${module} records`;
      case 'generate': return `Generate ${module}`;
      default: return `Access to ${permission.replace(/_/g, ' ')}`;
    }
  }

  private handleError = (error: HttpErrorResponse) => {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error('Role Management Service Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  };
} 