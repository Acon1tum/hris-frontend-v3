import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-online-job-register',
  templateUrl: './online-job-register.component.html',
  styleUrls: ['./online-job-register.component.scss']
})
export class OnlineJobRegisterComponent {
  constructor(private router: Router) {}
  // Add register logic here in the future
  goToLogin() {
    this.router.navigate(['/online-job-login']);
  }
}
