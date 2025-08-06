# Job Application Modal Component

A comprehensive, multi-step modal component for job applications based on the JobApplication model from the Prisma schema.

## Features

- **Multi-step form** with progress indicator
- **Auto-filled user details** (firstname, middlename, lastname, email, contact)
- **Form validation** with real-time feedback
- **Responsive design** that works on all devices
- **Modern UI** with smooth animations
- **Accessibility** features included

## Component Structure

```
job-application-modal/
├── job-application-modal.component.ts      # Main component logic
├── job-application-modal.component.html    # Template
├── job-application-modal.component.scss    # Styles
├── job-application-modal-demo.component.ts # Usage example
└── README.md                              # This file
```

## Usage

### Basic Implementation

```typescript
import { JobApplicationModalComponent, JobApplicationForm } from './job-application-modal.component';

@Component({
  selector: 'app-my-component',
  template: `
    <button (click)="openModal()">Apply for Job</button>
    
    <app-job-application-modal
      [showModal]="showModal"
      [job]="selectedJob"
      (close)="closeModal()"
      (applicationSubmitted)="onApplicationSubmitted($event)"
    ></app-job-application-modal>
  `
})
export class MyComponent {
  showModal = false;
  selectedJob: any = {
    id: 'job-123',
    position_title: 'Software Engineer',
    department: { department_name: 'IT Department' }
  };

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onApplicationSubmitted(applicationData: JobApplicationForm) {
    console.log('Application submitted:', applicationData);
    // Send to your backend API
  }
}
```

### Input Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `showModal` | `boolean` | Yes | Controls modal visibility |
| `job` | `any` | Yes | Job posting data |

### Output Events

| Event | Type | Description |
|-------|------|-------------|
| `close` | `EventEmitter<void>` | Emitted when modal is closed |
| `applicationSubmitted` | `EventEmitter<JobApplicationForm>` | Emitted when application is submitted |

### JobApplicationForm Interface

```typescript
export interface JobApplicationForm {
  position_id: string;
  applicant_id: string;
  cover_letter?: string;
  status: 'Pending' | 'Pre_Screening' | 'For_Interview' | 'For_Examination' | 'Shortlisted' | 'Selected' | 'Rejected' | 'Withdrawn' | 'Hired';
  application_date: Date;
  withdrawn_date?: Date;
  remarks?: string;
}
```

## Form Steps

### Step 1: Personal Information
- Auto-filled from user profile
- Read-only fields for verification
- Includes: First Name, Middle Name, Last Name, Email, Contact, Application Date

### Step 2: Cover Letter
- Required cover letter (minimum 100 characters)
- Optional additional remarks (maximum 500 characters)
- Real-time character count
- Form validation with error messages

### Step 3: Review & Submit
- Summary of all entered information
- Confirmation checkbox
- Submit button with loading state

## Styling

The component uses modern CSS with:
- CSS Grid for responsive layouts
- Flexbox for alignment
- CSS custom properties for theming
- Smooth animations and transitions
- Mobile-first responsive design

## Dependencies

- Angular CommonModule
- Angular FormsModule
- Angular ReactiveFormsModule
- Material Symbols (for icons)

## Integration with Backend

The component expects the following data structure for the job object:

```typescript
interface Job {
  id: string;
  position_title: string;
  department: {
    department_name: string;
  };
  job_description?: string;
  qualifications?: string;
  salary_range?: string;
  employment_type?: string;
  num_vacancies?: number;
  application_deadline?: Date;
}
```

## User Authentication

The component automatically retrieves user details from the `JobPortalAuthService`. Make sure the service is properly configured and the user is authenticated before opening the modal.

## Error Handling

The component includes comprehensive error handling:
- Form validation errors
- Network error handling (when integrated with API)
- User-friendly error messages
- Loading states

## Accessibility

- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- High contrast support

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Customization

You can customize the component by:
- Modifying the SCSS variables
- Extending the component class
- Overriding the template
- Adding additional form fields

## Example Integration

See `job-application-modal-demo.component.ts` for a complete example of how to integrate the modal into your application. 