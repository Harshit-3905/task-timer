import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Task from "@/models/Task";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;
    const body = await req.json();
    const task = await Task.findById(id);

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
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
