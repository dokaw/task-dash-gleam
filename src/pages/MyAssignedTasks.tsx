
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, DollarSign, User, Briefcase, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";

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
    };
  };
}

const MyAssignedTasks = () => {
  const { user } = useAuth();

  const { data: assignedTasks = [], isLoading } = useQuery({
    queryKey: ['assigned-tasks', user?.id],
    queryFn: async () => {
      console.log('Fetching assigned tasks for user:', user?.id);
      
      // Get tasks owned by current user that have status 'assigned'
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'assigned')
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

  const handleMarkCompleted = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: 'completed', updated_at: new Date().toISOString() })
        .eq('id', taskId);

      if (error) throw error;

      toast.success('Task marked as completed!');
      // Refresh the query
      window.location.reload();
    } catch (error) {
      console.error('Error marking task as completed:', error);
      toast.error('Failed to mark task as completed. Please try again.');
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
              Manage tasks that have been assigned to taskers ({assignedTasks.length} assigned)
            </p>
          </div>

          {assignedTasks.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No assigned tasks yet</h3>
                <p className="text-gray-500 mb-6">
                  When you accept proposals for your tasks, they'll appear here as assigned tasks.
                </p>
                <Button asChild>
                  <a href="/offers">View Pending Offers</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {assignedTasks.map((task) => (
                <Card key={task.id} className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl text-gray-900">{task.title}</CardTitle>
                        <CardDescription className="text-sm mt-1">
                          <Badge variant="outline" className="mr-2">{task.category}</Badge>
                          <Badge className="bg-green-100 text-green-800">Assigned</Badge>
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Created</div>
                        <div className="text-sm font-medium">{formatDate(task.created_at)}</div>
                      </div>
                    </div>

                    {/* Assigned Tasker Info */}
                    {task.accepted_proposal && (
                      <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-3 mb-3">
                          <Avatar>
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-green-800">Assigned Tasker</div>
                            <div className="text-sm text-green-700">
                              {task.accepted_proposal.tasker_profile?.full_name || 'Anonymous Tasker'}
                            </div>
                            <div className="text-xs text-green-600">
                              {task.accepted_proposal.tasker_profile?.email || 'No email available'}
                            </div>
                          </div>
                        </div>
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

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="space-x-3">
                        <Button
                          onClick={() => handleMarkCompleted(task.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Mark as Completed
                        </Button>
                        <Button variant="outline">
                          Contact Tasker
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyAssignedTasks;
