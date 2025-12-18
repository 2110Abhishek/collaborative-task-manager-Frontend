import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import TaskList from "../components/tasks/TaskList";
import Notification from "../components/common/Notification";
import { useAuth } from "../hooks/useAuth";
import { useSocket } from "../hooks/useSocket";

const Dashboard = () => {
  const { user } = useAuth();
  const [notification, setNotification] = useState<{message: string; type: string} | null>(null);
  const [greeting, setGreeting] = useState("");
  const [quote, setQuote] = useState("");
  const [animateWelcome, setAnimateWelcome] = useState(true);

  const quotes = [
    "Productivity is never an accident. It's always the result of a commitment to excellence.",
    "The way to get started is to quit talking and begin doing.",
    "Your time is limited, don't waste it living someone else's life.",
    "The future depends on what you do today.",
    "Don't watch the clock; do what it does. Keep going."
  ];

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    const timer = setTimeout(() => setAnimateWelcome(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useSocket(
    user?.id,
    undefined,
    (task) => {
      setNotification({
        message: `🎯 New task assigned: "${task.title}"`,
        type: "info"
      });
      setTimeout(() => setNotification(null), 4000);
    }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <Navbar />
      
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type as any}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section with Animation */}
        <div className={`glass-card overflow-hidden mb-8 transform transition-all duration-1000 ${
          animateWelcome ? 'scale-105 opacity-0' : 'scale-100 opacity-100'
        }`}>
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {greeting}, <span className="text-gradient">{user?.name}!</span> 👋
                </h1>
                <p className="text-gray-600 text-lg italic max-w-2xl">
                  "{quote}"
                </p>
              </div>
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-3 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div>
                  <div className="text-sm text-gray-600">Logged in as</div>
                  <div className="font-semibold text-gray-900">{user?.email}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Task List */}
        <TaskList />
      </div>

      {/* Floating Particles Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;