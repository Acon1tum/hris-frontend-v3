import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Personnel201File, Personnel201Service, EmployeeDocument, getDocumentSrc, getDocumentBlobUrl } from '../personnel-201.service';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-details-audit-trail-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details-audit-trail-modal.component.html',
  styleUrls: ['./details-audit-trail-modal.component.scss']
})
export class DetailsAuditTrailModalComponent implements OnInit {
  @Input() file: Personnel201File | null = null;
  @Input() personnelId: string = '';
  @Output() close = new EventEmitter<void>();

  closing = false;
  employeeDocuments: EmployeeDocument[] = [];

  // Image modal state
  showImageModal = false;
  selectedImageDoc: EmployeeDocument | null = null;
  zoomLevel = 1;
  // Pan state for free look
  panX = 0;
  panY = 0;
  isDragging = false;
  dragStartX = 0;
  dragStartY = 0;

  constructor(
    private http: HttpClient,
    private personnelService: Personnel201Service,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (this.file && this.file.id) {
      this.personnelService.getEmployeeDocuments(this.file.id).subscribe((docs: EmployeeDocument[]) => {
        this.employeeDocuments = docs.map(doc => ({ ...doc, showPreview: false }));
        this.cdr.detectChanges();
      });
    }
  }

  onClose() {
    this.closing = true;
    setTimeout(() => {
      this.close.emit();
      this.closing = false;
    }, 400); // match animation duration
  }

  getDocumentSrc = getDocumentSrc;

  openDocument(doc: EmployeeDocument) {
    // Try to use Blob URL for best compatibility
    const blobUrl = getDocumentBlobUrl(doc);
    if (blobUrl) {
      window.open(blobUrl, '_blank');
      return;
    }
    // Fallback to data URL or fileUrl
    window.open(this.getDocumentSrc(doc), '_blank');
  }

  // Image modal logic
  openImageModal(doc: EmployeeDocument) {
    this.selectedImageDoc = doc;
    this.showImageModal = true;
    this.zoomLevel = 1;
    this.panX = 0;
    this.panY = 0;
  }
  closeImageModal() {
    this.showImageModal = false;
    this.selectedImageDoc = null;
    this.zoomLevel = 1;
    this.panX = 0;
    this.panY = 0;
  }
  zoomIn() {
    this.zoomLevel = Math.min(this.zoomLevel + 0.2, 5);
  }
  zoomOut() {
    this.zoomLevel = Math.max(this.zoomLevel - 0.2, 0.2);
  }
  resetZoom() {
    this.zoomLevel = 1;
    this.panX = 0;
    this.panY = 0;
  }

  // Free look (pan/drag) handlers
  onImageMouseDown(event: MouseEvent) {
    if (this.zoomLevel === 1) return; // Only allow pan if zoomed in
    this.isDragging = true;
    this.dragStartX = event.clientX - this.panX;
    this.dragStartY = event.clientY - this.panY;
    event.preventDefault();
  }
  onImageMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;
    this.panX = event.clientX - this.dragStartX;
    this.panY = event.clientY - this.dragStartY;
  }
  onImageMouseUp() {
    this.isDragging = false;
  }
  onImageMouseLeave() {
    this.isDragging = false;
  }
  // Touch events for mobile
  onImageTouchStart(event: TouchEvent) {
    if (this.zoomLevel === 1) return;
    this.isDragging = true;
    const touch = event.touches[0];
    this.dragStartX = touch.clientX - this.panX;
    this.dragStartY = touch.clientY - this.panY;
  }
  onImageTouchMove(event: TouchEvent) {
    if (!this.isDragging) return;
    const touch = event.touches[0];
    this.panX = touch.clientX - this.dragStartX;
    this.panY = touch.clientY - this.dragStartY;
  }
  onImageTouchEnd() {
    this.isDragging = false;
  }

  async downloadAllAttachments() {
    if (!this.employeeDocuments.length) return;
    const zip = new JSZip();
    const fetchBlob = async (url: string) => {
      const response = await fetch(url);
      return await response.blob();
    };
    const addFileToZip = async (doc: EmployeeDocument) => {
      let filename = doc.title || 'document';
      // Add extension if missing
      if (doc.fileType && !filename.endsWith('.' + doc.fileType.split('/')[1])) {
        filename += '.' + doc.fileType.split('/')[1];
      }
      if (doc.fileUrl && doc.fileUrl.startsWith('data:')) {
        // base64 data URL
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
        // Try to fetch as blob
        try {
          const blob = await fetchBlob(doc.fileUrl.startsWith('http') ? doc.fileUrl : 'http://localhost:3000' + doc.fileUrl);
          zip.file(filename, blob);
        } catch (e) {
          // skip file if fetch fails
        }
      }
    };
    await Promise.all(this.employeeDocuments.map(doc => addFileToZip(doc)));
    // Generate zip filename based on employee name
    let zipName = 'attachments.zip';
    if (this.file) {
      const first = this.file.firstName ? this.file.firstName.trim() : '';
      const last = this.file.lastName ? this.file.lastName.trim() : '';
      zipName = `${first} ${last} - Document(s).zip`;
    }
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, zipName);
  }

  downloadSingleAttachment(doc: EmployeeDocument) {
    let filename = doc.title || 'document';
    if (doc.fileType && !filename.endsWith('.' + doc.fileType.split('/')[1])) {
      filename += '.' + doc.fileType.split('/')[1];
    }
    if (doc.fileUrl && doc.fileUrl.startsWith('data:')) {
      // base64 data URL
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
        const blob = new Blob([u8arr], { type: mime });
        saveAs(blob, filename);
      }
    } else if (doc.fileUrl) {
      // Download from URL
      const url = doc.fileUrl.startsWith('http') ? doc.fileUrl : 'http://localhost:3000' + doc.fileUrl;
      fetch(url)
        .then(res => res.blob())
        .then(blob => saveAs(blob, filename));
    }
  }

  viewSingleAttachment(doc: EmployeeDocument) {
    if (doc.fileType && doc.fileType.startsWith('image/')) {
      this.openImageModal(doc);
    } else if (doc.fileType === 'application/pdf') {
      this.openDocument(doc);
    } else {
      // For other types, try to download or open in new tab
      const url = doc.fileUrl.startsWith('http') ? doc.fileUrl : 'http://localhost:3000' + doc.fileUrl;
      window.open(url, '_blank');
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    } else if (bytes >= 1024) {
      return (bytes / 1024).toFixed(2) + ' KB';
    } else {
      return bytes + ' B';
    }
  }
} 