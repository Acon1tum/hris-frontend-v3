import { Component, OnInit, HostListener, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PersonnelService, Employee } from '../personnel.service';
import { AuthService } from '../../../services/auth.service';

interface DepartmentStat {
  name: string;
  count: number;
  percentage: number;
}

interface StatCard {
  id: string;
  title: string;
  value: number;
  change: number;
  icon: string;
  description: string;
  isVisible: boolean;
  color: string;
  dataType: 'number' | 'percentage' | 'rating';
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CdkDrag,
    CdkDropList
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  @ViewChild(CdkDropList) dropList?: CdkDropList;
  
  title = 'Personnel Information Management';
  
  // Dashboard stats
  totalEmployees = 345;
  employeeChange = 5;
  pendingRequests = 12;
  requestChange = -2;
  recentMovements = 23;
  movementChange = 3;

  // Analytics metrics
  turnoverRate = 8.5;
  turnoverRateChange = 1.2;
  satisfactionLevel = 4.2;
  satisfactionChange = 0.3;
  performanceRating = 85;
  performanceChange = 2.5;

  departmentStats: DepartmentStat[] = [
    { name: 'IT', count: 45, percentage: 30 },
    { name: 'HR', count: 30, percentage: 20 },
    { name: 'Finance', count: 25, percentage: 17 },
    { name: 'Marketing', count: 20, percentage: 13 },
    { name: 'Operations', count: 30, percentage: 20 },
    { name: 'Graphics', count: 20, percentage: 40 }
  ];

  recentEmployees: Employee[] = [];

  // Pagination properties
  currentPage = 1;
  pageSize = 5;
  totalItems = 0;
  totalPages = 0;
  searchTerm = '';
  paginatedEmployees: Employee[] = [];
  Math = Math; // Make Math available in template

  showEditModal = false;
  editEmployeeForm: FormGroup;
  selectedEmployee: Employee | null = null;

  isEditMode = false;
  selectedCard: StatCard | null = null;
  showCustomizeModal = false;
  customizeForm: FormGroup;
  availableColors = [
    { name: 'White', value: '#fff' },
    { name: 'Blue', value: '#649dfa' },
    { name: 'Green', value: '#38ffbd' },
    { name: 'Purple', value: '#a182e8' },
    { name: 'Orange', value: '#fc9751' },
    { name: 'Yellow', value: '#f4fa57' },
    { name: 'Cyan', value: "#02faf6"}
  ];

  statCards: StatCard[] = [
    {
      id: 'totalEmployees',
      title: 'Total Employees',
      value: 0,
      change: 0,
      icon: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png',
      description: 'Current headcount',
      isVisible: true,
      color: '#1993e5',
      dataType: 'number'
    },
    {
      id: 'pendingRequests',
      title: 'Pending Requests',
      value: 0,
      change: 0,
      icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828843.png',
      description: 'Awaiting approval',
      isVisible: true,
      color: '#1993e5',
      dataType: 'number'
    },
    {
      id: 'recentMovements',
      title: 'Recent Movements',
      value: 0,
      change: 0,
      icon: 'https://cdn-icons-png.flaticon.com/512/747/747310.png',
      description: 'Last 30 days',
      isVisible: true,
      color: '#1993e5',
      dataType: 'number'
    },
    {
      id: 'turnoverRate',
      title: 'Employee Turnover Rate',
      value: 0,
      change: 0,
      icon: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png',
      description: 'Last 12 months',
      isVisible: true,
      color: '#1993e5',
      dataType: 'percentage'
    },
    {
      id: 'satisfactionLevel',
      title: 'Average Satisfaction Level',
      value: 0,
      change: 0,
      icon: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png',
      description: 'Employee survey',
      isVisible: true,
      color: '#1993e5',
      dataType: 'percentage'
    },
    {
      id: 'performanceRating',
      title: 'Performance Rating',
      value: 0,
      change: 0,
      icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828971.png',
      description: 'Average score',
      isVisible: true,
      color: '#1993e5',
      dataType: 'rating'
    }
  ];

  // New container template
  newCardTemplate: StatCard = {
    id: 'new',
    title: 'New Stat',
    value: 0,
    change: 0,
    icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828843.png',
    description: 'Add description',
    isVisible: true,
    color: '#fff',
    dataType: 'number'
  };

  pieColors = ['#1993e5', '#10b981', '#f97316', '#8b5cf6', '#ef4444', '#6366f1', '#f59e42', '#22d3ee'];

  chartTypes: Array<'pie' | 'bar' | 'line' | 'area'> = ['pie', 'bar', 'line', 'area'];
  currentChartTypeIndex = 0;
  chartType: 'pie' | 'bar' | 'line' | 'area' = 'pie';

  showChartTypeMenu = false;

  isChartEditMode = false;

  // Tooltip state for chart hover
  chartTooltip = {
    visible: false,
    x: 0,
    y: 0,
    label: '',
    value: 0
  };

  totalActiveEmployees = 300;
  totalInactiveEmployees = 30;
  totalOnleaveEmployees = 15;

  metricOptions: {
    title: string;
    value: number;
    description: string;
    dataType: 'number' | 'percentage' | 'rating';
  }[] = [
    {
      title: 'Total Employees',
      value: this.totalEmployees,
      description: 'Current headcount',
      dataType: 'number'
    },
    {
      title: 'Pending Requests',
      value: this.pendingRequests,
      description: 'Awaiting approval',
      dataType: 'number'
    },
    {
      title: 'Recent Movements',
      value: this.recentMovements,
      description: 'Last 30 days',
      dataType: 'number'
    },
    {
      title: 'Employee Turnover Rate',
      value: this.turnoverRate,
      description: 'Last 12 months',
      dataType: 'percentage'
    },
    {
      title: 'Average Satisfaction Level',
      value: this.satisfactionLevel,
      description: 'Employee survey',
      dataType: 'percentage'
    },
    {
      title: 'Performance Rating',
      value: this.performanceRating,
      description: 'Average score',
      dataType: 'rating'
    },
    {
      title: 'Total Active Employees',
      value: this.totalActiveEmployees,
      description: 'Active employees',
      dataType: 'number'
    },
    {
      title: 'Total Inactive Employees',
      value: this.totalInactiveEmployees,
      description: 'Inactive employees',
      dataType: 'number'
    },
    {
      title: 'Total Onleave Employees',
      value: this.totalOnleaveEmployees,
      description: 'Employees on leave',
      dataType: 'number'
    }
  ];

  titleIconMap: { [key: string]: string } = {
    'Total Employees': 'https://cdn-icons-png.flaticon.com/512/2922/2922510.png',
    'Pending Requests': 'https://cdn-icons-png.flaticon.com/512/3596/3596095.png', 
    'Recent Movements': 'https://cdn-icons-png.flaticon.com/512/3303/3303892.png', 
    'Employee Turnover Rate': 'https://cdn-icons-png.flaticon.com/512/1040/1040230.png',
    'Average Satisfaction Level': 'https://cdn-icons-png.flaticon.com/512/2583/2583395.png', 
    'Performance Rating': 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png', 
    'Total Active Employees': 'https://cdn-icons-png.flaticon.com/512/190/190411.png', 
    'Total Inactive Employees': 'https://cdn-icons-png.flaticon.com/512/1828/1828843.png',
    'Total Onleave Employees': 'https://cdn-icons-png.flaticon.com/512/11498/11498606.png' 
  };  

  loadingEmployees = false;
  employeeLoadError = '';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private renderer: Renderer2,
    private personnelService: PersonnelService,
    private authService: AuthService
  ) {
    this.editEmployeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      position: ['', Validators.required],
      hireDate: ['', Validators.required],
      status: ['Active', Validators.required]
    });

    this.customizeForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      color: ['#fff'],
      dataType: ['number'],
      isVisible: [true]
    });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    this.checkScroll();
  }

  ngOnInit(): void {
    const savedCards = localStorage.getItem('statCards');
    if (savedCards) {
      this.statCards = JSON.parse(savedCards);
    }
    // Restore chart type if present
    const savedChartType = localStorage.getItem('chartType');
    if (savedChartType && this.chartTypes.includes(savedChartType as any)) {
      this.chartType = savedChartType as any;
      this.currentChartTypeIndex = this.chartTypes.indexOf(this.chartType);
    }
    this.updatePagination();
    setTimeout(() => {
      this.checkScroll();
    }, 100);
    // Initialize stat cards with actual data
    this.statCards[0].value = this.totalEmployees;
    this.statCards[0].change = this.employeeChange;
    this.statCards[1].value = this.pendingRequests;
    this.statCards[1].change = this.requestChange;
    this.statCards[2].value = this.recentMovements;
    this.statCards[2].change = this.movementChange;
    this.statCards[3].value = this.turnoverRate;
    this.statCards[3].change = this.turnoverRateChange;
    this.statCards[4].value = this.satisfactionLevel;
    this.statCards[4].change = this.satisfactionChange;
    this.statCards[5].value = this.performanceRating;
    this.statCards[5].change = this.performanceChange;
    this.fetchEmployees();
  }

  fetchEmployees() {
    this.loadingEmployees = true;
    this.employeeLoadError = '';
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    this.personnelService.getPersonnel(this.currentPage, this.pageSize, this.searchTerm)
      .subscribe({
        next: (res) => {
          this.recentEmployees = res.data;
          this.totalItems = res.pagination?.total || res.data.length;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);
          this.updatePagination();
          this.loadingEmployees = false;
        },
        error: (err) => {
          this.employeeLoadError = 'Failed to load employees.';
          this.loadingEmployees = false;
        }
      });
  }

  // Pagination methods
  updatePagination() {
    // Use backend pagination: just assign the result
    this.paginatedEmployees = this.recentEmployees;
  }

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
    this.currentPage = page;
    this.fetchEmployees();
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
    this.fetchEmployees();
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.currentPage = 1;
    this.fetchEmployees();
  }

  onAddEmployee(): void {
    this.router.navigate(['/personnel-information-management/add-employee']);
  }

  onEditEmployee(employee: Employee) {
    this.selectedEmployee = employee;
    this.editEmployeeForm.patchValue({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      department: employee.department,
      position: employee.position,
      hireDate: employee.hireDate,
      status: employee.status
    });
    this.showEditModal = true;
  }

  closeEditModal(event: Event) {
    event.preventDefault();
    this.showEditModal = false;
    this.selectedEmployee = null;
    this.editEmployeeForm.reset();
  }

  onSubmitEdit() {
    if (this.editEmployeeForm.valid && this.selectedEmployee) {
      // Here you would typically make an API call to update the employee
      const updatedEmployee = {
        ...this.selectedEmployee,
        ...this.editEmployeeForm.value
      };

      // Update the employee in the local array
      const index = this.recentEmployees.findIndex(emp => emp.id === this.selectedEmployee?.id);
      if (index !== -1) {
        this.recentEmployees[index] = updatedEmployee;
      }

      // Close the modal
      this.closeEditModal(new Event('click'));
    }
  }

  onDeleteEmployee(employee: Employee): void {
    if (confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
      // Call service to delete employee
      console.log('Deleting employee:', employee);
    }
  }

  onProcessRequests(): void {
    this.router.navigate(['/personnel-information-management/requests']);
  }

  getDepartmentIcon(department: string): string {
    const icons: { [key: string]: string } = {
      'IT': 'computer',
      'HR': 'group',
      'Finance': 'account_balance',
      'Marketing': 'campaign',
      'Operations': 'settings',
      'Engineering': 'engineering',
      'Sales': 'trending_up',
      'Customer Support': 'support_agent',
      'Research': 'science',
      'Legal': 'gavel',
      'Product': 'inventory_2',
      'Design': 'palette'
    };
    return icons[department] || 'business';
  }

  private checkScroll() {
    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const isVisible = (rect.top <= window.innerHeight * 0.95);
      
      if (isVisible) {
        element.classList.add('visible');
      }
    });
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (this.dropList) {
      const dropListElement = this.dropList.element.nativeElement;
      if (this.isEditMode) {
        this.renderer.addClass(dropListElement, 'edit-mode');
      } else {
        this.renderer.removeClass(dropListElement, 'edit-mode');
        this.saveDashboardChanges();
        this.saveStatCardsToStorage(); // Save card order on save
      }
    }
  }

  saveDashboardChanges() {
    // Here you would typically make an API call to save the dashboard changes
    console.log('Saving dashboard changes...');
  }

  onCardClick(card: StatCard) {
    if (this.isEditMode) {
      // Make a shallow copy for editing
      this.selectedCard = { ...card };
      this.customizeForm.patchValue({
        title: card.title,
        description: card.description,
        color: card.color,
        dataType: card.dataType,
        isVisible: card.isVisible
      });
      this.showCustomizeModal = true;
    }
  }

  saveCustomization() {
    if (this.selectedCard && this.customizeForm.valid) {
      const formValue = this.customizeForm.value;
      // Find the card in statCards by id and update it
      const idx = this.statCards.findIndex(c => c.id === this.selectedCard!.id);
      if (idx !== -1) {
        this.statCards[idx] = {
          ...this.statCards[idx],
          ...formValue,
          icon: this.titleIconMap[formValue.title]
        };
      } else {
        // If not found, it's a new card (from addNewCard)
        const newCard: StatCard = {
          ...this.selectedCard,
          ...formValue,
          icon: this.titleIconMap[formValue.title]
        };
        this.statCards.push(newCard);
      }
      this.showCustomizeModal = false;
      this.selectedCard = null;
      this.saveStatCardsToStorage();
    }
  }

  closeCustomizeModal(event: Event) {
    event.preventDefault();
    this.showCustomizeModal = false;
    this.selectedCard = null;
  }

  getFormattedValue(card: StatCard): string {
    switch (card.dataType) {
      case 'percentage':
        return `${card.value}%`;
      case 'rating':
        return `${card.value}/5`;
      default:
        return card.value.toString();
    }
  }

  onDrop(event: CdkDragDrop<StatCard[]>) {
    if (this.isEditMode) {
      const draggedElement = event.item.element.nativeElement;
      const previousIndex = event.previousIndex;
      const cards = Array.from(this.dropList?.element.nativeElement.children || []);
      let pointerX: number | null = null;
      let pointerY: number | null = null;
      if ((event as any).event && (event as any).event.clientX !== undefined) {
        pointerX = (event as any).event.clientX;
        pointerY = (event as any).event.clientY;
      }
      let dropCenter = { x: 0, y: 0 };
      if (pointerX !== null && pointerY !== null) {
        dropCenter = { x: pointerX, y: pointerY };
      } else {
        const draggedRect = draggedElement.getBoundingClientRect();
        dropCenter = {
          x: draggedRect.left + draggedRect.width / 2,
          y: draggedRect.top + draggedRect.height / 2
        };
      }
      let minDistance = Number.MAX_VALUE;
      let nearestIndex = previousIndex;
      cards.forEach((card: any, idx: number) => {
        if (idx === previousIndex) return;
        const rect = card.getBoundingClientRect();
        const center = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };
        const distance = Math.sqrt(
          Math.pow(center.x - dropCenter.x, 2) +
          Math.pow(center.y - dropCenter.y, 2)
        );
        if (distance < minDistance) {
          minDistance = distance;
          nearestIndex = idx;
        }
      });
      if (previousIndex !== nearestIndex) {
        const temp = this.statCards[previousIndex];
        this.statCards[previousIndex] = this.statCards[nearestIndex];
        this.statCards[nearestIndex] = temp;
        this.saveStatCardsToStorage(); // Save card order after swap
      }
    }
  }

  onDragStarted(event: any) {
    if (this.isEditMode) {
      document.body.classList.add('dragging');
      
      // Add a class to the dragged element
      const draggedElement = event.source.element.nativeElement;
      this.renderer.addClass(draggedElement, 'dragging');

      // Add a class to the drop list
      if (this.dropList) {
        const dropListElement = this.dropList.element.nativeElement;
        this.renderer.addClass(dropListElement, 'dragging-active');
        this.renderer.addClass(dropListElement, 'edit-mode');
      }
    }
  }

  onDragEnded(event: any) {
    document.body.classList.remove('dragging');
    
    // Remove classes from the dragged element
    const draggedElement = event.source.element.nativeElement;
    this.renderer.removeClass(draggedElement, 'dragging');
    this.renderer.removeClass(draggedElement, 'swapping');
    this.renderer.removeStyle(draggedElement, 'transform');

    // Remove class from the drop list
    if (this.dropList) {
      const dropListElement = this.dropList.element.nativeElement;
      this.renderer.removeClass(dropListElement, 'dragging-active');
    }
  }

  addNewCard() {
    if (this.isEditMode) {
      // Prepare a new card but do not add to statCards yet
      const newCard: StatCard = {
        ...this.newCardTemplate,
        id: `card-${Date.now()}` // Generate unique ID
      };
      this.selectedCard = { ...newCard };
      this.customizeForm.patchValue({
        title: newCard.title,
        description: newCard.description,
        color: newCard.color,
        dataType: newCard.dataType,
        isVisible: newCard.isVisible
      });
      this.showCustomizeModal = true;
    }
  }

  removeCard(card: StatCard) {
    if (this.isEditMode) {
      const index = this.statCards.findIndex(c => c.id === card.id);
      if (index !== -1) {
        this.statCards.splice(index, 1);
      }
    }
  }

  getPieColor(index: number): string {
    return this.pieColors[index % this.pieColors.length];
  }

  getPieDashArray(index: number): string {
    const total = this.departmentStats.reduce((sum, d) => sum + d.count, 0);
    const value = this.departmentStats[index].count;
    const circumference = 2 * Math.PI * 90;
    const dash = (value / total) * circumference;
    return `${dash} ${circumference - dash}`;
  }

  getPieDashOffset(index: number): string {
    const total = this.departmentStats.reduce((sum, d) => sum + d.count, 0);
    const circumference = 2 * Math.PI * 90;
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += (this.departmentStats[i].count / total) * circumference;
    }
    return `${-offset}`;
  }

  setChartType(type: 'pie' | 'bar' | 'line' | 'area') {
    this.chartType = type;
    this.currentChartTypeIndex = this.chartTypes.indexOf(type);
  }

  prevChartType() {
    this.currentChartTypeIndex = (this.currentChartTypeIndex - 1 + this.chartTypes.length) % this.chartTypes.length;
    this.chartType = this.chartTypes[this.currentChartTypeIndex];
  }

  nextChartType() {
    this.currentChartTypeIndex = (this.currentChartTypeIndex + 1) % this.chartTypes.length;
    this.chartType = this.chartTypes[this.currentChartTypeIndex];
  }

  getChartTypeLabel(): string {
    switch (this.chartType) {
      case 'pie': return 'Pie';
      case 'bar': return 'Bar';
      case 'line': return 'Line';
      case 'area': return 'Area';
      default: return '';
    }
  }

  toggleChartTypeMenu() {
    this.showChartTypeMenu = !this.showChartTypeMenu;
  }

  getMaxDeptCount(): number {
    return this.departmentStats.reduce((max, d) => Math.max(max, d.count), 0) || 1;
  }

  getLineChartPoints(xOffset = 0, yOffset = 0): string {
    if (!this.departmentStats || !this.departmentStats.length) return '';
    return this.departmentStats.map((dept, i) => {
      const x = 54 + i * 40 + xOffset;
      const y = 200 - (dept.count / this.getMaxDeptCount()) * 160 + yOffset;
      return `${x},${y}`;
    }).join(' ');
  }

  getAreaChartPoints(xOffset = 0, yOffset = 0): string {
    if (!this.departmentStats || !this.departmentStats.length) return '';
    let points = this.departmentStats.map((dept, i) => {
      const x = 54 + i * 40 + xOffset;
      const y = 200 - (dept.count / this.getMaxDeptCount()) * 160 + yOffset;
      return `${x},${y}`;
    });
    // Close the area shape to the bottom
    points.push(`${54 + (this.departmentStats.length - 1) * 40 + xOffset},200`);
    points.push(`54,200`);
    return points.join(' ');
  }

  getDepartmentTotal(): number {
    return this.departmentStats.reduce((acc, d) => acc + d.count, 0);
  }

  getDepartmentPercentage(dept: DepartmentStat): number {
    const total = this.getDepartmentTotal();
    return total ? (dept.count / total) * 100 : 0;
  }

  // Helper for column chart (optional, but for demo, columns are like bars with spacing)
  getColumnChartX(i: number): number {
    return 20 + i * 35;
  }

  getColumnChartHeight(dept: DepartmentStat): number {
    return (dept.count / this.getMaxDeptCount()) * 180;
  }

  getColumnChartY(dept: DepartmentStat): number {
    return 220 - this.getColumnChartHeight(dept) - 20;
  }

  enterChartEditMode() {
    this.isChartEditMode = true;
  }

  exitChartEditMode() {
    this.isChartEditMode = false;
    this.saveChartTypeToStorage();
  }

  showChartTooltip(event: MouseEvent, label: string, value: number) {
    this.chartTooltip.visible = true;
    this.chartTooltip.x = event.clientX;
    this.chartTooltip.y = event.clientY;
    this.chartTooltip.label = label;
    this.chartTooltip.value = value;
  }

  moveChartTooltip(event: MouseEvent) {
    if (this.chartTooltip.visible) {
      this.chartTooltip.x = event.clientX;
      this.chartTooltip.y = event.clientY;
    }
  }

  hideChartTooltip() {
    this.chartTooltip.visible = false;
  }

  ngAfterViewInit() {
    const elements = document.querySelectorAll('.scroll-animate');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });

    elements.forEach(el => observer.observe(el));
  }

  onTitleChange(event: Event) {
    const selectedTitle = (event.target as HTMLSelectElement).value;
    const metric = this.metricOptions.find((m: { title: string }) => m.title === selectedTitle);
    if (metric && this.selectedCard) {
      this.customizeForm.patchValue({
        title: metric.title,
        description: metric.description,
        dataType: metric.dataType
      });
      this.selectedCard.value = metric.value;
      this.selectedCard.description = metric.description;
      this.selectedCard.dataType = metric.dataType;
      this.selectedCard.icon = this.titleIconMap[metric.title];
    }
  }

  saveStatCardsToStorage() {
    localStorage.setItem('statCards', JSON.stringify(this.statCards));
  }

  saveChartTypeToStorage() {
    localStorage.setItem('chartType', this.chartType);
  }

  getPreviewCard(): StatCard {
    if (!this.selectedCard) {
      // Fallback: return a default card
      return {
        id: '',
        title: this.customizeForm.get('title')?.value || '',
        value: 0,
        change: 0,
        icon: '',
        description: this.customizeForm.get('description')?.value || '',
        isVisible: true,
        color: this.customizeForm.get('color')?.value || '#fff',
        dataType: this.customizeForm.get('dataType')?.value || 'number'
      };
    }
    return {
      ...this.selectedCard,
      title: this.customizeForm.get('title')?.value ?? this.selectedCard.title,
      description: this.customizeForm.get('description')?.value ?? this.selectedCard.description,
      color: this.customizeForm.get('color')?.value ?? this.selectedCard.color,
      dataType: this.customizeForm.get('dataType')?.value ?? this.selectedCard.dataType,
      isVisible: this.customizeForm.get('isVisible')?.value ?? this.selectedCard.isVisible
    };
  }
} 