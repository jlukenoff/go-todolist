import type { Task } from "../models/Task";

export async function deleteTask(task: Task) {
  const res = await fetch(`/api/task/${task.id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to update task");
  }

  const data = await res.json();

  return data as Task;
}
