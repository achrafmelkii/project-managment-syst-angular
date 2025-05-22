import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User, UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  SkillsService, // Import SkillsService
  Skill,
} from '../../services/skills.service'; // And Skill type
import {
  CardModule,
  GridModule,
  ButtonModule,
  FormModule,
  SpinnerModule,
  AvatarModule,
  AlertModule,
  // If using CoreUI's FormSelect, import it:
  // FormSelectModule
} from '@coreui/angular';
import {
  CardComponent,
  CardBodyComponent,
  CardHeaderComponent,
  ButtonDirective,
  FormControlDirective,
  SpinnerComponent,
  AvatarComponent,
  AlertComponent,
  FormFeedbackComponent,
  FormLabelDirective,
  FormCheckComponent,
  InputGroupComponent,
  RowComponent,
  ColComponent,
  // FormSelectDirective // If using CoreUI's FormSelect
} from '@coreui/angular';

@Component({
  selector: 'app-user-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    GridModule,
    ButtonModule,
    FormModule,
    SpinnerModule,
    AvatarModule,
    AlertModule,
    // FormSelectModule, // If using CoreUI's FormSelect
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    ButtonDirective,
    FormControlDirective,
    SpinnerComponent,
    AvatarComponent,
    AlertComponent,
    FormFeedbackComponent,
    FormLabelDirective,
    FormCheckComponent,
    InputGroupComponent,
    RowComponent,
    ColComponent,
    // FormSelectDirective, // If using CoreUI's FormSelect
  ],
})
export class UserProfileComponent implements OnInit {
  user: User | null = null; // Strongly type user
  profileForm!: FormGroup;
  isEditing = false;
  isLoading = true; // For general profile loading/saving
  isImageLoading = false; // For image-specific operations if any

  errorMessage: string | null = null;
  successMessage: string | null = null;

  selectedFile: File | null = null;
  imagePreview: string | null = null;

  availableSkills: Skill[] = [];

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private skillsService: SkillsService, // Inject SkillsService
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm(); // Initialize with empty structure first
    this.loadUserData();
    this.loadAvailableSkills();
  }

  // Custom validator for max skills
  maxSkillsValidator(max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedSkills = control.value as any[]; // Value from multi-select is an array of skill names
      if (selectedSkills && selectedSkills.length > max) {
        return {
          maxSkills: { requiredCount: max, actualCount: selectedSkills.length },
        };
      }
      return null;
    };
  }

  initForm(userData?: User): void {
    let currentSkillNames: string[] = [];
    if (userData && userData.skills && Array.isArray(userData.skills)) {
      currentSkillNames = userData.skills
        .filter((skill: any): skill is Skill => skill && typeof skill.name === 'string')
        .map((skill: Skill) => skill.name);
    }

    this.profileForm = this.fb.group({
      firstName: [{ value: userData?.firstName || '', disabled: true }],
      lastName: [{ value: userData?.lastName || '', disabled: true }],
      email: [{ value: userData?.email || '', disabled: true }],
      isActive: [userData ? userData.isActive : true],
      skills: [currentSkillNames, this.maxSkillsValidator(5)]
    });
  }

  loadUserData(): void {
    this.isLoading = true;
    this.errorMessage = null;
    // this.successMessage = null; // Don't clear success on reload if user just saved

    const userId = this.authService.getUserId();
    if (!userId) {
      this.errorMessage = 'No user ID found. Please login again.';
      this.isLoading = false;
      return;
    }

    this.userService.getUserById(userId).subscribe({
      next: (userData) => {
        this.user = userData as User; // Cast to User
        this.initForm(this.user); // Re-initialize form with fetched data
        this.imagePreview =
          this.user.image ||
          'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png';
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading user data:', err);
        this.errorMessage = `Failed to load user data: ${
          err.error?.message || err.message
        }`;
        this.isLoading = false;
      },
    });
  }

  loadAvailableSkills(): void {
    this.skillsService.getAllSkills({ page: 1, pageSize: 1000 }).subscribe({
      // Fetch a large number
      next: (response) => {
        this.availableSkills = response.skills || [];
      },
      error: (err) => {
        console.error('Failed to load available skills:', err);
        this.errorMessage =
          'Could not load available skills. Please try again.'; // User-friendly error
      },
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    this.errorMessage = null;
    this.successMessage = null; // Clear messages when toggling edit mode

    if (this.isEditing && this.user) {
      // Form should already be populated by initForm via loadUserData,
      // but patchValue ensures it's up-to-date if loadUserData hasn't re-run
      let currentSkillNames: string[] = [];
      if (this.user.skills && Array.isArray(this.user.skills)) {
        currentSkillNames = this.user.skills
          .filter(
            (skill: any): skill is Skill =>
              skill && typeof skill.name === 'string'
          )
          .map((skill: Skill) => skill.name);
      }
      this.profileForm.patchValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        isActive: this.user.isActive,
        skills: currentSkillNames,
      });
      this.imagePreview =
        this.user.image ||
        'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png';
      this.selectedFile = null; // Clear previously selected file when entering edit mode
    } else if (!this.isEditing && this.user) {
      // If cancelling, reset form to original user data
      this.initForm(this.user);
      this.imagePreview =
        this.user.image ||
        'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png';
      this.selectedFile = null;
    }
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;

    if (fileList && fileList[0]) {
      const file = fileList[0];
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Please select an image file';
        return;
      }

      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        // Ensure we only set string values
        this.imagePreview =
          typeof reader.result === 'string' ? reader.result : null;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(this.selectedFile); // Use readAsDataURL instead of readAsArrayBuffer
    } else {
      this.selectedFile = null;
      this.imagePreview =
        this.user?.image ||
        'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png';
    }
  }

  // Method to trigger file input click from "Change Profile Image" button
  triggerFileInput(): void {
    this.fileInputRef.nativeElement.click();
  }

  onSubmit(): void {
    if (!this.profileForm.valid || !this.user) {
      this.errorMessage =
        'Form is invalid. Please check the fields and try again.';
      // Mark all fields as touched to show errors
      Object.values(this.profileForm.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const formValue = this.profileForm.value;
    // 'skills' from the form is now an array of selected skill names
    const selectedSkillNames: string[] = formValue.skills || [];

    const skillObjects: Skill[] = selectedSkillNames.map((name: string) => {
      const existingSkill = this.availableSkills.find((s) => s.name === name);
      if (existingSkill && existingSkill._id) {
        // If found and has an _id
        return { _id: existingSkill._id, name: existingSkill.name }; // Send _id and name
      }
      return { name }; // For new skills or if _id is missing, send only name (backend handles creation)
      // This still might cause a type error if your Skill interface STRICTLY requires _id.
    });

    const updatedUserData: Partial<User> & { _id: string } = {
      _id: this.user._id,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      isActive: formValue.isActive,
      skills: skillObjects,
    };

    this.userService.updateUser(this.user._id, updatedUserData).subscribe({
      next: (response) => {
        const updatedUserFromServer = response.user || response;
        this.user = { ...this.user, ...updatedUserFromServer } as User;
        // Update imagePreview in case the backend returns an updated user object with a new image URL
        // though the primary image update is handled by uploadImageOnSaveSuccess
        this.imagePreview =
          this.user.image ||
          'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png';

        if (this.selectedFile && this.user) {
          // If a new image was selected, upload it now
          this.uploadImageOnSaveSuccess(this.user._id, this.selectedFile);
        } else {
          // No new image selected, profile data update is complete
          this.successMessage = 'Profile details updated successfully!';
          this.isLoading = false;
          this.isEditing = false;
          this.cdr.detectChanges();
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error updating profile data:', err);
        this.errorMessage = `Failed to update profile: ${
          err.error?.message || err.message
        }`;
        this.isLoading = false;
      },
    });
  }

  private uploadImageOnSaveSuccess(userId: string, file: File): void {
    // this.isImageLoading = true; // Can use a separate loader if desired
    this.userService.updateUserImage({ _id: userId, image: file }).subscribe({
      next: (response) => {
        const newImageUrl =
          response.imageUrl || (response.user && response.user.image);
        if (this.user && newImageUrl) {
          this.user.image = newImageUrl; // Update local user object's image
          this.imagePreview = newImageUrl; // Update preview
        }
        this.successMessage = 'Profile and image updated successfully!';
        this.isLoading = false; // Ensure main loader stops
        // this.isImageLoading = false;
        this.isEditing = false;
        this.selectedFile = null; // Clear selected file after successful upload
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error uploading image:', err);
        this.successMessage =
          'Profile details updated, but image upload failed.'; // Keep profile success
        this.errorMessage = `Image upload error: ${
          err.error?.message || err.message
        }`;
        this.isLoading = false; // Ensure main loader stops
        // this.isImageLoading = false;
        // Don't set isEditing to false, allow user to retry or cancel
        this.cdr.detectChanges();
      },
    });
  }

  get skillsDisplay(): string {
    // This getter is for VIEW mode. Edit mode uses the form control directly.
    if (
      this.user &&
      this.user.skills &&
      Array.isArray(this.user.skills) &&
      this.user.skills.length > 0
    ) {
      const skillNames = this.user.skills
        .filter(
          (skill: any): skill is Skill =>
            skill && typeof skill.name === 'string'
        )
        .map((skill: Skill) => skill.name)
        .join(', ');
      return skillNames.length > 0 ? skillNames : 'N/A';
    }
    return 'N/A';
  }

  get userFullName(): string {
    if (this.user) {
      return `${this.user.firstName} ${this.user.lastName}`;
    }
    // No need for an else if (this.isEditing) block here if the form provides names
    return '...'; // Default while loading or no user
  }

  isInvalid(controlName: string): boolean {
    const control = this.profileForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(controlName: string): string {
    const control = this.profileForm.get(controlName);
    if (!control) return '';

    if (control.errors?.['required']) {
      const fieldName =
        controlName.charAt(0).toUpperCase() + controlName.slice(1);
      return `${fieldName} is required.`;
    }
    if (control.errors?.['email']) {
      return 'Invalid email format.';
    }
    if (control.errors?.['maxSkills']) {
      return `You can select a maximum of ${control.errors['maxSkills'].requiredCount} skills.`;
    }
    return '';
  }
}
