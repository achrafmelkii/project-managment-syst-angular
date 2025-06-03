// src/app/custom-calendar/calendar.component.ts
import { Component, OnInit } from '@angular/core'; // Removed Input, OnChanges, SimpleChanges
import { CommonModule, DatePipe } from '@angular/common';
import { forkJoin, Observable } from 'rxjs';

// Models - ensure this path is correct
import { CalendarEvent, ProjectInput } from './calendar-models';

// Services - ensure these paths are correct
import { ProjectsService } from '../../services/projects.service';
import {
  AssignmentInput,
  AssignmentService,
} from '../../services/assignment.service';
import { AuthService } from '../../services/auth.service';

interface CalendarDay {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  events: CalendarEvent[];
}

@Component({
  selector: 'app-custom-calendar', // This component will now be self-contained
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  imports: [CommonModule], // Removed CommonModule, as it's not needed in the component
  providers: [DatePipe],
})
export class CalendarComponent implements OnInit {
  // Properties for data fetching state
  public isLoading: boolean = true;
  public errorLoading: string | null = null;

  // Internal storage for fetched data (previously @Inputs)
  private projectsInternal: ProjectInput[] = [];
  private assignmentsInternal: AssignmentInput[] = [];

  // Calendar display properties
  public currentDate: Date = new Date();
  public displayMonth: Date = new Date();
  public weeks: CalendarDay[][] = [];
  public readonly dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']; // French day names
  // public readonly dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; // English

  private allEvents: CalendarEvent[] = [];

  constructor(
    private datePipe: DatePipe,
    private projectsService: ProjectsService, // Injected service
    private assignmentService: AssignmentService, // Injected service
    private authService: AuthService // Injected service for authentication
  ) {}

  ngOnInit(): void {
    this.loadCalendarData();
  }

  // Add these color arrays
  private readonly blueColors = [
    '#ADD8E6',
    '#00BFFF',
    '#1E90FF',
    '#4169E1',
    '#0000FF',
    '#000080',
  ];

  private readonly greenColors = [
    '#98FB98',
    '#32CD32',
    '#3CB371',
    '#228B22',
    '#9ACD32',
    '#6B8E23',
  ];

  private readonly redColors = [
    '#FFB6C1',

    '#FF1 493',

    '#8B0000',

    '#FF4500',
    '#FF0000',
  ];

  // Add this helper method
  private getEventColor(event: CalendarEvent): string {
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    // Get random color from array
    const getRandomColor = (colors: string[]) => {
      const randomIndex = Math.floor(Math.random() * colors.length);
      return colors[randomIndex];
    };

    // Not started yet
    if (startDate > now) {
      return getRandomColor(this.blueColors);
    }
    // Currently active
    else if (startDate <= now && endDate >= now) {
      return getRandomColor(this.greenColors);
    }
    // Completed/Past
    else {
      return getRandomColor(this.redColors);
    }
  }

  // // Renamed from processInputEvents - processes internal data
  // private processFetchedData(): void {
  //   this.allEvents = [];
  //   (this.projectsInternal || []).forEach((p) => {
  //     if (p && p.startDate && p.endDate) {
  //       this.allEvents.push({
  //         id: p._id,
  //         name: `${p.manager.firstName || ''} (${p.name})`, // Added description if available
  //         // name: `Projet: ${p.name}`,
  //         startDate: new Date(p.startDate),
  //         endDate: new Date(p.endDate),
  //         type: 'project',
  //         color: this.getEventColor({
  //           id: p._id,
  //           name: p.name,
  //           startDate: new Date(p.startDate),
  //           endDate: new Date(p.endDate),
  //           type: 'project',
  //         }),
  //         originalData: p,
  //       });
  //     }
  //   });

  //   // Similar modification for assignments
  //   (this.assignmentsInternal || []).forEach((a) => {
  //     if (a && a.startDate && a.endDate && a.user && a.project) {
  //       const startDate = new Date(a.startDate);
  //       let endDate = new Date(a.endDate);
  //       if (endDate < startDate) {
  //         endDate = new Date(startDate);
  //       }

  //       const event: CalendarEvent = {
  //         id: a._id,
  //         name: `Affectation: ${a.user.firstName || ''} ${
  //           a.user.lastName || ''
  //         } sur ${a.project.name || 'N/A'}`,
  //         startDate: startDate,
  //         endDate: endDate,
  //         type: 'assignment' as 'assignment',
  //       };

  //       this.allEvents.push({
  //         ...event,
  //         color: this.getEventColor(event),
  //         originalData: a,
  //       });
  //     }
  //   });
  // }

  private processFetchedData(): void {
    this.allEvents = [];
    (this.projectsInternal || []).forEach((p) => {
      if (p && p.startDate && p.endDate) {
        this.allEvents.push({
          id: p._id,
          name: `${p.manager.firstName || ''} (${p.name})`, // Added description if available
          // name: `Projet: ${p.name}`,
          startDate: new Date(p.startDate),
          endDate: new Date(p.endDate),
          type: 'project',
          color: this.getEventColor({
            id: p._id,
            name: p.name,
            startDate: new Date(p.startDate),
            endDate: new Date(p.endDate),
            type: 'project',
          }),
          originalData: p,
        });
      }
    });

    // Similar modification for assignments
    (this.assignmentsInternal || []).forEach((a) => {
      if (a && a.startDate && a.endDate && a.employee && a.projectName) {
        const startDate = new Date(a.startDate);
        let endDate = new Date(a.endDate);
        if (endDate < startDate) {
          endDate = new Date(startDate);
        }

        const event: CalendarEvent = {
          id: a._id,
          name: `Affectation: ${a.employee || ''} ${a.employee || ''} sur ${
            a.projectName || 'N/A'
          }`,
          startDate: startDate,
          endDate: endDate,
          type: 'assignment' as 'assignment',
        };

        this.allEvents.push({
          ...event,
          color: this.getEventColor(event),
          originalData: a,
        });
      }
    });
  }

  public loadCalendarData(): void {
    this.isLoading = true;
    this.errorLoading = null;

    const userRole = this.authService.getUserRole();
    let projectsObservable: Observable<any>;

    if (userRole === 'employee') {
      // If the user is an employee, fetch only their projects
      projectsObservable = this.projectsService.getEmployeProjectsList(); // Assuming pagination is not needed for calendar directly
    } else {
      // For all other roles (manager, admin, etc.), fetch all projects
      projectsObservable = this.projectsService.getProjectsList({}); // Fetch all projects
    }

    forkJoin({
      projects: projectsObservable, // Fetch all projects
      assignments: this.assignmentService.getAssignments(), // Fetch all assignments
    }).subscribe({
      next: (data) => {
        console.log('Raw API response:', data);
        this.projectsInternal = Array.isArray(data.projects.projects)
          ? data.projects.projects
          : [];

        // Similar check for assignments
        this.assignmentsInternal = Array.isArray(data.assignments)
          ? data.assignments
          : [];

        console.log('Fetched projects:', this.projectsInternal); // Debug log
        console.log('Fetched assignments:', this.assignmentsInternal); // Debug log

        this.processFetchedData(); // Process the fetched data
        this.generateCalendar(); // Generate calendar grid
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading calendar data:', err);
        this.errorLoading =
          'Impossible de charger les données du calendrier. Veuillez réessayer.';
        this.isLoading = false;
      },
    });
  }

  public generateCalendar(): void {
    this.weeks = [];
    const year = this.displayMonth.getFullYear();
    const month = this.displayMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    // const lastDayOfMonth = new Date(year, month + 1, 0); // Not directly used, but good to have
    const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) - 6 (Sat)

    // Adjust for French week start (Monday) if dayNames[0] is 'Lun'
    // let startDayOffset = firstDayOfWeek;
    // if (this.dayNames[0].toLowerCase() === 'lun' || this.dayNames[0].toLowerCase() === 'mon' ) {
    //   startDayOffset = (firstDayOfWeek === 0) ? 6 : firstDayOfWeek - 1; // Monday is 0, Sunday is 6
    // }

    let currentDay = new Date(firstDayOfMonth);
    // currentDay.setDate(currentDay.getDate() - startDayOffset);
    currentDay.setDate(currentDay.getDate() - firstDayOfWeek); // Assuming Sunday start based on original code

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 6; i++) {
      // Max 6 weeks for a month
      const week: CalendarDay[] = [];
      for (let j = 0; j < 7; j++) {
        const dateCopy = new Date(currentDay);
        dateCopy.setHours(0, 0, 0, 0);

        const dayEvents = this.getEventsForDate(dateCopy);

        week.push({
          date: dateCopy,
          dayOfMonth: dateCopy.getDate(),
          isCurrentMonth: dateCopy.getMonth() === month,
          isToday: dateCopy.getTime() === today.getTime(),
          isWeekend: dateCopy.getDay() === 0 || dateCopy.getDay() === 6,
          events: dayEvents,
        });
        currentDay.setDate(currentDay.getDate() + 1);
      }
      this.weeks.push(week);
    }
  }

  private getEventsForDate(date: Date): CalendarEvent[] {
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    return this.allEvents.filter((event) => {
      const startDate = new Date(event.startDate);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(event.endDate);
      endDate.setHours(0, 0, 0, 0);
      return checkDate >= startDate && checkDate <= endDate;
    });
  }

  public previousMonth(): void {
    this.displayMonth = new Date(
      this.displayMonth.getFullYear(),
      this.displayMonth.getMonth() - 1,
      1
    );
    this.generateCalendar(); // Regenerate with new month
  }

  public nextMonth(): void {
    this.displayMonth = new Date(
      this.displayMonth.getFullYear(),
      this.displayMonth.getMonth() + 1,
      1
    );
    this.generateCalendar(); // Regenerate with new month
  }

  public goToToday(): void {
    this.displayMonth = new Date();
    this.currentDate = new Date();
    this.generateCalendar(); // Regenerate for current month
  }

  public get monthYearDisplay(): string {
    // Using 'fr-FR' for French month names like "Avril 2025"
    return (
      this.datePipe.transform(this.displayMonth, 'MMMM yyyy', '', 'fr-FR') || ''
    );
  }

  private getLocaleForDatePipe(): string {
    //     // Basic example, you might have a more robust i18n setup
    //     // For French month names with titlecase pipe
    return 'fr-FR';
    //   }
  }
  // setView is kept if you plan to implement other views later
  public setView(view: 'Mois' | 'Semaine' | 'Jour' | 'Agenda'): void {
    console.log('Set view to:', view);
    // Future implementation
  }
}
