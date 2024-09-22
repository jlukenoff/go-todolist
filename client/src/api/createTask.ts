import type { Task, TaskInput } from "../models/Task";

export async function createTask(task: TaskInput) {
  const res = await fetch("/api/task", {
    method: "POST",
    body: JSON.stringify(task),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Failed to create task");
  }

  const data = await res.json();

  return data as Task;
}
