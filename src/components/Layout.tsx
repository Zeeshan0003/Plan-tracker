import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, Calendar, Target, CheckSquare, User, 
  Menu, X, LogOut, BarChart2, AlertCircle 
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <Home size={20} /> },
    { path: '/tasks', label: 'Tasks', icon: <CheckSquare size={20} /> },
    { path: '/goals', label: 'Goals', icon: <Target size={20} /> },
    { path: '/calendar', label: 'Calendar', icon: <Calendar size={20} /> },
    { path: '/profile', label: 'Profile', icon: <User size={20} /> }
  ];
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <header className="bg-white shadow-sm py-4 px-4 flex justify-between items-center md:hidden">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
        >
          <Menu size={24} />
        </button>
        <div className="text-xl font-semibold text-gray-800">Plan Tracker</div>
        <div className="w-8"></div> {/* Spacer for balance */}
      </header>
      
      {/* Sidebar for mobile (overlay) */}
      <div 
        className={`fixed inset-0 bg-gray-600 bg-opacity-75 z-40 md:hidden transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeSidebar}
      ></div>
      
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:w-64 md:h-screen ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-6 border-b">
            <Link to="/" className="text-xl font-bold text-[#0A84FF]">Plan Tracker</Link>
            <button 
              onClick={closeSidebar}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none md:hidden"
            >
              <X size={20} />
            </button>
          </div>
          
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'bg-[#0A84FF] bg-opacity-10 text-[#0A84FF]'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={closeSidebar}
              >
                <span className={`mr-3 ${isActive(item.path) ? 'text-[#0A84FF]' : 'text-gray-500'}`}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="p-4 border-t">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-[#0A84FF] text-white flex items-center justify-center">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"
            >
              <LogOut size={18} className="mr-2" />
              Sign out
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <main className="flex-1 overflow-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;