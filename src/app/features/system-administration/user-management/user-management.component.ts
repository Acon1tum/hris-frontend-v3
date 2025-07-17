import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface User {
  id: number;
  name: string;
  role: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent {
  searchTerm = '';
  
  users: User[] = [
    {
      id: 1,
      name: 'Ethan Carter',
      role: 'Admin',
      status: 'Active',
      lastLogin: '2024-01-20 10:00 AM'
    },
    {
      id: 2,
      name: 'Olivia Bennett',
      role: 'Editor',
      status: 'Active',
      lastLogin: '2024-01-20 09:30 AM'
    },
    {
      id: 3,
      name: 'Noah Harper',
      role: 'Viewer',
      status: 'Inactive',
      lastLogin: '2023-12-15 02:00 PM'
    },
    {
      id: 4,
      name: 'Ava Morgan',
      role: 'Admin',
      status: 'Active',
      lastLogin: '2024-01-19 05:45 PM'
    },
    {
      id: 5,
      name: 'Liam Foster',
      role: 'Editor',
      status: 'Active',
      lastLogin: '2024-01-20 11:15 AM'
    }
  ];

  onNewUser() {
    console.log('Add new user clicked');
  }

  onViewUser(user: User) {
    console.log('View user:', user.name);
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
  }

  get filteredUsers() {
    if (!this.searchTerm) {
      return this.users;
    }
    return this.users.filter(user => 
      user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  trackByUserId(index: number, user: User): number {
    return user.id;
  }
} 