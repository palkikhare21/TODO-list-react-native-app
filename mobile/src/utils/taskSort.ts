import { Task } from '../types/task';

const priorityScore = { high: 30, medium: 20, low: 10 };

function deadlineScore(deadline: string) {
  const hoursLeft = (new Date(deadline).getTime() - Date.now()) / 36e5;
  if (hoursLeft < 0) return 40;
  if (hoursLeft <= 24) return 30;
  if (hoursLeft <= 72) return 20;
  if (hoursLeft <= 168) return 10;
  return 0;
}

export function smartSortTasks(tasks: Task[]) {
  return [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const aScore = priorityScore[a.priority] + deadlineScore(a.deadline);
    const bScore = priorityScore[b.priority] + deadlineScore(b.deadline);
    return bScore - aScore || new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });
}

export function deadlineLabel(deadline: string) {
  const hoursLeft = (new Date(deadline).getTime() - Date.now()) / 36e5;
  if (hoursLeft < 0) return 'Overdue';
  if (hoursLeft <= 24) return 'Due today';
  if (hoursLeft <= 72) return 'Due soon';
  return new Date(deadline).toLocaleDateString();
}
