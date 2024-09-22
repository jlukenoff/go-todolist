import React from "react";
import type { Task, TaskInput } from "./models/Task";
import { listTasks } from "./api/listTasks";
import { createTask } from "./api/createTask";
import { updateTask } from "./api/updateTask";
import { moveTask } from "./api/moveTask";
import { deleteTask } from "./api/deleteTask";

function App() {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [newTask, setNewTask] = React.useState<TaskInput>({
    title: "",
    description: "",
  });

  const [draggingId, setDraggingId] = React.useState<number | null>(null);
  const [dragOverId, setDragOverId] = React.useState<number | null>(null);

  React.useEffect(() => {
    listTasks().then((newTasks) => {
      setTasks(newTasks);
    });
  }, []);

  const handleCreateTask = async () => {
    const task = await createTask(newTask);
    setTasks([...tasks, task]);
    setNewTask({ title: "", description: "" });
  };

  const handleUpdateTask = async (task: Task) => {
    const newTasks = tasks.map((t) => (t.id === task.id ? task : t));
    setTasks(newTasks);
    await updateTask(task);
  };

  const handleDeleteTask = async (task: Task) => {
    const newTasks = tasks.filter((t) => t.id !== task.id);
    setTasks(newTasks);
    await deleteTask(task);
  };

  const onDragStart = (task: Task) => {
    setDraggingId(task.id);
  };

  const onDragEnter = (task: Task) => {
    setDragOverId(task.id);
  };

  const onDragEnd = () => {
    setDraggingId(null);
    setDragOverId(null);
  };

  const onDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
  };

  const onDrop = async (e: React.DragEvent<HTMLLIElement>, endIdx: number) => {
    e.preventDefault();

    const startIdx = tasks.findIndex((t) => t.id === draggingId);

    if (startIdx === endIdx) {
      return;
    }
    const newTasks = [...tasks];
    const [task] = newTasks.splice(startIdx, 1);
    newTasks.splice(endIdx, 0, task);

    setTasks(newTasks);

    await moveTask(task, endIdx);
  };

  return (
    <div className="flex justify-start items-center h-screen bg-gray-100 flex-col p-8">
      <form
        onSubmit={handleCreateTask}
        className="flex flex-col gap-4 bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <label htmlFor="new-task-title">Title</label>
        <input
          type="text"
          id="new-task-title"
          value={newTask.title}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          placeholder="Enter the task name..."
        />
        <label htmlFor="new-task-description">Description</label>
        <input
          type="text"
          id="new-task-description"
          value={newTask.description}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
          placeholder="Enter the task description..."
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          type="submit"
        >
          Add Task
        </button>
      </form>

      <ul className="w-1/3 mx-auto my-4">
        {tasks.map((task, i) => (
          <li
            key={task.id}
            className={`flex p-2 my-2 bg-gray-200 rounded ${
              task.id === dragOverId
                ? "border border-dashed border-gray-500"
                : ""
            }`}
            draggable
            id={`task-${task.id}`}
            onDragStart={() => onDragStart(task)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, i)}
            onDragEnter={() => onDragEnter(task)}
            onDragEnd={onDragEnd}
          >
            <input
              type="checkbox"
              className="mr-2"
              checked={task.completed}
              onChange={(e) =>
                handleUpdateTask({ ...task, completed: e.target.checked })
              }
            />
            <b className="mr-1">{task.title}:</b>
            <span>
              {task.description || (
                <i className="text-opacity-5">No description</i>
              )}
            </span>
            <button
              className="ml-auto"
              onClick={() => handleDeleteTask(task)}
              type="button"
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
