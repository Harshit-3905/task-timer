export type Task = {
  id: string;
  name: string;
  estimatedTime: number;
  completed: boolean;
  timeSpent: number;
  isRunning: boolean;
  startedAt?: number;
};
