import { CommonModule, UpperCasePipe } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { AuthService } from '../../Services/Auth.Service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [UpperCasePipe, CommonModule],
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent  {
  @Input() title = '';

  showLogoutModal = false;
  private auth = inject(AuthService);
  private router = inject(Router);

  onUserIconClick() {
    this.showLogoutModal = true;
  }

  closeLogoutModal() {
    this.showLogoutModal = false;
  }

  logout() {
    this.auth.logout();
    this.showLogoutModal = false;
    this.router.navigate(['/login']);
  }
}
