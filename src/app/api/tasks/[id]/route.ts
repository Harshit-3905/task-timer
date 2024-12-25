import connectDB from "@/lib/mongodb";
import Task from "@/models/Task";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await request.json();
    const task = await Task.findById(params.id);

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (body.isRunning !== undefined) {
      task.isRunning = body.isRunning;
      task.startedAt = body.isRunning ? Date.now() : undefined;
    }

    if (body.completed !== undefined) {
      task.completed = body.completed;
    }

    await task.save();
    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const task = await Task.findByIdAndDelete(params.id);

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
