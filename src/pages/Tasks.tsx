import Navbar from "../components/layout/Navbar";
import TaskList from "../components/tasks/TaskList";
import TaskForm from "../components/tasks/TaskForm";

const Tasks = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
    <Navbar />
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
        <p className="text-gray-600 mt-2">Create, manage, and track all your tasks</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <TaskForm />
        </div>
        
        <div className="lg:col-span-2">
          <TaskList />
        </div>
      </div>
    </div>
  </div>
);

export default Tasks;