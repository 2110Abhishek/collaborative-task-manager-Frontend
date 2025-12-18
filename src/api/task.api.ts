import api from "../utils/axios";
import type { Task } from "../types";

export const fetchTasks = async (): Promise<Task[]> => {
  const res = await api.get("/tasks");
  return res.data;
};

export const createTask = (data: Partial<Task>) =>
  api.post("/tasks", data);

export const updateTask = (id: string, data: Partial<Task>) =>
  api.patch(`/tasks/${id}`, data);

export const deleteTask = (id: string) =>
  api.delete(`/tasks/${id}`);
