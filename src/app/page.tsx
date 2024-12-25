"use client";

import TaskBox from "@/components/TaskBox";
import { useEffect, useState } from "react";
import { Task } from "./types/tasks";

export default function Home() {
  const [taskName, setTaskName] = useState<string>("");
  const [estimatedTime, setEstimatedTime] = useState<number>(0);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchTasks = async () => {
    const response = await fetch("/api/tasks");
    const data = await response.json();
    setTasks(data || []);
  };

  const addTask = async () => {
    if (!taskName || estimatedTime <= 0) return;

    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: taskName, estimatedTime }),
    });

    setTaskName("");
    setEstimatedTime(0);
    fetchTasks();
  };

  const toggleTimer = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    await fetch(`/api/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRunning: !task.isRunning }),
    });

    fetchTasks();
  };

  const completeTask = async (taskId: string) => {
    await fetch(`/api/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: true }),
    });

    fetchTasks();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Task Timer</h1>
          <p className="text-gray-600">
            Track your tasks and manage your time effectively
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addTask();
            }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="flex-1">
              <label className="block text-sm font-medium text-black mb-1">
                Task Name
              </label>
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                placeholder="Enter task name"
                required
              />
            </div>
            <div className="sm:w-48">
              <label className="block text-sm font-medium text-black mb-1">
                Estimated Minutes
              </label>
              <input
                type="number"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(Number(e.target.value))}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                required
              />
            </div>
            <div className="sm:self-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Add Task
              </button>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks
            .filter((task) => !task.completed)
            .map((task) => (
              <TaskBox
                key={task.id}
                {...task}
                onComplete={() => completeTask(task.id)}
                onToggleTimer={() => toggleTimer(task.id)}
              />
            ))}
        </div>

        {tasks && tasks.filter((task) => !task.completed).length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No active tasks
            </h3>
            <p className="text-gray-600">
              Add a new task to start tracking your time
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
