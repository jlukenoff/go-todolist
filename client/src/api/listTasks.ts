import { Task } from "../models/Task";

export async function listTasks() {
  const res = await fetch("/api/task");
  const data = await res.json();
  return data as Task[];
}
