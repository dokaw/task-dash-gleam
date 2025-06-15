import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, MapPin, DollarSign, Clock, Star, CheckCircle, Users, Shield, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const categories = [
    { name: "Handyman", icon: "🔧", tasks: 245 },
    { name: "Cleaning", icon: "🧽", tasks: 189 },
    { name: "Moving", icon: "📦", tasks: 167 },
    { name: "Tech Support", icon: "💻", tasks: 143 },
    { name: "Pet Care", icon: "🐕", tasks: 98 },
    { name: "Garden", icon: "🌱", tasks: 134 },
    { name: "Delivery", icon: "🚚", tasks: 87 },
    { name: "Admin", icon: "📊", tasks: 76 }
  ];

  const featuredTasks = [
    {
      id: 1,
      title: "Assemble IKEA furniture in bedroom",
      location: "Sydney CBD",
      budget: "$80",
      time: "2 hours",
      tasker: "Sarah M.",
      rating: 4.9,
      category: "Handyman"
    },
    {
      id: 2,
      title: "Deep clean 2 bedroom apartment",
      location: "Melbourne",
      budget: "$120",
      time: "3 hours",
      tasker: "James K.",
      rating: 4.8,
      category: "Cleaning"
    },
    {
      id: 3,
      title: "Help move furniture to new apartment",
      location: "Brisbane",
      budget: "$100-150",
      time: "4 hours",
      tasker: "Mike R.",
      rating: 4.9,
      category: "Moving"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TaskHub
              </div>
              <div className="hidden md:flex space-x-6">
                <Button variant="ghost" onClick={() => navigate('/browse')}>Browse Tasks</Button>
                <Button variant="ghost">How it works</Button>
                <Button variant="ghost">Support</Button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-600">Welcome, {user.email}</span>
                  <Button variant="outline" onClick={() => signOut()}>Sign Out</Button>
                  <Button 
                    onClick={() => navigate('/post-task')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Post a Task
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => navigate('/auth')}>Sign In</Button>
                  <Button 
                    onClick={() => navigate('/post-task')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Post a Task
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Get things done with
              <span className="block bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                trusted locals
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              From home repairs to personal assistance, connect with skilled Taskers in your area who can help you tackle your to-do list.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input 
                  className="pl-12 h-14 text-lg bg-white/10 border-white/20 text-white placeholder:text-blue-200" 
                  placeholder="What do you need help with?"
                />
              </div>
              <Button 
                size="lg" 
                onClick={() => navigate('/browse')}
                className="h-14 px-8 bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-black font-semibold"
              >
                Find Taskers
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Categories</h2>
            <p className="text-gray-600 text-lg">Browse tasks by category to find what you need</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.tasks} tasks available</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tasks */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Tasks</h2>
            <p className="text-gray-600 text-lg">Discover popular tasks in your area</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredTasks.map((task, index) => (
              <Card key={index} className="hover:shadow-lg transition-all hover:-translate-y-1">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary">{task.category}</Badge>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      {task.rating}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {task.location}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      {task.budget}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {task.time}
                    </div>
                    <div className="pt-3 border-t">
                      <p className="text-sm text-gray-600">Tasker: <span className="font-medium">{task.tasker}</span></p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/browse')}
              className="px-8"
            >
              View All Tasks
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex items-center justify-center mb-4">
                <Users className="h-12 w-12" />
              </div>
              <h3 className="text-3xl font-bold mb-2">50,000+</h3>
              <p className="text-blue-100">Active Taskers</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="h-12 w-12" />
              </div>
              <h3 className="text-3xl font-bold mb-2">1M+</h3>
              <p className="text-blue-100">Tasks Completed</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-4">
                <Star className="h-12 w-12 fill-white" />
              </div>
              <h3 className="text-3xl font-bold mb-2">4.8/5</h3>
              <p className="text-blue-100">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How TaskHub Works</h2>
            <p className="text-gray-600 text-lg">Getting help is easier than ever</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Post Your Task</h3>
              <p className="text-gray-600">Tell us what you need done, when and where</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Choose Your Tasker</h3>
              <p className="text-gray-600">Review offers from skilled Taskers and pick the perfect match</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Get It Done</h3>
              <p className="text-gray-600">Your Tasker arrives and gets the job done right</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                TaskHub
              </div>
              <p className="text-gray-400 mb-4">
                Connecting you with trusted locals to get things done.
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Shield className="h-4 w-4" />
                <span>Secure & Trusted</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Customers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">How it works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Browse tasks</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Safety</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Taskers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Become a Tasker</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tasker app</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Resources</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TaskHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
