export type Priority = 'low' | 'medium' | 'high';

export type Task = {
  _id: string;
  title: string;
  description: string;
  dateTime: string;
  deadline: string;
  priority: Priority;
  category?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateTaskInput = {
  title: string;
  description: string;
  dateTime: string;
  deadline: string;
  priority: Priority;
  category?: string;
};
