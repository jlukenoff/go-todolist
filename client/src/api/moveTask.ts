import type { Task } from "../models/Task";

export async function moveTask(task: Task, newIndex: number) {
  const res = await fetch(`/api/task/${task.id}/move`, {
    method: "PUT",
    body: JSON.stringify({ task, newIndex }),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Failed to update task");
  }

  const data = await res.json();

  return data as Task;
}
