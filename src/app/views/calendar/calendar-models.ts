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
  startDate: string | Date; // Backend might send as string
  endDate: string | Date;
}

export interface AssignmentInput {
  _id: string;
  user: { _id: string; firstName: string; lastName: string }; // Example: might need user name
  project: { _id: string; name: string }; // Example: might need project name
  startDate: string | Date;
  endDate: string | Date;
}
