import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

enum ReportType {
  EMPLOYEE = 'EMPLOYEE',
  PAYROLL = 'PAYROLL',
  PERFORMANCE = 'PERFORMANCE',
  ATTENDANCE = 'ATTENDANCE',
  CUSTOM = 'CUSTOM'
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  department: string;
  lastModified: Date;
  status: 'active' | 'draft' | 'archived';
  type: ReportType;
  layout: {
    sections: string[];
    fields: string[];
    styling: {
      headerColor: string;
      fontFamily: string;
      fontSize: string;
    }
  }
}

interface GlobalLayout {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  config: {
    pageSize: string;
    margins: string;
    fontFamily: string;
    colorScheme: string[];
  }
}

@Component({
  selector: 'app-template-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './template-management.component.html',
  styleUrls: ['./template-management.component.scss']
})
export class TemplateManagementComponent implements OnInit {
  showCreateModal = false;
  showLayoutModal = false;
  editingTemplate: ReportTemplate | null = null;
  editingLayout: GlobalLayout | null = null;
  templateForm: FormGroup;
  layoutForm: FormGroup;
  reportTemplates: ReportTemplate[] = [];
  reportTypes = Object.values(ReportType);
  departments = ['All', 'Human Resources', 'Finance', 'IT Department', 'Operations'];

  globalLayouts: GlobalLayout[] = [
    {
      id: '1',
      name: 'Standard Report Layout',
      description: 'Default layout for standard reports with professional styling',
      isDefault: true,
      config: {
        pageSize: 'A4',
        margins: '2.5cm',
        fontFamily: 'Arial',
        colorScheme: ['#2563eb', '#16a34a', '#dc2626', '#eab308']
      }
    },
    {
      id: '2',
      name: 'Compact Layout',
      description: 'Space-efficient layout for detailed reports',
      isDefault: false,
      config: {
        pageSize: 'A4',
        margins: '1.5cm',
        fontFamily: 'Calibri',
        colorScheme: ['#4a90e2', '#50c878', '#ff6b6b', '#ffd700']
      }
    }
  ];

  constructor(private fb: FormBuilder) {
    this.templateForm = this.createTemplateForm();
    this.layoutForm = this.createLayoutForm();
  }

  ngOnInit() {
    this.loadSampleData();
  }

  createTemplateForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      type: ['', [Validators.required]],
      department: ['', [Validators.required]],
      sections: this.fb.array([]),
      fields: this.fb.array([]),
      styling: this.fb.group({
        headerColor: ['#4a90e2'],
        fontFamily: ['Arial'],
        fontSize: ['12pt']
      })
    });
  }

  createLayoutForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      config: this.fb.group({
        pageSize: ['A4', [Validators.required]],
        margins: ['2.5cm', [Validators.required]],
        fontFamily: ['Arial', [Validators.required]],
        colorScheme: this.fb.array([
          this.fb.control('#2563eb'),
          this.fb.control('#16a34a'),
          this.fb.control('#dc2626'),
          this.fb.control('#eab308')
        ])
      })
    });
  }

  get sections() {
    return this.templateForm.get('sections') as FormArray;
  }

  get fields() {
    return this.templateForm.get('fields') as FormArray;
  }

  get colorScheme() {
    return this.layoutForm.get('config.colorScheme') as FormArray;
  }

  addSection() {
    this.sections.push(this.fb.control(''));
  }

  removeSection(index: number) {
    this.sections.removeAt(index);
  }

  addField() {
    this.fields.push(this.fb.control(''));
  }

  removeField(index: number) {
    this.fields.removeAt(index);
  }

  addColor() {
    if (this.colorScheme.length < 6) {
      this.colorScheme.push(this.fb.control('#000000'));
    }
  }

  removeColor(index: number) {
    if (this.colorScheme.length > 1) {
      this.colorScheme.removeAt(index);
    }
  }

  openCreateTemplateModal() {
    this.editingTemplate = null;
    this.templateForm.reset({
      styling: {
        headerColor: '#4a90e2',
        fontFamily: 'Arial',
        fontSize: '12pt'
      }
    });
    this.showCreateModal = true;
  }

  openCreateLayoutModal() {
    this.editingLayout = null;
    this.layoutForm.reset({
      config: {
        pageSize: 'A4',
        margins: '2.5cm',
        fontFamily: 'Arial',
        colorScheme: ['#2563eb', '#16a34a', '#dc2626', '#eab308']
      }
    });
    this.showLayoutModal = true;
  }

  closeCreateTemplateModal() {
    this.showCreateModal = false;
    this.editingTemplate = null;
    this.templateForm.reset();
    this.sections.clear();
    this.fields.clear();
  }

  closeLayoutModal() {
    this.showLayoutModal = false;
    this.editingLayout = null;
    this.layoutForm.reset();
  }

  editTemplate(template: ReportTemplate) {
    this.editingTemplate = template;
    this.templateForm.patchValue({
      name: template.name,
      description: template.description,
      type: template.type,
      department: template.department,
      styling: template.layout.styling
    });

    // Clear and repopulate sections
    this.sections.clear();
    template.layout.sections.forEach(section => {
      this.sections.push(this.fb.control(section));
    });

    // Clear and repopulate fields
    this.fields.clear();
    template.layout.fields.forEach(field => {
      this.fields.push(this.fb.control(field));
    });

    this.showCreateModal = true;
  }

  editLayout(layout: GlobalLayout) {
    this.editingLayout = layout;
    this.layoutForm.patchValue({
      name: layout.name,
      description: layout.description,
      config: {
        pageSize: layout.config.pageSize,
        margins: layout.config.margins,
        fontFamily: layout.config.fontFamily
      }
    });

    // Clear and repopulate color scheme
    const colorSchemeArray = this.layoutForm.get('config.colorScheme') as FormArray;
    colorSchemeArray.clear();
    layout.config.colorScheme.forEach(color => {
      colorSchemeArray.push(this.fb.control(color));
    });

    this.showLayoutModal = true;
  }

  saveTemplate() {
    if (this.templateForm.valid) {
      const formValue = this.templateForm.value;
      const template: ReportTemplate = {
        id: this.editingTemplate?.id || crypto.randomUUID(),
        name: formValue.name,
        description: formValue.description,
        department: formValue.department,
        lastModified: new Date(),
        status: this.editingTemplate?.status || 'draft',
        type: formValue.type as ReportType,
        layout: {
          sections: formValue.sections.filter((s: string) => s.trim()),
          fields: formValue.fields.filter((f: string) => f.trim()),
          styling: formValue.styling
        }
      };

      if (this.editingTemplate) {
        // Update existing template
        const index = this.reportTemplates.findIndex(t => t.id === this.editingTemplate!.id);
        if (index !== -1) {
          this.reportTemplates[index] = template;
        }
      } else {
        // Add new template
        this.reportTemplates.push(template);
      }

      this.closeCreateTemplateModal();
    }
  }

  saveLayout() {
    if (this.layoutForm.valid) {
      const formValue = this.layoutForm.value;
      const layout: GlobalLayout = {
        id: this.editingLayout?.id || crypto.randomUUID(),
        name: formValue.name,
        description: formValue.description,
        isDefault: this.editingLayout?.isDefault || false,
        config: {
          pageSize: formValue.config.pageSize,
          margins: formValue.config.margins,
          fontFamily: formValue.config.fontFamily,
          colorScheme: formValue.config.colorScheme.filter((c: string) => c.trim())
        }
      };

      if (this.editingLayout) {
        // Update existing layout
        const index = this.globalLayouts.findIndex(l => l.id === this.editingLayout!.id);
        if (index !== -1) {
          this.globalLayouts[index] = layout;
        }
      } else {
        // Add new layout
        this.globalLayouts.push(layout);
      }

      this.closeLayoutModal();
    }
  }

  deleteTemplate(id: string) {
    if (confirm('Are you sure you want to delete this template?')) {
      const index = this.reportTemplates.findIndex(t => t.id === id);
      if (index !== -1) {
        this.reportTemplates.splice(index, 1);
      }
    }
  }

  deleteLayout(id: string) {
    if (confirm('Are you sure you want to delete this layout?')) {
      const index = this.globalLayouts.findIndex(l => l.id === id);
      if (index !== -1 && !this.globalLayouts[index].isDefault) {
        this.globalLayouts.splice(index, 1);
      } else {
        alert('Cannot delete the default layout');
      }
    }
  }

  setDefaultLayout(id: string) {
    this.globalLayouts.forEach(layout => {
      layout.isDefault = layout.id === id;
    });
  }

  previewTemplate(template: ReportTemplate) {
    // TODO: Implement template preview functionality
    console.log('Previewing template:', template);
  }

  previewLayout(layout: GlobalLayout) {
    // TODO: Implement layout preview functionality
    console.log('Previewing layout:', layout);
  }

  getTemplateStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
        return '#28a745';
      case 'draft':
        return '#ffc107';
      case 'archived':
        return '#6c757d';
      default:
        return '#6c757d';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  private loadSampleData() {
    this.reportTemplates = [
      {
        id: '1',
        name: 'Monthly Financial Report',
        description: 'Standard financial report template with income statement and balance sheet sections',
        department: 'Finance',
        lastModified: new Date('2024-03-15'),
        status: 'active',
        type: ReportType.PAYROLL,
        layout: {
          sections: ['Income Statement', 'Balance Sheet', 'Cash Flow'],
          fields: ['Revenue', 'Expenses', 'Net Income', 'Assets', 'Liabilities'],
          styling: {
            headerColor: '#4a90e2',
            fontFamily: 'Arial',
            fontSize: '12pt'
          }
        }
      },
      {
        id: '2',
        name: 'Employee Performance Review',
        description: 'Quarterly performance evaluation template',
        department: 'Human Resources',
        lastModified: new Date('2024-03-10'),
        status: 'draft',
        type: ReportType.EMPLOYEE,
        layout: {
          sections: ['Goals', 'Achievements', 'Areas for Improvement'],
          fields: ['Employee Name', 'Department', 'Manager', 'Rating', 'Comments'],
          styling: {
            headerColor: '#28a745',
            fontFamily: 'Calibri',
            fontSize: '11pt'
          }
        }
      }
    ];
  }
}
