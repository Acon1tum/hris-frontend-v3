import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-online-job-login',
  templateUrl: './online-job-login.component.html',
  styleUrls: ['./online-job-login.component.scss']
})
export class OnlineJobLoginComponent {
  constructor(private router: Router) {}
  // Add login logic here in the future
  goToRegister() {
    this.router.navigate(['/online-job-register']);
  }
}
