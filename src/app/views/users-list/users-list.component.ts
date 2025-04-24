import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';

import {
  RowComponent,
  ColComponent,
  TextColorDirective,
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  TableDirective,
  TableColorDirective,
  TableActiveDirective,
  BorderDirective,
  ButtonDirective,
  InputGroupComponent,
  FormControlDirective,
  FormTextDirective,
} from '@coreui/angular';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    FormTextDirective,
    CommonModule,
    RowComponent,
    ColComponent,
    TextColorDirective,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    TableDirective,
    TableColorDirective,
    TableActiveDirective,
    BorderDirective,
    ButtonDirective,
    FormsModule,

    InputGroupComponent,
    FormControlDirective,
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent implements OnInit {
  users: any[] = [];

  selectedUser: any = null;
  isEditWidgetVisible = false;
  isCreateWidgetVisible = false;
  newUser: any = {};
  createUserForm: FormGroup;

  constructor(private userService: UserService, private fb: FormBuilder) {
    // Inject FormBuilder
    this.createUserForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required],
    });
  }

  onViewUser(user: any) {
    this.selectedUser = { ...user }; // clone to avoid two-way binding issues
    this.isEditWidgetVisible = true;
  }

  onCloseWidget() {
    this.selectedUser = null;
    this.isEditWidgetVisible = false;
    this.isCreateWidgetVisible = false;
    this.createUserForm.reset(); // Reset the form on close
  }

  onSaveChanges() {
    if (this.selectedUser) {
      this.userService
        .updateUser(this.selectedUser._id, this.selectedUser)
        .subscribe({
          next: () => {
            this.isEditWidgetVisible = false;
            this.fetchUsers(); // refresh list
          },
          error: (err) => {
            console.error('Failed to update user:', err);
          },
        });
    }
  }

  openCreateUserModal() {
    this.isCreateWidgetVisible = true;
    this.createUserForm.reset(); // Reset the form when opening
  }

  createUser() {
    console.log('Creating user with data:', this.createUserForm.value);

    if (this.createUserForm.valid) {
      this.userService.createUser(this.createUserForm.value).subscribe({
        next: (response) => {
          console.log('User created successfully:', response);
          this.isCreateWidgetVisible = false;
          this.createUserForm.reset();
          this.fetchUsers();
        },
        error: (error) => {
          console.error('Failed to create user:', error);
        },
      });
    } else {
      console.log('Form is invalid:', this.createUserForm.errors);
    }
  }

  deleteUser(user: any) {
    if (
      confirm(
        `Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.firstName} ${user.lastName} ?`
      )
    ) {
      this.userService.deleteUser(user._id).subscribe({
        next: () => {
          this.fetchUsers(); // Refresh the user list after deletion
        },
        error: (error) => {
          console.error('Failed to delete user:', error);
        },
      });
    }
  }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    this.userService.getUsersList({}).subscribe({
      next: (response) => {
        this.users = response.users;
      },
      error: (error) => {
        console.error('Failed to fetch users:', error);
      },
    });
  }
}
