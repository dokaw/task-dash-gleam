
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, MessageSquare, Shield } from "lucide-react";
import Navigation from "@/components/Navigation";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Local Help for Any Task
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with skilled people in your area to get things done. Post a task or offer your services.
          </p>
          
          <div className="flex justify-center space-x-4">
            <Link to="/browse">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Search className="mr-2 h-5 w-5" />
                Browse Tasks
              </Button>
            </Link>
            
            {user ? (
              <Link to="/post-task">
                <Button size="lg" variant="outline">
                  <Plus className="mr-2 h-5 w-5" />
                  Post a Task
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button size="lg" variant="outline">
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <Search className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Browse & Apply</CardTitle>
              <CardDescription>
                Find tasks that match your skills and location
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <Plus className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Post Tasks</CardTitle>
              <CardDescription>
                Get help with anything from handyman work to digital services
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <MessageSquare className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>Manage Offers</CardTitle>
              <CardDescription>
                Review proposals and choose the best person for your task
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* User Dashboard Quick Links */}
        {user && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Dashboard</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link to="/post-task">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <Plus className="h-6 w-6 text-blue-600 mb-2" />
                    <h3 className="font-semibold">Post New Task</h3>
                    <p className="text-sm text-gray-600">Get help with your next project</p>
                  </CardContent>
                </Card>
              </Link>
              
              <Link to="/offers">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <MessageSquare className="h-6 w-6 text-green-600 mb-2" />
                    <h3 className="font-semibold">View Offers</h3>
                    <p className="text-sm text-gray-600">Review proposals from taskers</p>
                  </CardContent>
                </Card>
              </Link>
              
              <Link to="/browse">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <Search className="h-6 w-6 text-purple-600 mb-2" />
                    <h3 className="font-semibold">Find Work</h3>
                    <p className="text-sm text-gray-600">Browse available tasks</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
