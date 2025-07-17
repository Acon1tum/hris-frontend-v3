import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  RoleManagementService, 
  Role, 
  RoleCreateRequest, 
  RoleUpdateRequest,
  PermissionInfo 
} from './role-management.service';
import { Permission } from '../../../interfaces/auth.interface';
import { AuthService } from '../../../services/auth.service';

interface PermissionDisplay {
  name: string;
  color: string;
  bgColor: string;
}

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss']
})
export class RoleManagementComponent implements OnInit {
  
  roles: Role[] = [];
  groupedPermissions: { [category: string]: PermissionInfo[] } = {};
  loading = false;
  error: string | null = null;

  // Modal states
  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;
  showPermissionsModal = false;

  // Form data
  currentRole: Role | null = null;
  roleForm: RoleCreateRequest = {
    name: '',
    description: '',
    permissions: []
  };

  // Permission selection
  selectedPermissions: Set<Permission> = new Set();
  searchTerm = '';

  constructor(
    private roleService: RoleManagementService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    console.log('🔍 Role Management Component - Checking auth status...');
    console.log('🔍 Is authenticated:', this.authService.isAuthenticated());
    console.log('🔍 Current user:', this.authService.getCurrentUser());
    
    this.loadRoles();
    this.loadPermissions();
  }

  loadRoles() {
    this.loading = true;
    this.error = null;

    console.log('🚀 Loading roles from backend...');
    
    this.roleService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        this.loading = false;
        console.log('✅ Roles loaded successfully:', roles);
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
        console.error('❌ Error loading roles:', error);
      }
    });
  }

  loadPermissions() {
    this.roleService.getGroupedPermissions().subscribe({
      next: (grouped) => {
        this.groupedPermissions = grouped;
        console.log('✅ Permissions loaded and grouped:', grouped);
      },
      error: (error) => {
        console.error('❌ Error loading permissions:', error);
      }
    });
  }

  // Create new role
  onCreateNewRole() {
    this.resetForm();
    this.showCreateModal = true;
  }

  // Edit existing role
  onEditRole(role: Role) {
    this.currentRole = role;
    this.roleForm = {
      name: role.name,
      description: role.description || '',
      permissions: role.permissions || []
    };
    this.selectedPermissions = new Set(role.permissions || []);
    this.showEditModal = true;
  }

  // Delete role
  onDeleteRole(role: Role) {
    this.currentRole = role;
    this.showDeleteModal = true;
  }

  // View/Edit permissions
  onManagePermissions(role: Role) {
    this.currentRole = role;
    this.selectedPermissions = new Set(role.permissions || []);
    this.showPermissionsModal = true;
  }

  // Save role (create or update)
  saveRole() {
    if (!this.roleForm.name.trim()) {
      this.error = 'Role name is required';
      return;
    }

    this.loading = true;
    this.error = null;

    if (this.currentRole) {
      // Update existing role
      const updateData: RoleUpdateRequest = {
        name: this.roleForm.name.trim(),
        description: this.roleForm.description?.trim(),
        permissions: Array.from(this.selectedPermissions)
      };
      
      console.log('🚀 Updating role:', this.currentRole.id, updateData);
      this.roleService.updateRole(this.currentRole.id, updateData).subscribe({
        next: () => {
          console.log('✅ Role updated successfully');
          this.closeModals();
          this.loadRoles();
        },
        error: (error) => {
          this.error = error.message;
          this.loading = false;
          console.error('❌ Error updating role:', error);
  }
      });
    } else {
      // Create new role
      const createData: RoleCreateRequest = {
        name: this.roleForm.name.trim(),
        description: this.roleForm.description?.trim(),
        permissions: Array.from(this.selectedPermissions)
      };
      
      console.log('🚀 Creating new role:', createData);
      this.roleService.createRole(createData).subscribe({
        next: () => {
          console.log('✅ Role created successfully');
          this.closeModals();
          this.loadRoles();
        },
        error: (error) => {
          this.error = error.message;
          this.loading = false;
          console.error('❌ Error creating role:', error);
        }
      });
    }
  }

  // Confirm delete
  confirmDelete() {
    if (!this.currentRole) return;

    this.loading = true;
    this.error = null;

    console.log('🚀 Deleting role:', this.currentRole.id);
    
    this.roleService.deleteRole(this.currentRole.id).subscribe({
      next: () => {
        console.log('✅ Role deleted successfully');
        this.closeModals();
        this.loadRoles();
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
        console.error('❌ Error deleting role:', error);
      }
    });
  }

  // Save permissions only
  savePermissions() {
    if (!this.currentRole) return;

    this.loading = true;
    this.error = null;

    const permissions = Array.from(this.selectedPermissions);
    
    console.log('🚀 Updating permissions for role:', this.currentRole.id, permissions);
    
    this.roleService.assignPermissions(this.currentRole.id, permissions).subscribe({
      next: () => {
        console.log('✅ Permissions updated successfully');
        this.closeModals();
        this.loadRoles();
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
        console.error('❌ Error updating permissions:', error);
      }
    });
  }

  // Permission management
  togglePermission(permission: Permission) {
    if (this.selectedPermissions.has(permission)) {
      this.selectedPermissions.delete(permission);
    } else {
      this.selectedPermissions.add(permission);
    }
  }

  isPermissionSelected(permission: Permission): boolean {
    return this.selectedPermissions.has(permission);
  }

  selectAllInCategory(category: string) {
    const categoryPermissions = this.groupedPermissions[category];
    if (categoryPermissions) {
      categoryPermissions.forEach(perm => {
        this.selectedPermissions.add(perm.name);
      });
    }
  }

  deselectAllInCategory(category: string) {
    const categoryPermissions = this.groupedPermissions[category];
    if (categoryPermissions) {
      categoryPermissions.forEach(perm => {
        this.selectedPermissions.delete(perm.name);
      });
    }
  }

  getSelectedInCategory(category: string): number {
    const categoryPermissions = this.groupedPermissions[category];
    if (!categoryPermissions) return 0;
    
    return categoryPermissions.filter(perm => 
      this.selectedPermissions.has(perm.name)
    ).length;
  }

  // Utility methods
  resetForm() {
    this.currentRole = null;
    this.roleForm = {
      name: '',
      description: '',
      permissions: []
    };
    this.selectedPermissions.clear();
    this.error = null;
  }

  closeModals() {
    this.showCreateModal = false;
    this.showEditModal = false;
    this.showDeleteModal = false;
    this.showPermissionsModal = false;
    this.resetForm();
    this.loading = false;
  }

  // Convert permissions to display format for existing UI
  getPermissionDisplays(permissions: Permission[]): PermissionDisplay[] {
    const colors = [
      { color: '#166534', bgColor: '#dcfce7' },
      { color: '#1e40af', bgColor: '#dbeafe' },
      { color: '#a16207', bgColor: '#fef3c7' },
      { color: '#7c2d12', bgColor: '#f3e8ff' },
      { color: '#dc2626', bgColor: '#fecaca' }
    ];

    return permissions.slice(0, 3).map((permission, index) => ({
      name: this.getSimplePermissionName(permission),
      color: colors[index % colors.length].color,
      bgColor: colors[index % colors.length].bgColor
    }));
  }

  private getSimplePermissionName(permission: Permission): string {
    const parts = permission.split('_');
    const action = parts[parts.length - 1];
    
    switch (action) {
      case 'create': return 'Create';
      case 'read': return 'View';
      case 'update': return 'Edit';
      case 'delete': return 'Delete';
      default: return action.charAt(0).toUpperCase() + action.slice(1);
    }
  }

  // Search filter for permissions
  getFilteredPermissions(category: string): PermissionInfo[] {
    const permissions = this.groupedPermissions[category] || [];
    if (!this.searchTerm) return permissions;
    
    return permissions.filter(perm => 
      perm.displayName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      perm.description?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  getFilteredCategories(): string[] {
    if (!this.searchTerm) return Object.keys(this.groupedPermissions);
    
    return Object.keys(this.groupedPermissions).filter(category => 
      this.getFilteredPermissions(category).length > 0
    );
  }

  trackByRoleId(index: number, role: Role): string {
    return role.id;
  }

  trackByCategory(index: number, category: string): string {
    return category;
  }

  trackByPermission(index: number, permission: PermissionInfo): string {
    return permission.name;
  }
} 