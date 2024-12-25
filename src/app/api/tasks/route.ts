import connectDB from "@/lib/mongodb";
import Task from "@/models/Task";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const tasks = await Task.find({});

    // Update running tasks' timeSpent
    const updatedTasks = tasks.map((task) => {
      if (task.isRunning && task.startedAt) {
        const now = Date.now();
        const additionalTime = Math.floor((now - task.startedAt) / 1000);
        task.timeSpent += additionalTime;
        task.startedAt = now;
        return task.save();
      }
      return task;
    });

    await Promise.all(updatedTasks);

    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const task = await Task.create({
      name: body.name,
      estimatedTime: body.estimatedTime,
      timeSpent: 0,
      completed: false,
      isRunning: false,
    });

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
