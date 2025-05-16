export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  taskId?: string;
  description?: string;
  color?: string;
}