import { AssignmentInput } from '../../services/assignment.service';
import { Skill } from '../../services/skills.service';

// calendar-models.ts (or directly in your component)
export interface CalendarEvent {
  id: string; // Or any unique identifier
  name: string; // e.g., Project name or User name for assignment
  startDate: Date;
  endDate: Date;
  color?: string; // Optional: for different event types
  type: 'project' | 'assignment'; // To differentiate if needed
  originalData?: any; // To store the original project/assignment object
}

// Simplified interfaces for what your component might receive
export interface ProjectInput {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  assignments: AssignmentInput[]; // Keep if you still use raw IDs for something else
  requiredSkills: Skill[]; // Updated to expect populated skill objects
  tasks: any[]; // **Updated to expect populated task objects with title**
  users: {
    _id: string;
    firstName: string;
    lastName: string;
    image: string;
    email: string;
  }[];
  manager: {
    _id: string;
    firstName: string;
    lastName: string;
    image: string; // Keep if manager also has an image
  };
  createdAt: string;
}
