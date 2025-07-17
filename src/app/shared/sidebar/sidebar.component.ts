import { Component, Input, Output, EventEmitter, OnInit, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MenuItem } from '../../interfaces/auth.interface';
import { MENU_CONFIG } from '../../config/menu-config';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Input() isCollapsed = false;
  @Input() isSidebarCollapsed = false;
  @Output() stateChange = new EventEmitter<{isOpen: boolean; isCollapsed: boolean}>();

  menuItems: MenuItem[] = [];
  currentUser$ = this.authService.currentUser$;
  expandedItem: string | null = null;
  isMobile = window.innerWidth <= 768;

  // Tooltip state for collapsed sidebar
  tooltip = {
    visible: false,
    text: '',
    x: 0,
    y: 0
  };

  // Add static app links for the APP section
  appLinks = [
    { name: 'Webflow', icon: 'apps' },
    { name: 'Framer', icon: 'dashboard_customize' },
    { name: 'Typeform', icon: 'description' }
  ];

  private userSub: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize() {
    const wasNotMobile = !this.isMobile;
    this.isMobile = window.innerWidth <= 768;
    
    if (wasNotMobile && this.isMobile) {
      this.isOpen = false;
      this.emitStateChange();
    } else if (!wasNotMobile && !this.isMobile) {
      this.isOpen = true;
      this.isCollapsed = false;
      this.emitStateChange();
    }
  }

  ngOnInit() {
    this.updateMenuItems();
    this.isOpen = !this.isMobile;
    this.isCollapsed = false;
    this.emitStateChange();

    this.userSub = this.currentUser$.subscribe(() => {
      this.updateMenuItems();
    });

    // Listen to route changes to update menu for job portal public mode
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateMenuItems();
      }
    });
  }

  ngOnDestroy() {
    this.userSub?.unsubscribe();
  }

  private updateMenuItems() {
    // If in job portal public mode and on the job portal route, show only Login/Register
    const publicMode = localStorage.getItem('jobPortalPublicMode') === 'true';
    const onJobPortal = this.router.url.startsWith('/online-job-application-portal');
    if (publicMode && onJobPortal) {
      this.menuItems = [
        { name: 'Login', icon: 'login', path: '/login', permissions: [] },
        { name: 'Register', icon: 'person_add', path: '/register', permissions: [] }
      ];
      return;
    }
    // If not on the job portal, clear the flag
    if (publicMode && !onJobPortal) {
      localStorage.removeItem('jobPortalPublicMode');
    }
    // Use the imported menu configuration instead of defining items inline
    this.menuItems = this.filterMenuItemsByPermissions(MENU_CONFIG);
  }

  private filterMenuItemsByPermissions(items: MenuItem[]): MenuItem[] {
    return items
      .map(item => {
        const hasAccess = this.authService.canAccessRoute(item.permissions);
        const filteredChildren = item.children ? this.filterMenuItemsByPermissions(item.children) : [];
        if (hasAccess && filteredChildren.length > 0) {
          return { ...item, children: filteredChildren };
        }
        if (hasAccess && (!item.children || item.children.length === 0)) {
          return { ...item, children: [] };
        }
        if (!hasAccess && filteredChildren.length > 0) {
          // If parent is not accessible but has accessible children, show parent as a group
          return { ...item, children: filteredChildren };
        }
        return null;
      })
      .filter(item => item !== null) as MenuItem[];
  }

  toggleMenuItem(itemName: string, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    // If sidebar is collapsed and not mobile, expand it
    if (this.isCollapsed && !this.isMobile) {
      this.isCollapsed = false;
      this.isOpen = true;
      this.emitStateChange();
      setTimeout(() => {
        this.expandedItem = itemName;
      }, 200); // Adjust delay as needed for animation
      return;
    }

    if (this.expandedItem === itemName) {
      this.expandedItem = null;
    } else {
      this.expandedItem = itemName;
    }
  }

  isMenuItemExpanded(itemName: string): boolean {
    return this.expandedItem === itemName;
  }

  onMenuItemClick() {
    if (this.isMobile) {
      this.isOpen = false;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  showTooltip(event: MouseEvent, text: string) {
    if (this.isCollapsed && !this.isMobile) {
      this.tooltip.visible = true;
      this.tooltip.text = text;
      this.setTooltipPosition(event);
    }
  }

  moveTooltip(event: MouseEvent) {
    if (this.tooltip.visible) {
      this.setTooltipPosition(event);
    }
  }

  hideTooltip() {
    this.tooltip.visible = false;
  }

  private setTooltipPosition(event: MouseEvent) {
    // Offset the tooltip a bit to the right of the cursor
    this.tooltip.x = event.clientX + 16;
    this.tooltip.y = event.clientY + 8;
  }

  private emitStateChange() {
    this.stateChange.emit({
      isOpen: this.isOpen,
      isCollapsed: this.isCollapsed
    });
  }
} 