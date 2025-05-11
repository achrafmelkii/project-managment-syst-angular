import { Component, OnInit } from '@angular/core';
import {
  SkillsService,
  Skill,
  SkillsApiResponse,
} from '../../services/skills.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CardModule,
  GridModule,
  TableModule,
  ButtonModule,
  FormModule,
  ButtonGroupModule,
  SpinnerModule,
  CardComponent,
  CardBodyComponent,
  CardHeaderComponent,
  ColComponent,
  TableDirective,
  ButtonDirective,
  FormControlDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  SpinnerComponent,
  // IconDirective,
  // InputGroupTextComponent,
} from '@coreui/angular';
import { IconModule, IconSetService } from '@coreui/icons-angular';
import { cilPencil, cilSearch } from '@coreui/icons';

@Component({
  selector: 'app-skills-list',
  templateUrl: './skills-list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    GridModule,
    TableModule,
    ButtonModule,
    FormModule,
    ButtonGroupModule,
    SpinnerModule,
    IconModule,
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    ColComponent,
    TableDirective,
    ButtonDirective,
    FormControlDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    // InputGroupTextComponent,
    SpinnerComponent,
    // IconDirective,
  ],
})
export class SkillsListComponent implements OnInit {
  skills: Skill[] = [];
  skillName: string = '';
  filterName: string = '';

  currentPage: number = 1;
  pageSize: number = 5; // Or get from user, or default
  totalSkills: number = 0;
  totalPages: number = 0;

  editingSkill: Skill | null = null;
  editingSkillName: string = '';

  loading = false; // Add this property for spinner
  isCreateWidgetVisible = false; // Add this for modal visibility

  constructor(private skillsService: SkillsService) {}

  ngOnInit(): void {
    this.loadSkills();
  }

  // Add method for creating skill modal
  openCreateSkillModal() {
    this.isCreateWidgetVisible = true;
  }

  // Add method for closing modal
  onCloseWidget() {
    this.isCreateWidgetVisible = false;
  }

  // Add method for search
  handleSearch(event: any) {
    this.filterName = event.target.value;
    this.loadSkills();
  }
  // loadSkills(): void {
  //   this.skillsService
  //     .getAllSkills({
  //       name: this.filterName || undefined, // Pass undefined if empty, backend handles 'all'
  //       page: this.currentPage,
  //       pageSize: this.pageSize,
  //     })
  //     .subscribe({
  //       next: (response: SkillsApiResponse) => {
  //         this.skills = response.skills;
  //         this.totalSkills = response.countSkills;
  //         this.totalPages = response.pages;
  //         this.currentPage = response.page;
  //         console.log('Skills loaded:', response);
  //       },
  //       error: (err) => console.error('Error loading skills:', err),
  //     });
  // }

  loadSkills(): void {
    this.loading = true;
    this.skillsService
      .getAllSkills({
        name: this.filterName || undefined,
        page: this.currentPage,
        pageSize: this.pageSize,
      })
      .subscribe({
        next: (response: SkillsApiResponse) => {
          this.skills = response.skills;
          this.totalSkills = response.countSkills;
          this.totalPages = response.pages;
          this.currentPage = response.page;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading skills:', err);
          this.loading = false;
        },
      });
  }

  addSkill(): void {
    if (!this.skillName.trim()) return;

    this.loading = true;
    this.skillsService.createSkill({ name: this.skillName.trim() }).subscribe({
      next: (response) => {
        console.log('Skill created:', response.message);
        this.skillName = '';
        this.isCreateWidgetVisible = false;
        this.loadSkills();
      },
      error: (err) => {
        console.error(
          'Error creating skill:',
          err.error?.message || err.message
        );
        this.loading = false;
      },
    });
  }

  removeSkill(id: string | undefined): void {
    if (!id) {
      console.error('Skill ID is null or undefined');
      return;
    }
    if (confirm('Are you sure you want to delete this skill?')) {
      this.skillsService.deleteSkill(id).subscribe({
        next: (response) => {
          console.log('Skill deleted:', response.message);
          this.loadSkills(); // Refresh list
        },
        error: (err) =>
          console.error(
            'Error deleting skill:',
            err.error?.message || err.message
          ),
      });
    }
  }

  startUpdate(skill: Skill): void {
    this.editingSkill = { ...skill }; // Create a copy to avoid direct mutation
    this.editingSkillName = skill.name;
  }

  confirmUpdate(): void {
    if (
      this.editingSkill &&
      this.editingSkill._id &&
      this.editingSkillName.trim()
    ) {
      this.skillsService
        .updateSkill(this.editingSkill._id, {
          name: this.editingSkillName.trim(),
        })
        .subscribe({
          next: (response) => {
            console.log('Skill updated:', response.message);
            this.cancelUpdate();
            this.loadSkills();
          },
          error: (err) =>
            console.error(
              'Error updating skill:',
              err.error?.message || err.message
            ),
        });
    }
  }

  cancelUpdate(): void {
    this.editingSkill = null;
    this.editingSkillName = '';
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadSkills();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadSkills();
    }
  }
}
