import type { Task } from "../../types";
import { deleteTask } from "../../api/task.api";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useState } from "react";

const TaskCard = ({ task }: { task: Task }) => {
  const queryClient = useQueryClient();
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await deleteTask(task.id);
      toast.success("Task deleted successfully ✨");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to delete task"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "LOW": return "badge-low";
      case "MEDIUM": return "badge-medium";
      case "HIGH": return "badge-high";
      case "URGENT": return "badge-urgent";
      default: return "badge-low";
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "TODO": return "badge-todo";
      case "IN_PROGRESS": return "badge-in-progress";
      case "REVIEW": return "badge-review";
      case "COMPLETED": return "badge-completed";
      default: return "badge-todo";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "TODO": return "⭕";
      case "IN_PROGRESS": return "🔄";
      case "REVIEW": return "👁️";
      case "COMPLETED": return "✅";
      default: return "📝";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(date.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 7) return `${diffDays} days`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "COMPLETED";

  return (
    <div 
      className="glass-card animate-slide-in-up group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-5 relative">
        {/* Animated Background */}
        <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl transition-all duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
        
        {/* Task Content */}
        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 transition-transform duration-300 ${isHovered ? 'scale-110 rotate-6' : ''}`}>
                    <span className="text-lg">{getStatusIcon(task.status)}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-gradient transition-all duration-300">
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-gray-600 mt-2 leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className={`relative z-10 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform ${
                    isDeleting 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-500/10 to-red-500/5 text-red-600 hover:from-red-500/20 hover:to-red-500/10 hover:text-red-700 hover:scale-105'
                  }`}
                >
                  {isDeleting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                      Deleting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      🗑️ Delete
                    </span>
                  )}
                </button>
              </div>
              
              {/* Status & Priority Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`badge-glow ${getPriorityClass(task.priority)} animate-pulse-glow`}>
                  <span className="mr-2">⚡</span>
                  {task.priority.toLowerCase()}
                </span>
                <span className={`badge-glow ${getStatusClass(task.status)}`}>
                  {getStatusIcon(task.status)} {task.status.replace('_', ' ').toLowerCase()}
                </span>
                
                {isOverdue && (
                  <span className="badge-glow bg-gradient-to-r from-red-100 to-red-200 text-red-700 animate-pulse">
                    ⚠️ Overdue
                  </span>
                )}
              </div>
              
              {/* Timeline & Assignee */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100/50">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-1.5 rounded-lg">
                    <span className="text-blue-600">📅</span>
                    <span className="font-semibold text-gray-700">{formatDate(task.dueDate)}</span>
                  </div>
                  
                  {task.assignedTo && (
                    <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-1.5 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                        {task.assignedTo.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-700">{task.assignedTo.name}</span>
                    </div>
                  )}
                </div>
                
                {/* Progress Indicator */}
                <div className={`w-24 h-1.5 rounded-full overflow-hidden bg-gray-200 ${isHovered ? 'w-32' : ''} transition-all duration-500`}>
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      task.status === 'COMPLETED' ? 'bg-gradient-to-r from-green-400 to-emerald-500 w-full' :
                      task.status === 'IN_PROGRESS' ? 'bg-gradient-to-r from-blue-400 to-cyan-500 w-2/3' :
                      task.status === 'REVIEW' ? 'bg-gradient-to-r from-purple-400 to-pink-500 w-1/3' :
                      'bg-gradient-to-r from-gray-400 to-gray-500 w-1/4'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Hover Effect Line */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-transform duration-500 ${isHovered ? 'scale-x-100' : 'scale-x-0'} transform origin-left`} />
      </div>
    </div>
  );
};

export default TaskCard;