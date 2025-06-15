
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, Calendar, MapPin } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import TaskProgress from "@/components/TaskProgress";
import TaskerContactCard from "@/components/TaskerContactCard";

interface AssignedTask {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget_type: string;
  budget_amount: number | null;
  budget_min: number | null;
  budget_max: number | null;
  required_date: string | null;
  status: string;
  created_at: string;
  accepted_proposal?: {
    id: string;
    amount: number;
    timeline: string;
    message: string;
    tasker_profile?: {
      full_name: string;
      email: string;
      phone?: string;
      rating?: number;
      completedTasks?: number;
    };
  };
}

// Demo data for assigned tasks
const demoAssignedTasks: AssignedTask[] = [
  {
    id: "demo-1",
    title: "Logo Design for Tech Startup",
    description: "Need a professional logo design for my new tech startup. Looking for something modern, clean, and memorable that represents innovation and technology.",
    category: "Design",
    location: "San Francisco, CA",
    budget_type: "fixed",
    budget_amount: 150,
    budget_min: null,
    budget_max: null,
    required_date: "2024-01-25",
    status: "in_progress",
    created_at: "2024-01-15T10:30:00Z",
    accepted_proposal: {
      id: "prop-1",
      amount: 150,
      timeline: "1-week",
      message: "I'm a professional graphic designer with 5+ years of experience in logo design.",
      tasker_profile: {
        full_name: "Sarah Johnson",
        email: "sarah.j@example.com",
        phone: "+1 (555) 123-4567",
        rating: 4.9,
        completedTasks: 47
      }
    }
  },
  {
    id: "demo-2",
    title: "Website Development for Restaurant",
    description: "Looking for a developer to create a modern website for my restaurant with online ordering system.",
    category: "Web Development",
    location: "New York, NY",
    budget_type: "fixed",
    budget_amount: 800,
    budget_min: null,
    budget_max: null,
    required_date: "2024-02-10",
    status: "review",
    created_at: "2024-01-14T15:45:00Z",
    accepted_proposal: {
      id: "prop-2",
      amount: 800,
      timeline: "2-weeks",
      message: "Full-stack developer with expertise in React and Node.js.",
      tasker_profile: {
        full_name: "Mike Chen",
        email: "mike.chen@example.com",
        rating: 4.8,
        completedTasks: 23
      }
    }
  },
  {
    id: "demo-3",
    title: "Mobile App UI/UX Design",
    description: "Need UI/UX design for a fitness tracking mobile app with modern, intuitive design.",
    category: "Design",
    location: "Austin, TX",
    budget_type: "fixed",
    budget_amount: 450,
    budget_min: null,
    budget_max: null,
    required_date: "2024-02-15",
    status: "assigned",
    created_at: "2024-01-12T14:10:00Z",
    accepted_proposal: {
      id: "prop-3",
      amount: 450,
      timeline: "1-month",
      message: "UI/UX designer with a focus on mobile applications.",
      tasker_profile: {
        full_name: "Alex Thompson",
        email: "alex.t@example.com",
        phone: "+1 (555) 987-6543",
        rating: 4.7,
        completedTasks: 31
      }
    }
  }
];

const MyAssignedTasks = () => {
  const { user } = useAuth();

  const { data: assignedTasks = [], isLoading } = useQuery({
    queryKey: ['assigned-tasks', user?.id],
    queryFn: async () => {
      console.log('Fetching assigned tasks for user:', user?.id);
      
      // Get tasks owned by current user that have status 'assigned', 'in_progress', 'review', or 'completed'
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user?.id)
        .in('status', ['assigned', 'in_progress', 'review', 'completed'])
        .order('created_at', { ascending: false });

      if (tasksError) {
        console.error('Error fetching assigned tasks:', tasksError);
        throw tasksError;
      }

      if (!tasksData || tasksData.length === 0) {
        return [];
      }

      // Get accepted proposals for these tasks
      const taskIds = tasksData.map(task => task.id);
      const { data: proposalsData, error: proposalsError } = await supabase
        .from('proposals')
        .select('*')
        .in('task_id', taskIds)
        .eq('status', 'accepted');

      if (proposalsError) {
        console.error('Error fetching accepted proposals:', proposalsError);
        throw proposalsError;
      }

      // Get tasker profiles for the accepted proposals
      const taskerIds = proposalsData?.map(proposal => proposal.tasker_id) || [];
      let profilesData = [];
      
      if (taskerIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', taskerIds);

        if (profilesError) {
          console.error('Error fetching tasker profiles:', profilesError);
        } else {
          profilesData = profiles || [];
        }
      }

      // Combine tasks with their accepted proposals and tasker profiles
      const assignedTasksWithDetails = tasksData.map(task => {
        const acceptedProposal = proposalsData?.find(proposal => proposal.task_id === task.id);
        const taskerProfile = acceptedProposal 
          ? profilesData.find(profile => profile.id === acceptedProposal.tasker_id)
          : null;

        return {
          ...task,
          accepted_proposal: acceptedProposal ? {
            ...acceptedProposal,
            tasker_profile: taskerProfile
          } : undefined
        };
      });

      console.log('Fetched assigned tasks with details:', assignedTasksWithDetails);
      return assignedTasksWithDetails;
    },
    enabled: !!user
  });

  // Use demo data if no real assigned tasks
  const displayTasks = assignedTasks.length > 0 ? assignedTasks : demoAssignedTasks;
  const isDemo = assignedTasks.length === 0;

  const getTimelineDisplay = (timeline: string) => {
    const timelineMap: { [key: string]: string } = {
      'asap': 'As soon as possible',
      '1-3-days': '1-3 days',
      '1-week': 'Within 1 week',
      '2-weeks': 'Within 2 weeks',
      '1-month': 'Within 1 month',
      'flexible': 'Flexible'
    };
    return timelineMap[timeline] || timeline;
  };

  const getBudgetDisplay = (task: AssignedTask) => {
    if (task.budget_type === 'fixed' && task.budget_amount) {
      return `$${task.budget_amount}`;
    } else if (task.budget_type === 'range' && task.budget_min && task.budget_max) {
      return `$${task.budget_min} - $${task.budget_max}`;
    } else if (task.budget_type === 'hourly' && task.budget_amount) {
      return `$${task.budget_amount}/hr`;
    }
    return 'Budget not specified';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No deadline';
    return new Date(dateString).toLocaleDateString();
  };

  const handleStatusUpdate = async (taskId: string, status: string, note?: string) => {
    if (isDemo) {
      toast.success(`Demo: Task would be updated to ${status}!`);
      return;
    }

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', taskId);

      if (error) throw error;

      toast.success(`Task status updated to ${status.replace('_', ' ')}!`);
      // Refresh the query
      window.location.reload();
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">My Assigned Tasks</h1>
              <p className="text-gray-600 mt-2">Manage tasks that have been assigned to taskers</p>
            </div>
            
            <div className="space-y-4">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Assigned Tasks</h1>
            <p className="text-gray-600 mt-2">
              Manage tasks that have been assigned to taskers ({displayTasks.length} assigned)
            </p>
            {isDemo && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-800 text-sm">
                  <strong>Demo Data:</strong> This shows sample assigned tasks with different progress stages. In the real app, you'll see your actual tasks.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-8">
            {displayTasks.map((task) => (
              <div key={task.id} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Task Card */}
                <div className="lg:col-span-2">
                  <Card className="border-l-4 border-l-green-500">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl text-gray-900">{task.title}</CardTitle>
                          <CardDescription className="text-sm mt-1">
                            <Badge variant="outline" className="mr-2">{task.category}</Badge>
                            {isDemo && <Badge variant="secondary" className="ml-2">Demo</Badge>}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Created</div>
                          <div className="text-sm font-medium">{formatDate(task.created_at)}</div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Task Description:</h4>
                        <p className="text-gray-700 text-sm leading-relaxed">{task.description}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{task.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <span>{getBudgetDisplay(task)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>{formatDate(task.required_date)}</span>
                        </div>
                      </div>

                      {task.accepted_proposal && (
                        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <span className="font-semibold">${task.accepted_proposal.amount}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-green-600" />
                              <span>{getTimelineDisplay(task.accepted_proposal.timeline)}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Side Panel with Tasker Info and Progress */}
                <div className="space-y-4">
                  {task.accepted_proposal?.tasker_profile && (
                    <TaskerContactCard 
                      tasker={task.accepted_proposal.tasker_profile} 
                      isDemo={isDemo}
                    />
                  )}
                  
                  <TaskProgress
                    taskId={task.id}
                    currentStatus={task.status}
                    isTasker={false}
                    onStatusUpdate={handleStatusUpdate}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyAssignedTasks;
