import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeSelfService, EmployeeDocument, UploadDocumentRequest } from '../../../services/employee-self.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export interface ReportDocument {
  id: number;
  name: string;
  description: string;
  type: 'pdf' | 'doc' | 'excel' | 'image';
  dateGenerated: Date;
  size: string;
  downloadUrl?: string;
  isAvailable: boolean;
}

export interface RequestReport {
  id: number;
  requestType: string;
  dateFiled: Date;
  status: 'approved' | 'pending' | 'rejected' | 'cancelled';
  dateApproved?: Date;
  approvedBy?: string;
}

export interface ReportTab {
  id: string;
  label: string;
  count?: number;
}

export interface ReportFilter {
  year: number;
  requestType: string;
  status: string;
}

@Component({
  selector: 'app-my-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-reports.component.html',
  styleUrls: ['./my-reports.component.scss']
})
export class MyReportsComponent implements OnInit {
  title = 'My Reports';
  
  // Make Math available in template
  Math = Math;
  
  // Active tab
  activeTab: string = 'my-reports';
  
  // Document upload states
  showUploadModal = false;
  uploading = false;
  uploadError: string | null = null;
  selectedFile: File | null = null;
  uploadForm = {
    title: '',
    description: '',
    category: 'Personal'
  };
  
  // Tab configuration
  tabs: ReportTab[] = [
    { id: 'my-reports', label: 'My Reports' },
    { id: 'company-reports', label: 'Company Reports' }
  ];

  // Search functionality
  searchTerm: string = '';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  
  // Filters
  filters: ReportFilter = {
    year: new Date().getFullYear(),
    requestType: '',
    status: ''
  };
  
  // Available filter options
  availableYears: number[] = [];
  requestTypes = [
    'All Types',
    'Leave',
    'Overtime',
    'DTR Adjustment',
    'Certification',
    'Training Request',
    'Equipment Request'
  ];
  statusOptions = [
    'All Status',
    'Approved',
    'Pending',
    'Rejected',
    'Cancelled'
  ];

  // Modal states
  showDocumentModal: boolean = false;
  showRequestDetailModal: boolean = false;
  selectedDocument: ReportDocument | null = null;
  selectedRequest: RequestReport | null = null;

  // Documents data
  uploadedDocuments: EmployeeDocument[] = [];

  // Request reports data
  requestReports: RequestReport[] = [];

  // Add state for uploaded document viewing
  showUploadedDocumentModal: boolean = false;
  selectedUploadedDocument: EmployeeDocument | null = null;

  // CSV preview state
  csvPreviewData: string[][] | null = null;
  csvPreviewLoading = false;
  csvPreviewError: string | null = null;

  constructor(
    private employeeSelfService: EmployeeSelfService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.initializeYears();
    this.updateTabCounts();
    this.loadUploadedDocuments();
  }

  loadUploadedDocuments() {
    this.employeeSelfService.getMyDocuments().subscribe({
      next: (response) => {
        if (response.success) {
          this.uploadedDocuments = response.data;
          this.updateTabCounts();
        }
      },
      error: (error) => {
        console.error('Error loading documents:', error);
      }
    });
  }

  initializeYears() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 5; year--) {
      this.availableYears.push(year);
    }
  }

  // Tab management
  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.currentPage = 1;
  }

  updateTabCounts() {
    this.tabs.forEach(tab => {
      switch (tab.id) {
        case 'my-reports':
          tab.count = this.uploadedDocuments.length;
          break;
        case 'company-reports':
          tab.count = 12; // Mock count for company reports
          break;
      }
    });
  }

  // Document management
  get filteredDocuments(): EmployeeDocument[] {
    let filtered = this.uploadedDocuments;
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(term) ||
        (doc.description || '').toLowerCase().includes(term)
      );
    }
    return filtered;
  }

  get paginatedDocuments(): EmployeeDocument[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredDocuments.slice(start, end);
  }

  // Request reports filtering
  get filteredRequestReports(): RequestReport[] {
    let filtered = this.requestReports;

    // Filter by year
    if (this.filters.year) {
      filtered = filtered.filter(report => 
        report.dateFiled.getFullYear() === this.filters.year
      );
    }

    // Filter by request type
    if (this.filters.requestType && this.filters.requestType !== 'All Types') {
      filtered = filtered.filter(report => 
        report.requestType === this.filters.requestType
      );
    }

    // Filter by status
    if (this.filters.status && this.filters.status !== 'All Status') {
      filtered = filtered.filter(report => 
        report.status === this.filters.status.toLowerCase()
      );
    }

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(report => 
        report.requestType.toLowerCase().includes(term) ||
        report.status.toLowerCase().includes(term)
      );
    }

    return filtered;
  }

  get paginatedRequestReports(): RequestReport[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredRequestReports.slice(start, end);
  }

  // Pagination
  get totalPages(): number {
    if (this.activeTab === 'my-reports') {
      return Math.ceil(this.filteredDocuments.length / this.itemsPerPage);
    } else {
      return Math.ceil(this.filteredRequestReports.length / this.itemsPerPage);
    }
  }

  get hasNextPage(): boolean {
    return this.currentPage < this.totalPages;
  }

  get hasPreviousPage(): boolean {
    return this.currentPage > 1;
  }

  nextPage() {
    if (this.hasNextPage) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.hasPreviousPage) {
      this.currentPage--;
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Document actions
  viewDocument(document: ReportDocument) {
    this.selectedDocument = document;
    this.showDocumentModal = true;
  }

  closeDocumentModal() {
    this.showDocumentModal = false;
    this.selectedDocument = null;
  }

  downloadDocument(document: ReportDocument) {
    if (document.downloadUrl) {
      console.log(`Downloading document: ${document.downloadUrl}`);
      // Simulate download
      const link = window.document.createElement('a');
      link.href = '#'; // In real implementation, this would be the actual file URL
      link.download = document.downloadUrl;
      link.click();
    }
  }

  // Request report actions
  viewRequestReport(request: RequestReport) {
    this.selectedRequest = request;
    this.showRequestDetailModal = true;
  }

  closeRequestDetailModal() {
    this.showRequestDetailModal = false;
    this.selectedRequest = null;
  }

  // Filter methods
  onYearChange(year: number) {
    this.filters.year = year;
    this.currentPage = 1;
  }

  onRequestTypeChange(type: string) {
    this.filters.requestType = type;
    this.currentPage = 1;
  }

  onStatusChange(status: string) {
    this.filters.status = status;
    this.currentPage = 1;
  }

  clearFilters() {
    this.filters = {
      year: new Date().getFullYear(),
      requestType: '',
      status: ''
    };
    this.searchTerm = '';
    this.currentPage = 1;
  }

  // Utility methods
  getDocumentIcon(type: string): string {
    switch (type) {
      case 'pdf':
        return '📄';
      case 'doc':
        return '📝';
      case 'excel':
        return '📊';
      case 'image':
        return '🖼️';
      default:
        return '📄';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'approved':
        return 'status-approved';
      case 'pending':
        return 'status-pending';
      case 'rejected':
        return 'status-rejected';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'approved':
        return '✓';
      case 'pending':
        return '⏳';
      case 'rejected':
        return '✗';
      case 'cancelled':
        return '⊘';
      default:
        return '?';
    }
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  }

  formatFileSize(sizeBytes: number): string {
    if (sizeBytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(sizeBytes) / Math.log(k));
    return parseFloat((sizeBytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getFileType(mimeType: string): string {
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'doc';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'excel';
    if (mimeType.includes('image')) return 'image';
    return 'pdf';
  }

  // Generate new reports (placeholder functionality)
  generateDocument(type: string) {
    console.log(`Generating ${type} document...`);
    // This would trigger actual document generation in a real application
  }

  // Document upload methods
  openUploadModal() {
    this.showUploadModal = true;
    this.uploadError = null;
    this.selectedFile = null;
    this.uploadForm = {
      title: '',
      description: '',
      category: 'Personal'
    };
  }

  closeUploadModal() {
    this.showUploadModal = false;
    this.uploading = false;
    this.uploadError = null;
    this.selectedFile = null;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadError = null;
    }
  }

  uploadDocument() {
    if (!this.selectedFile || !this.uploadForm.title.trim()) {
      this.uploadError = 'Please select a file and provide a title.';
      return;
    }

    this.uploading = true;
    this.uploadError = null;

    const uploadData: UploadDocumentRequest = {
      title: this.uploadForm.title,
      description: this.uploadForm.description || undefined,
      category: this.uploadForm.category,
      file: this.selectedFile
    };

    this.employeeSelfService.uploadDocument(uploadData).subscribe({
      next: (response) => {
        if (response.success) {
          this.uploadedDocuments.unshift(response.data);
          this.updateTabCounts();
          this.closeUploadModal();
          this.showToastNotification('Document uploaded successfully!');
        } else {
          this.uploadError = response.message || 'Upload failed';
        }
        this.uploading = false;
      },
      error: (error) => {
        this.uploadError = error.message || 'Upload failed';
        this.uploading = false;
      }
    });
  }

  deleteUploadedDocument(document: EmployeeDocument) {
    if (confirm('Are you sure you want to delete this document?')) {
      this.employeeSelfService.deleteDocument(document.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.uploadedDocuments = this.uploadedDocuments.filter(doc => doc.id !== document.id);
            this.updateTabCounts();
            this.showToastNotification('Document deleted successfully!');
          }
        },
        error: (error) => {
          console.error('Error deleting document:', error);
        }
      });
    }
  }

  // Toast notification
  showToastNotification(message: string) {
    // Implementation for toast notification
    console.log(message);
  }

  formatDateString(dateStr: string): string {
    return this.formatDate(new Date(dateStr));
  }

  // Add helper methods for file type detection
  isPdf(urlOrType: string): boolean {
    return urlOrType.toLowerCase().endsWith('.pdf') || urlOrType.toLowerCase().includes('pdf');
  }
  isImage(urlOrType: string): boolean {
    return (
      urlOrType.toLowerCase().endsWith('.jpg') ||
      urlOrType.toLowerCase().endsWith('.jpeg') ||
      urlOrType.toLowerCase().endsWith('.png') ||
      urlOrType.toLowerCase().endsWith('.gif') ||
      urlOrType.toLowerCase().includes('image')
    );
  }

  // Add methods to open/close uploaded document modal
  viewUploadedDocument(document: EmployeeDocument) {
    this.selectedUploadedDocument = document;
    this.showUploadedDocumentModal = true;
    this.csvPreviewData = null;
    this.csvPreviewError = null;
    if (this.isCsv(document.fileUrl)) {
      this.csvPreviewLoading = true;
      fetch(this.getFullFileUrl(document.fileUrl))
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch CSV');
          return res.text();
        })
        .then(text => {
          this.csvPreviewData = this.parseCsv(text);
          this.csvPreviewLoading = false;
        })
        .catch(err => {
          this.csvPreviewError = 'Failed to load CSV: ' + err.message;
          this.csvPreviewLoading = false;
        });
    }
  }
  closeUploadedDocumentModal() {
    this.showUploadedDocumentModal = false;
    this.selectedUploadedDocument = null;
  }

  // Helper to get full file URL (handles different ports/hosts)
  getFullFileUrl(fileUrl: string): string {
    if (!fileUrl) return '';
    if (fileUrl.startsWith('http')) return fileUrl;
    // Adjust the base URL if your backend is not on localhost:3000
    return `http://localhost:3000${fileUrl}`;
  }

  // Helper to get a SafeResourceUrl for iframes
  getSafeResourceUrl(fileUrl: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.getFullFileUrl(fileUrl));
  }

  // Helper: detect CSV
  isCsv(urlOrType: string): boolean {
    return (
      urlOrType.toLowerCase().endsWith('.csv') ||
      urlOrType.toLowerCase().includes('csv')
    );
  }

  // Helper: detect Excel
  isExcel(urlOrType: string): boolean {
    return (
      urlOrType.toLowerCase().endsWith('.xls') ||
      urlOrType.toLowerCase().endsWith('.xlsx') ||
      urlOrType.toLowerCase().includes('excel')
    );
  }

  // Simple CSV parser (no quoted fields)
  parseCsv(csv: string): string[][] {
    return csv.split(/\r?\n/)
      .filter(row => row.trim().length > 0)
      .map(row => row.split(','));
  }

  // Download functionality for icon buttons in modal
  downloadDocumentFromModal(doc: ReportDocument) {
    if (!doc.downloadUrl) {
      this.showToastNotification('Download URL not available');
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = doc.downloadUrl;
      link.download = doc.name || 'document';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      this.showToastNotification('Download started successfully!');
    } catch (error) {
      console.error('Download error:', error);
      this.showToastNotification('Download failed. Please try again.');
    }
  }

  downloadUploadedDocumentFromModal(doc: EmployeeDocument) {
    if (!doc.fileUrl) {
      this.showToastNotification('File URL not available');
      return;
    }

    try {
      const fullUrl = this.getFullFileUrl(doc.fileUrl);
      const link = document.createElement('a');
      link.href = fullUrl;
      link.download = doc.title || 'document';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      this.showToastNotification('Download started successfully!');
    } catch (error) {
      console.error('Download error:', error);
      this.showToastNotification('Download failed. Please try again.');
    }
  }

  // Enhanced download method with proper filename extraction
  downloadFileWithProperName(fileUrl: string, title: string, fileType: string) {
    if (!fileUrl) {
      this.showToastNotification('File URL not available');
      return;
    }

    try {
      const fullUrl = this.getFullFileUrl(fileUrl);
      const link = document.createElement('a');
      link.href = fullUrl;
      
      // Extract proper filename with extension
      const fileName = this.getFileNameWithExtension(title, fileType);
      link.download = fileName;
      link.target = '_blank';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      this.showToastNotification(`Downloading ${fileName}...`);
    } catch (error) {
      console.error('Download error:', error);
      this.showToastNotification('Download failed. Please try again.');
    }
  }

  // Helper method to get proper filename with extension
  getFileNameWithExtension(title: string, fileType: string): string {
    // Clean the title (remove special characters that might cause issues)
    const cleanTitle = title.replace(/[^a-zA-Z0-9\s\-_]/g, '').trim();
    
    // Add appropriate extension based on file type
    let extension = '';
    switch (fileType.toLowerCase()) {
      case 'pdf':
        extension = '.pdf';
        break;
      case 'doc':
      case 'word':
        extension = '.doc';
        break;
      case 'excel':
      case 'xls':
        extension = '.xlsx';
        break;
      case 'image':
      case 'jpg':
      case 'jpeg':
        extension = '.jpg';
        break;
      case 'png':
        extension = '.png';
        break;
      case 'gif':
        extension = '.gif';
        break;
      case 'csv':
        extension = '.csv';
        break;
      default:
        extension = '.pdf'; // Default to PDF
    }
    
    return `${cleanTitle}${extension}`;
  }

  // Method to handle download with progress indication
  downloadWithProgress(fileUrl: string, title: string, fileType: string) {
    if (!fileUrl) {
      this.showToastNotification('File URL not available');
      return;
    }

    const fullUrl = this.getFullFileUrl(fileUrl);
    
    // Show loading state
    this.showToastNotification('Preparing download...');
    
    // Fetch the file first to check if it's accessible
    fetch(fullUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob();
      })
      .then(blob => {
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        const fileName = this.getFileNameWithExtension(title, fileType);
        link.download = fileName;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        window.URL.revokeObjectURL(url);
        
        this.showToastNotification(`${fileName} downloaded successfully!`);
      })
      .catch(error => {
        console.error('Download error:', error);
        this.showToastNotification('Download failed. Please check your connection and try again.');
      });
  }
} 