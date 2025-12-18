import { useForm } from "react-hook-form";
import { createTask } from "../../api/task.api";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useState } from "react";

type FormData = {
  title: string;
  description: string;
  dueDate: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
};

const TaskForm = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      await createTask(data);
      toast.success("🎉 Task created successfully!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      reset();
      setIsExpanded(false);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Task creation failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isExpanded) {
    return (
      <div 
        className="glass-card group cursor-pointer transform transition-all duration-500 hover:scale-[1.02] animate-fade-in-scale"
        onClick={() => setIsExpanded(true)}
      >
        <div className="p-8 text-center">
          <div className="inline-block p-4 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 mb-4 group-hover:scale-110 transition-transform duration-500">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl">
              +
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gradient transition-all duration-300">
            Create New Task
          </h3>
          <p className="text-gray-600">Click to add a new task to your board</p>
          <div className="mt-4 inline-flex items-center gap-2 text-sm text-blue-600 font-semibold animate-bounce-subtle">
            <span>✨ Click to get started</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card animate-fade-in-scale">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create New Task
            </h3>
            <p className="text-gray-600 mt-1">Fill in the details below</p>
          </div>
          <button
            onClick={() => setIsExpanded(false)}
            className="p-2 rounded-lg hover:bg-gray-100/50 transition-all duration-300 hover:rotate-90"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title Field */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <span className="inline-flex items-center gap-2">
                <span className="text-blue-500">📝</span>
                Task Title *
              </span>
            </label>
            <input
              {...register("title", { required: "Title is required" })}
              placeholder="Enter an awesome task title..."
              className="input-enhanced focus:shadow-lg focus:shadow-blue-500/20"
              autoFocus
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-600 animate-pulse">{errors.title.message}</p>
            )}
          </div>

          {/* Description Field */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <span className="inline-flex items-center gap-2">
                <span className="text-purple-500">📋</span>
                Description
              </span>
            </label>
            <textarea
              {...register("description")}
              placeholder="Describe your task in detail..."
              rows={3}
              className="input-enhanced resize-none focus:shadow-lg focus:shadow-purple-500/20"
            />
          </div>

          {/* Date & Priority Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Due Date */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="inline-flex items-center gap-2">
                  <span className="text-green-500">📅</span>
                  Due Date
                </span>
              </label>
              <input
                type="datetime-local"
                {...register("dueDate")}
                className="input-enhanced focus:shadow-lg focus:shadow-green-500/20"
              />
            </div>

            {/* Priority */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="inline-flex items-center gap-2">
                  <span className="text-red-500">⚡</span>
                  Priority *
                </span>
              </label>
              <select
                {...register("priority", { required: "Priority is required" })}
                className="input-enhanced focus:shadow-lg focus:shadow-red-500/20"
              >
                <option value="">Select priority level</option>
                <option value="LOW" className="text-green-600">Low 🐢</option>
                <option value="MEDIUM" className="text-yellow-600">Medium 🚶</option>
                <option value="HIGH" className="text-orange-600">High 🏃</option>
                <option value="URGENT" className="text-red-600">Urgent 🚨</option>
              </select>
              {errors.priority && (
                <p className="mt-2 text-sm text-red-600 animate-pulse">{errors.priority.message}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-animated w-full py-4 text-lg font-bold mt-4"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-3">
                <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Creating Magic...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-3">
                <span>✨</span>
                Create Awesome Task
                <span>🚀</span>
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;