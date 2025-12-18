import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTasks } from "../../api/task.api";
import TaskCard from "./TaskCard";
import Loader from "../common/Loader";
import { useAuth } from "../../hooks/useAuth";
import { useSocket } from "../../hooks/useSocket";
import { useState } from "react";

const TaskList = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');

  const { data, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  // 🔌 LIVE SOCKET UPDATES
  useSocket(
    user?.id,
    () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    }
  );

  const filteredTasks = data?.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const stats = {
    total: data?.length || 0,
    todo: data?.filter(t => t.status === 'TODO').length || 0,
    inProgress: data?.filter(t => t.status === 'IN_PROGRESS').length || 0,
    completed: data?.filter(t => t.status === 'COMPLETED').length || 0,
  };

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Task List</h2>
          <p className="text-sm text-gray-500 mt-1">
            {stats.total} total tasks • {stats.todo} to do • {stats.inProgress} in progress • {stats.completed} completed
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setFilter('TODO')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filter === 'TODO' 
                ? 'bg-gray-800 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            To Do ({stats.todo})
          </button>
          <button
            onClick={() => setFilter('IN_PROGRESS')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filter === 'IN_PROGRESS' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            In Progress ({stats.inProgress})
          </button>
          <button
            onClick={() => setFilter('COMPLETED')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filter === 'COMPLETED' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Completed ({stats.completed})
          </button>
        </div>
      </div>

      {/* Tasks grid */}
      {filteredTasks && filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="card py-12 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-500">
            {filter !== 'all' 
              ? `No tasks with status "${filter.toLowerCase().replace('_', ' ')}"` 
              : "Get started by creating your first task"}
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskList;