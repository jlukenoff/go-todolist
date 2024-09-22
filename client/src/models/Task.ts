export interface Task {
  id: number;
  title: string;
  description: string;
  timestamp: Date;
  completed: boolean;
  orderIndex: number;
}

export type TaskInput = Pick<Task, "title" | "description">;
