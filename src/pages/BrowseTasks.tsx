import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, MapPin, Clock, Filter, ArrowLeft, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import TaskDetailsModal from "@/components/TaskDetailsModal";
import MakeOfferModal from "@/components/MakeOfferModal";

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget_type: string;
  budget_amount: number | null;
  budget_min: number | null;
  budget_max: number | null;
  urgent: boolean;
  created_at: string;
  status: string;
}

const BrowseTasks = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [budgetRange, setBudgetRange] = useState([0, 500]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['tasks', 'open'],
    queryFn: async () => {
      console.log('Fetching tasks from database...');
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }

      console.log('Fetched tasks:', data);
      return data as Task[];
    }
  });

  useEffect(() => {
    if (error) {
      toast.error('Failed to load tasks. Please try again.');
    }
  }, [error]);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "handyman", label: "Handyman" },
    { value: "cleaning", label: "Cleaning" },
    { value: "moving", label: "Moving" },
    { value: "tech", label: "Tech Support" },
    { value: "pet-care", label: "Pet Care" },
    { value: "garden", label: "Garden & Outdoor" }
  ];

  const formatBudget = (task: Task) => {
    if (task.budget_type === 'fixed' && task.budget_amount) {
      return `$${task.budget_amount}`;
    } else if (task.budget_type === 'range' && task.budget_min && task.budget_max) {
      return `$${task.budget_min}-${task.budget_max}`;
    } else if (task.budget_type === 'hourly' && task.budget_amount) {
      return `$${task.budget_amount}/hr`;
    }
    return 'Budget not specified';
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const taskDate = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - taskDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || task.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleViewDetails = (task: Task) => {
    setSelectedTask(task);
    setIsDetailsModalOpen(true);
  };

  const handleMakeOffer = (taskId: string) => {
    if (!user) {
      toast.error('Please sign in to make an offer');
      navigate('/auth');
      return;
    }
    
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setIsOfferModalOpen(true);
    }
  };

  const handleSubmitOffer = async (offer: any) => {
    // TODO: Implement offer submission to database
    console.log('Submitting offer:', offer);
    // This will be implemented when we create the proposals table
    toast.info('Offer functionality will be fully implemented with the proposals system');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Button variant="ghost" onClick={() => navigate('/')} className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Button>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TaskHub
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Welcome, {user.email}</span>
                  <Button onClick={() => navigate('/post-task')}>Post a Task</Button>
                </div>
              ) : (
                <>
                  <Button variant="outline" onClick={() => navigate('/auth')}>Sign In</Button>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" onClick={() => navigate('/post-task')}>
                    Post a Task
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Tasks</h1>
          <p className="text-gray-600">Find the perfect task that matches your skills and availability</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <span>Filters</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium mb-2">Search Tasks</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search by keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Budget Range */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Budget Range: ${budgetRange[0]} - ${budgetRange[1]}
                  </label>
                  <Slider
                    value={budgetRange}
                    onValueChange={setBudgetRange}
                    max={1000}
                    min={0}
                    step={10}
                    className="mt-2"
                  />
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium mb-2">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="budget-high">Highest Budget</SelectItem>
                      <SelectItem value="budget-low">Lowest Budget</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tasks List */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {isLoading ? 'Loading...' : `Showing ${filteredTasks.length} of ${tasks.length} tasks`}
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No tasks found matching your criteria.</p>
                <p className="text-gray-400 mt-2">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {!isLoading && filteredTasks.length > 0 && (
                  <div className="space-y-6">
                    {filteredTasks.map((task) => (
                      <Card key={task.id} className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-blue-500">
                        <CardHeader>
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <CardTitle className="text-xl">{task.title}</CardTitle>
                                {task.urgent && <Badge variant="destructive">Urgent</Badge>}
                              </div>
                              <CardDescription className="text-sm leading-relaxed">
                                {task.description}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <div>
                                <span className="text-3xl font-bold text-green-600">{formatBudget(task)}</span>
                              </div>
                              
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <MapPin className="h-4 w-4" />
                                <span>{task.location}</span>
                              </div>
                              
                              <div className="flex items-center space-x-4 text-sm">
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4 text-gray-400" />
                                  <span className="text-gray-500">{getTimeAgo(task.created_at)}</span>
                                </div>
                                <Badge variant="secondary" className="capitalize">
                                  {task.category}
                                </Badge>
                              </div>
                            </div>

                            <div className="flex flex-col justify-between">
                              <div className="flex flex-col space-y-2">
                                <Button 
                                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                  onClick={() => handleMakeOffer(task.id)}
                                >
                                  Make an Offer
                                </Button>
                                <Button 
                                  variant="outline" 
                                  className="w-full"
                                  onClick={() => handleViewDetails(task)}
                                >
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <TaskDetailsModal
        task={selectedTask}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onMakeOffer={handleMakeOffer}
      />

      <MakeOfferModal
        task={selectedTask}
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        onSubmit={handleSubmitOffer}
      />
    </div>
  );
};

export default BrowseTasks;
