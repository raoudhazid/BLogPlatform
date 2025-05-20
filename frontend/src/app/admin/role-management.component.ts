import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss'],
})
export class RoleManagementComponent implements OnInit {
  users: any[] = [];
  roles = ['Admin', 'Editor', 'Writer', 'Reader','Raoudha'];
  loading = false;
  error = '';

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit() {
    if (this.authService.getRole() === 'Admin') {
      this.loading = true;
      this.userService.getUsers().subscribe({
        next: (users) => {
          this.users = users;
          this.loading = false;
        },
        error: (err) => {
          this.error = err.message;
          this.loading = false;
        },
      });
    }
  }

  updateRole(userId: string, role: string) {
    this.userService.updateRole(userId, role).subscribe({
      next: () => {
        this.users = this.users.map((user) =>
          user._id === userId ? { ...user, role } : user
        );
      },
      error: (err) => (this.error = err.message),
    });
  }
}