
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, MapPin, Clock, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskProposals from "@/components/TaskProposals";

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
  required_date: string | null;
  skills: string[] | null;
  time_flexible: boolean | null;
}

const MyTasks = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['my-tasks', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      console.log('Fetching tasks for user:', user.id);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user tasks:', error);
        throw error;
      }

      return data as Task[];
    },
    enabled: !!user
  });

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Open</Badge>;
      case 'assigned':
        return <Badge variant="default" className="bg-green-100 text-green-800">Assigned</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-purple-100 text-purple-800">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const openTasks = tasks.filter(task => task.status === 'open');
  const activeTasks = tasks.filter(task => ['assigned', 'in_progress'].includes(task.status));
  const completedTasks = tasks.filter(task => ['completed', 'cancelled'].includes(task.status));

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Sign In Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to view your tasks.</p>
            <Button onClick={() => navigate('/auth')}>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              <Button onClick={() => navigate('/post-task')} className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Post New Task</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tasks</h1>
          <p className="text-gray-600">Manage your posted tasks and view proposals</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tasks List */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="open" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="open">Open ({openTasks.length})</TabsTrigger>
                <TabsTrigger value="active">Active ({activeTasks.length})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="open" className="space-y-4 mt-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : openTasks.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No open tasks</h3>
                      <p className="text-gray-500 mb-4">You don't have any open tasks yet.</p>
                      <Button onClick={() => navigate('/post-task')}>Post Your First Task</Button>
                    </CardContent>
                  </Card>
                ) : (
                  openTasks.map((task) => (
                    <Card 
                      key={task.id} 
                      className={`cursor-pointer hover:shadow-md transition-shadow ${
                        selectedTask?.id === task.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedTask(task)}
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{task.title}</CardTitle>
                            <CardDescription className="mt-1">{task.description}</CardDescription>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            {getStatusBadge(task.status)}
                            {task.urgent && <Badge variant="destructive">Urgent</Badge>}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-green-600">{formatBudget(task)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-500">{getTimeAgo(task.created_at)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-500">{task.location}</span>
                          </div>
                          <div>
                            <Badge variant="secondary" className="capitalize">{task.category}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="active" className="space-y-4 mt-6">
                {activeTasks.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No active tasks</h3>
                      <p className="text-gray-500">You don't have any active tasks yet.</p>
                    </CardContent>
                  </Card>
                ) : (
                  activeTasks.map((task) => (
                    <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      {/* Similar structure as open tasks */}
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="completed" className="space-y-4 mt-6">
                {completedTasks.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No completed tasks</h3>
                      <p className="text-gray-500">You don't have any completed tasks yet.</p>
                    </CardContent>
                  </Card>
                ) : (
                  completedTasks.map((task) => (
                    <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      {/* Similar structure as open tasks */}
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Proposals Panel */}
          <div className="lg:col-span-1">
            {selectedTask ? (
              <div className="sticky top-24">
                <TaskProposals taskId={selectedTask.id} taskTitle={selectedTask.title} />
              </div>
            ) : (
              <Card className="sticky top-24">
                <CardContent className="p-8 text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Task</h3>
                  <p className="text-gray-500">
                    Click on a task to view proposals and manage applications.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTasks;
