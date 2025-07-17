import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsAuditTrailModalComponent } from './details-audit-trail-modal.component';

describe('DetailsAuditTrailModalComponent', () => {
  let component: DetailsAuditTrailModalComponent;
  let fixture: ComponentFixture<DetailsAuditTrailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsAuditTrailModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsAuditTrailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return fileUrl if it contains base64 data in getDocumentSrc', () => {
    const doc: any = { fileUrl: 'data:application/pdf;base64,abc123' };
    expect(component.getDocumentSrc(doc)).toBe('data:application/pdf;base64,abc123');
  });

  it('should return base64 field if present and fileUrl is not base64 in getDocumentSrc', () => {
    const doc: any = { base64: 'data:application/pdf;base64,abc123', fileUrl: '/fake.pdf' };
    expect(component.getDocumentSrc(doc)).toBe('data:application/pdf;base64,abc123');
  });

  it('should return fileUrl with backend prefix if neither fileUrl nor base64 contains data URL in getDocumentSrc', () => {
    const doc: any = { fileUrl: '/fake.pdf' };
    expect(component.getDocumentSrc(doc)).toBe('http://localhost:3000/fake.pdf');
  });

  it('should open blob URL if available in openDocument', () => {
    const doc: any = { base64: 'data:application/pdf;base64,abc123', fileUrl: '/fake.pdf' };
    spyOn(window, 'open');
    spyOn(component, 'getDocumentSrc').and.returnValue('data:application/pdf;base64,abc123');
    // Mock getDocumentBlobUrl to return a blob URL
    const fakeBlobUrl = 'blob:http://localhost:4200/123';
    const originalGetDocumentBlobUrl = (component as any).constructor.__proto__.getDocumentBlobUrl;
    (component as any).constructor.__proto__.getDocumentBlobUrl = () => fakeBlobUrl;
    component.openDocument(doc);
    expect(window.open).toHaveBeenCalledWith(fakeBlobUrl, '_blank');
    // Restore
    (component as any).constructor.__proto__.getDocumentBlobUrl = originalGetDocumentBlobUrl;
  });

  it('should fallback to getDocumentSrc if blob URL is not available in openDocument', () => {
    const doc: any = { fileUrl: '/fake.pdf' };
    spyOn(window, 'open');
    spyOn(component, 'getDocumentSrc').and.returnValue('http://localhost:3000/fake.pdf');
    // Mock getDocumentBlobUrl to return null
    const originalGetDocumentBlobUrl = (component as any).constructor.__proto__.getDocumentBlobUrl;
    (component as any).constructor.__proto__.getDocumentBlobUrl = () => null;
    component.openDocument(doc);
    expect(window.open).toHaveBeenCalledWith('http://localhost:3000/fake.pdf', '_blank');
    // Restore
    (component as any).constructor.__proto__.getDocumentBlobUrl = originalGetDocumentBlobUrl;
  });
}); 