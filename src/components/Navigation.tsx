
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, X, Briefcase, Plus, Eye, DollarSign } from "lucide-react";
import NotificationBell from "./NotificationBell";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">TaskConnect</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/browse"
              className={`text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/browse") ? "bg-blue-50 text-blue-700" : ""
              }`}
            >
              <Eye className="inline h-4 w-4 mr-1" />
              Browse Tasks
            </Link>
            
            {user && (
              <>
                <Link
                  to="/post-task"
                  className={`text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/post-task") ? "bg-blue-50 text-blue-700" : ""
                  }`}
                >
                  <Plus className="inline h-4 w-4 mr-1" />
                  Post Task
                </Link>
                <Link
                  to="/offers"
                  className={`text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/offers") ? "bg-blue-50 text-blue-700" : ""
                  }`}
                >
                  My Tasks
                </Link>
                <Link
                  to="/assigned-tasks"
                  className={`text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/assigned-tasks") ? "bg-blue-50 text-blue-700" : ""
                  }`}
                >
                  <DollarSign className="inline h-4 w-4 mr-1" />
                  Assigned Tasks
                </Link>
                
                <NotificationBell />
                
                <Button
                  onClick={signOut}
                  variant="outline"
                  size="sm"
                >
                  Sign Out
                </Button>
              </>
            )}
            
            {!user && (
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {user && <NotificationBell />}
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              <Link
                to="/browse"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/browse")
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Eye className="inline h-4 w-4 mr-2" />
                Browse Tasks
              </Link>
              
              {user && (
                <>
                  <Link
                    to="/post-task"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive("/post-task")
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Plus className="inline h-4 w-4 mr-2" />
                    Post Task
                  </Link>
                  <Link
                    to="/offers"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive("/offers")
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    My Tasks
                  </Link>
                  <Link
                    to="/assigned-tasks"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive("/assigned-tasks")
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <DollarSign className="inline h-4 w-4 mr-2" />
                    Assigned Tasks
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900"
                  >
                    Sign Out
                  </button>
                </>
              )}
              
              {!user && (
                <Link
                  to="/auth"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
