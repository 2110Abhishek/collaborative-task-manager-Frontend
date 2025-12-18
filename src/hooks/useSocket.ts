import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = (
  userId?: string,
  onTaskUpdated?: (task: any) => void,
  onTaskAssigned?: (task: any) => void
) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io("https://collaborative-task-manager-backend-33u7.onrender.com", {
      withCredentials: true,
    });

    socketRef.current = socket;

    if (userId) {
      socket.emit("join:user", userId);
    }

    if (onTaskUpdated) {
      socket.on("task:updated", onTaskUpdated);
    }

    if (onTaskAssigned) {
      socket.on("task:assigned", onTaskAssigned);
    }

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return socketRef.current;
};
