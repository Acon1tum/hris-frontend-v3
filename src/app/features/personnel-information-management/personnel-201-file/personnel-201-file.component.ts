// Fade-in animation for main container and table rows is handled via CSS (.fade-in-smooth) and template class bindings.
// Personnel 201 File Component with Dynamic Departments
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateEditModalComponent, Department } from './create-edit-modal/create-edit-modal.component';
import { Personnel201Service, Personnel201File, PersonnelCreateRequest, PersonnelUpdateRequest } from './personnel-201.service';
import { DetailsAuditTrailModalComponent } from './details-audit-trail-modal/details-audit-trail-modal.component';
import { AuthService } from '../../../services/auth.service';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';

export interface AuditTrailEntry {
  action: 'create' | 'edit' | 'delete';
  timestamp: string;
  user: string;
  details: string;
}

export interface Personnel201ModalData {
  id?: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  email: string;
  number: string;
  address: string;
  department: string;
  position: string;
  file?: File | null;
  birthdate?: string;
  gender?: string;
  civilStatus?: string;
  citizenship?: string;
  employmentType?: string;
  designation?: string;
  appointmentDate?: string;
  startDate?: string;
  employmentStatus?: string;
  jobLevel?: string;
  jobGrade?: string;
  gsis?: string;
  pagibig?: string;
  philhealth?: string;
  sss?: string;
  tin_number?: string;
  dependents?: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  emergencyContactRelationship?: string;
  fileName?: string;
  profilePictureUrl?: string;
  profilePictureFile?: File | null;
  username?: string;
  password?: string;
  confirmPassword?: string;
  profilePictureBase64?: string | null;
}

@Component({
  selector: 'app-personnel-201-file',
  standalone: true,
  templateUrl: './personnel-201-file.component.html',
  styleUrls: ['./personnel-201-file.component.scss'],
  imports: [CommonModule, FormsModule, CreateEditModalComponent, DetailsAuditTrailModalComponent]
})
export class Personnel201FileComponent implements OnInit {
  personnelFiles: Personnel201File[] = [];
  selectedFile: Personnel201File | null = null;
  showDetailsModal = false;
  showEditModal = false;
  editMode: 'create' | 'edit' = 'create';
  editFileData: Personnel201ModalData = this.getEmptyModalData();
  searchTerm: string = '';
  loading = false;
  error: string | null = null;

  // Departments
  public departments: Department[] = [];
  public departmentsLoading: boolean = false;

  // Pagination
  currentPage = 1;
  pageSize = 5;
  totalRecords = 0;
  totalPages = 0;

  // Filter state
  filter = {
    nameSort: '', // '', 'az', 'za'
    department: '',
    position: ''
  };
  positions: string[] = [];

  // Make Math available in template
  Math = Math;

  pendingFiles: File[] = [];
  pendingMetas: { title: string; description: string }[] = [];

  showDeleteConfirm = false;
  showTypeConfirm = false;
  deleteConfirmInput = '';
  employeeToDelete: Personnel201File | null = null;
  deleteDelay = 3;
  deleteCountdown = 3;
  private deleteTimer: any = null;

  showNoDocumentsNotification = false;
  downloadDocumentsLoading = false;

  constructor(
    private personnelService: Personnel201Service,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Debug: Check authentication status
    console.log('🔍 Component ngOnInit - Checking auth status...');
    console.log('🔍 Is authenticated:', this.authService.isAuthenticated());
    console.log('🔍 Current user:', this.authService.getCurrentUser());
    console.log('🔍 Token exists:', !!this.authService.getToken());
    
    this.loadPersonnelFiles();
    this.loadDepartments();
  }

  private getEmptyModalData(): Personnel201ModalData {
    return {
      firstName: '',
      middleName: '',
      lastName: '',
      suffix: '',
      email: '',
      number: '',
      address: '',
      department: '',
      position: '',
      file: null,
      fileName: '',
      profilePictureUrl: '',
      profilePictureFile: null,
      birthdate: '',
      gender: '',
      civilStatus: '',
      citizenship: '',
      employmentType: '',
      designation: '',
      appointmentDate: '',
      startDate: '',
      employmentStatus: '',
      jobLevel: '',
      jobGrade: '',
      gsis: '',
      pagibig: '',
      philhealth: '',
      sss: '',
      dependents: '',
      emergencyContactName: '',
      emergencyContactNumber: '',
      emergencyContactRelationship: '',
      tin_number: '',
      username: '',
      password: '',
      confirmPassword: '',
      profilePictureBase64: undefined
    };
  }

  loadPersonnelFiles() {
    this.loading = true;
    this.error = null;

    // Debug: Log before making API call
    console.log('🚀 Making API call to load personnel files...');

    this.personnelService.getPersonnelFiles(
      this.currentPage, 
      this.pageSize, 
      this.searchTerm || undefined
    ).subscribe({
      next: (response) => {
        this.personnelFiles = response.data;
        this.totalRecords = response.pagination.total;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        this.loading = false;
        // Populate unique positions for filter
        this.positions = Array.from(new Set(this.personnelFiles.map(f => f.position).filter(Boolean)));
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
        console.error('Error loading personnel files:', error);
      }
    });
  }

  loadDepartments() {
    this.departmentsLoading = true;
    console.log('🏢 Loading departments...');

    this.personnelService.getDepartments().subscribe({
      next: (departments: {id: string, department_name: string}[]) => {
        this.departments = departments;
        this.departmentsLoading = false;
        console.log('✅ Departments loaded:', departments);
      },
      error: (error: any) => {
        console.error('❌ Error loading departments:', error);
        this.departmentsLoading = false;
        // Don't set main error here as it's not critical for viewing personnel
      }
    });
  }

  onSearch() {
    this.currentPage = 1; // Reset to first page when searching
    this.loadPersonnelFiles();
  }

  get filteredPersonnelFiles(): Personnel201File[] {
    let files = [...this.personnelFiles];
    // Department filter
    if (this.filter.department) {
      files = files.filter(f => f.department === this.filter.department);
    }
    // Position filter
    if (this.filter.position) {
      files = files.filter(f => f.position === this.filter.position);
    }
    // Name sort
    if (this.filter.nameSort === 'az') {
      files.sort((a, b) => (a.employeeName || '').localeCompare(b.employeeName || ''));
    } else if (this.filter.nameSort === 'za') {
      files.sort((a, b) => (b.employeeName || '').localeCompare(a.employeeName || ''));
    }
    return files;
  }

  get isFilterActive(): boolean {
    const f = this.filter;
    return !!(f.nameSort || f.department || f.position);
  }

  clearFilters() {
    this.filter = {
      nameSort: '',
      department: '',
      position: ''
    };
  }

  openEditModal(mode: 'create' | 'edit', data?: Personnel201File) {
    this.editMode = mode;
    if (mode === 'edit' && data) {
      this.editFileData = {
        firstName: data.firstName || '',
        middleName: data.middleName || '',
        lastName: data.lastName || '',
        suffix: '',
        email: data.email || '',
        number: data.contact_number || '',
        address: data.address || '',
        department: data.departmentName || '',
        position: data.designation || '',
        file: null,
        fileName: '',
        profilePictureUrl: data.profilePictureUrl || '',
        profilePictureFile: null,
        birthdate: data.date_of_birth || '',
        gender: data.gender || '',
        civilStatus: data.civil_status || '',
        citizenship: data.citizenship || '',
        employmentType: data.employment_type || '',
        designation: data.designation || '',
        appointmentDate: data.date_hired || '',
        startDate: data.date_hired || '',
        employmentStatus: data.user?.status || '',
        jobLevel: data.jobLevel || '',
        jobGrade: data.jobGrade || '',
        gsis: data.gsis_number || '',
        pagibig: data.pagibig_number || '',
        philhealth: data.philhealth_number || '',
        sss: data.sss_number || '',
        dependents: data.dependents || '',
        emergencyContactName: data.emergencyContactName || '',
        emergencyContactNumber: data.emergencyContactNumber || '',
        emergencyContactRelationship: data.emergencyContactRelationship || '',
        tin_number: data.tin_number || '',
        username: data.user?.username || '',
        password: '',
        confirmPassword: '',
        profilePictureBase64: undefined
      };
      (this.editFileData as any).id = data.id;
    } else {
      this.editFileData = this.getEmptyModalData();
    }
    this.showEditModal = true;
  }

  handleModalSave(modalData: Personnel201ModalData) {
    if (this.editMode === 'create') {
      this.createPersonnel(modalData);
    } else {
      this.updatePersonnel(modalData);
    }
    this.showEditModal = false;
    // Always refresh table after modal closes
    this.loadPersonnelFiles();
  }

  handleUploadDocuments(event: { files: File[]; metas: { title: string; description: string }[] }) {
    this.pendingFiles = event.files;
    this.pendingMetas = event.metas;
    // Refresh table after document upload
    this.loadPersonnelFiles();
  }

  private async createPersonnel(modalData: Personnel201ModalData) {
    this.loading = true;
    this.error = null;

    try {
      // Use the username generated from email in the modal
      const username = modalData.username || modalData.email?.split('@')[0] || 
                      `${modalData.firstName?.toLowerCase()}.${modalData.lastName?.toLowerCase()}`;

      // Map department name to department_id
      let department_id: string | undefined = undefined;
      if (modalData.department) {
        department_id = await this.personnelService.getDepartmentIdByName(modalData.department);
        if (!department_id) {
          console.warn('Department mapping not found for:', modalData.department);
          // Continue without department_id for now
        } else {
          console.log('✅ Department mapped successfully:', modalData.department, '→', department_id);
        }
      }

      // Set a reasonable default salary or make it configurable
      const defaultSalary = 25000; // Default starting salary

      const createRequest: any = {
        username: username,
        email: modalData.email || '',
        password: modalData.password || '', // Use user-inputted password instead of hardcoded temp password
        first_name: modalData.firstName || '',
        last_name: modalData.lastName || '',
        middle_name: modalData.middleName || undefined,
        date_of_birth: modalData.birthdate || undefined,
        gender: modalData.gender || undefined,
        civil_status: modalData.civilStatus || undefined,
        contact_number: modalData.number || undefined,
        address: modalData.address || undefined,
        department_id: department_id, // Fixed: Now properly mapping department
        designation: modalData.designation || modalData.position || undefined,
        employment_type: modalData.employmentType || 'Regular',
        date_hired: modalData.startDate || modalData.appointmentDate || new Date().toISOString().slice(0, 10),
        salary: defaultSalary, // Fixed: Using reasonable default instead of 0
        gsis_number: modalData.gsis || undefined,
        pagibig_number: modalData.pagibig || undefined,
        philhealth_number: modalData.philhealth || undefined,
        sss_number: modalData.sss || undefined,
        tin_number: modalData.tin_number || undefined // Fixed: Added missing TIN number
      };
      if (modalData.profilePictureBase64) {
        createRequest.profile_picture = modalData.profilePictureBase64;
      }

      console.log('🚀 Creating personnel with data:', createRequest);

      this.personnelService.createPersonnel(createRequest).subscribe({
        next: (createdPersonnel) => {
          console.log('✅ Personnel created successfully');
          // Upload documents if any
          if (this.pendingFiles.length > 0) {
            this.uploadDocumentsToBackend(createdPersonnel.id);
          }
          this.loadPersonnelFiles(); // Always refresh
          this.loading = false;
        },
        error: (error) => {
          this.error = error.message;
          this.loading = false;
          this.loadPersonnelFiles(); // Always refresh
          console.error('❌ Error creating personnel:', error);
        }
      });
    } catch (error) {
      this.error = 'Failed to create personnel. Please try again.';
      this.loading = false;
      this.loadPersonnelFiles(); // Always refresh
      console.error('❌ Error in createPersonnel:', error);
    }
  }

  private async updatePersonnel(modalData: Personnel201ModalData) {
    const id = (this.editFileData as any).id;
    if (!id) return;

    this.loading = true;
    this.error = null;

    try {
      // Map department name to department_id (same logic as create)
      let department_id: string | undefined = undefined;
      if (modalData.department) {
        department_id = await this.personnelService.getDepartmentIdByName(modalData.department);
        if (!department_id) {
          console.warn('Department mapping not found for:', modalData.department);
          // Continue without department_id for now
        } else {
          console.log('✅ Department mapped successfully for update:', modalData.department, '→', department_id);
        }
      }

      const updateRequest: PersonnelUpdateRequest = {
        first_name: modalData.firstName || undefined,
        last_name: modalData.lastName || undefined,
        middle_name: modalData.middleName || undefined,
        date_of_birth: modalData.birthdate || undefined,
        gender: modalData.gender || undefined,
        civil_status: modalData.civilStatus || undefined,
        contact_number: modalData.number || undefined,
        address: modalData.address || undefined,
        department_id: department_id, // Fixed: Now properly mapping department
        designation: modalData.designation || modalData.position || undefined,
        employment_type: modalData.employmentType || undefined,
        date_hired: modalData.startDate || modalData.appointmentDate || undefined,
        gsis_number: modalData.gsis || undefined,
        pagibig_number: modalData.pagibig || undefined,
        philhealth_number: modalData.philhealth || undefined,
        sss_number: modalData.sss || undefined,
        tin_number: modalData.tin_number || undefined,
        email: modalData.email || undefined,
        ...(modalData.profilePictureBase64 === null ? { profile_picture: null } : {}),
        ...(typeof modalData.profilePictureBase64 === 'string' ? { profile_picture: modalData.profilePictureBase64 } : {})
      };

      console.log('🚀 Updating personnel with data:', updateRequest);

      this.personnelService.updatePersonnel(id, updateRequest).subscribe({
        next: (updatedPersonnel) => {
          console.log('✅ Personnel updated successfully');
          // Upload documents if any
          if (this.pendingFiles.length > 0) {
            this.uploadDocumentsToBackend(id);
          }
          this.loadPersonnelFiles(); // Always refresh
          this.loading = false;
        },
        error: (error) => {
          this.error = error.message;
          this.loading = false;
          this.loadPersonnelFiles(); // Always refresh
          console.error('❌ Error updating personnel:', error);
        }
      });
    } catch (error) {
      this.error = 'Failed to update personnel. Please try again.';
      this.loading = false;
      this.loadPersonnelFiles(); // Always refresh
      console.error('❌ Error in updatePersonnel:', error);
    }
  }

  private async uploadDocumentsToBackend(personnelId: string) {
    const files = this.pendingFiles;
    const metas = this.pendingMetas;
    if (!files.length) return;
    const documents = await Promise.all(files.map((file, i) => {
      return new Promise<any>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          resolve({
            base64: e.target.result,
            title: metas[i].title,
            description: metas[i].description,
            fileType: file.type,
            category: 'general',
            isPrivate: false
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }));
    this.personnelService.uploadDocuments(personnelId, documents).subscribe({
      next: () => {
        this.pendingFiles = [];
        this.pendingMetas = [];
        this.loadPersonnelFiles();
      },
      error: (err: any) => {
        console.error('❌ Error uploading documents:', err);
      }
    });
  }

  handleModalCancel() {
    this.showEditModal = false;
    // Always refresh table after modal closes
    this.loadPersonnelFiles();
  }

  viewFile(file: Personnel201File) {
    this.selectedFile = file;
    this.showDetailsModal = true;
  }

  deleteFile(file: Personnel201File) {
    this.employeeToDelete = file;
    this.showDeleteConfirm = true;
    this.deleteCountdown = this.deleteDelay;
    if (this.deleteTimer) clearInterval(this.deleteTimer);
    this.deleteTimer = setInterval(() => {
      if (this.deleteCountdown > 0) {
        this.deleteCountdown--;
      } else {
        clearInterval(this.deleteTimer);
        this.deleteTimer = null;
      }
    }, 1000);
  }
  closeDeleteConfirm() {
    this.showDeleteConfirm = false;
    this.employeeToDelete = null;
    if (this.deleteTimer) clearInterval(this.deleteTimer);
    this.deleteTimer = null;
    this.deleteCountdown = this.deleteDelay;
    this.showTypeConfirm = false;
    this.showNoDocumentsNotification = false;
    this.downloadDocumentsLoading = false;
    this.deleteConfirmInput = '';
  }
  onDeleteButtonClick() {
    this.showTypeConfirm = true;
    this.deleteConfirmInput = '';
  }
  confirmDeleteEmployee() {
    if (!this.employeeToDelete) return;
    if (this.showTypeConfirm) {
      // Only proceed if input matches
      const last = this.employeeToDelete.lastName ? this.employeeToDelete.lastName.trim() : '';
      if (this.deleteConfirmInput.trim() !== `DELETE ${last}`) return;
    }
    this.loading = true;
    this.error = null;
    this.personnelService.deletePersonnel(this.employeeToDelete.id).subscribe({
      next: () => {
        this.loadPersonnelFiles(); // Always refresh
        this.loading = false;
        this.closeDeleteConfirm();
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
        this.closeDeleteConfirm();
        this.loadPersonnelFiles(); // Always refresh
        console.error('Error deleting personnel:', error);
      }
    });
  }
  async downloadEmployeeDocuments() {
    if (!this.employeeToDelete) return;
    this.downloadDocumentsLoading = true;
    // Fetch documents for the employee
    this.personnelService.getEmployeeDocuments(this.employeeToDelete.id).subscribe(async (docs) => {
      if (!docs.length) {
        this.showNoDocumentsNotification = true;
        setTimeout(() => {
          this.showNoDocumentsNotification = false;
          this.downloadDocumentsLoading = false;
        }, 3000);
        return;
      }
      const zip = new JSZip();
      const fetchBlob = async (url: string) => {
        const response = await fetch(url);
        return await response.blob();
      };
      const addFileToZip = async (doc: any) => {
        let filename = doc.title || 'document';
        if (doc.fileType && !filename.endsWith('.' + doc.fileType.split('/')[1])) {
          filename += '.' + doc.fileType.split('/')[1];
        }
        if (doc.fileUrl && doc.fileUrl.startsWith('data:')) {
          const arr = doc.fileUrl.split(',');
          if (arr.length === 2) {
            const mimeMatch = arr[0].match(/:(.*?);/);
            const mime = mimeMatch ? mimeMatch[1] : '';
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }
            zip.file(filename, u8arr, { binary: true });
          }
        } else if (doc.fileUrl) {
          try {
            const blob = await fetchBlob(doc.fileUrl.startsWith('http') ? doc.fileUrl : 'http://localhost:3000' + doc.fileUrl);
            zip.file(filename, blob);
          } catch (e) {}
        }
      };
      await Promise.all(docs.map((doc: any) => addFileToZip(doc)));
      // Generate zip filename based on employee name
      let zipName = 'attachments.zip';
      const first = this.employeeToDelete && this.employeeToDelete.firstName ? this.employeeToDelete.firstName.trim() : '';
      const last = this.employeeToDelete && this.employeeToDelete.lastName ? this.employeeToDelete.lastName.trim() : '';
      zipName = `${first} ${last} - Document(s).zip`;
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, zipName);
      this.downloadDocumentsLoading = false;
    }, (error) => {
      this.downloadDocumentsLoading = false;
    });
  }

  closeDetailsModal() {
    this.showDetailsModal = false;
    this.selectedFile = null;
  }

  openCreateModal() {
    this.openEditModal('create');
  }

  editFile(file: Personnel201File) {
    this.openEditModal('edit', file);
  }

  // Pagination logic (admin dashboard style)
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, this.currentPage - 2);
      let end = Math.min(this.totalPages, this.currentPage + 2);
      if (this.currentPage <= 3) {
        end = 5;
        start = 1;
      } else if (this.currentPage >= this.totalPages - 2) {
        end = this.totalPages;
        start = this.totalPages - 4;
      }
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    return pages;
  }

  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.currentPage = page;
    this.loadPersonnelFiles();
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  }

  onPageSizeChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.pageSize = parseInt(select.value, 10);
    this.currentPage = 1;
    this.loadPersonnelFiles();
  }

  onUploadDocument(event: Event, personnelId: string) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const title = file.name;
      const description = ''; // You can add a description input if needed

      this.personnelService.uploadDocumentAsBase64(personnelId, file, title, description).subscribe({
        next: (res) => {
          // Optionally refresh the document list or show a success message
          alert('Document uploaded!');
        },
        error: (err) => {
          alert('Upload failed: ' + err.message);
        }
      });
    }
  }

  refreshPersonnelTable() {
    this.loadPersonnelFiles();
  }


} 