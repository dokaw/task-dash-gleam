
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, DollarSign, MessageSquare, User, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

interface ProposalWithTask {
  id: string;
  task_id: string;
  tasker_id: string;
  amount: number;
  message: string;
  timeline: string;
  status: string;
  created_at: string;
  task?: {
    title: string;
    category: string;
  };
  profiles?: {
    full_name: string;
    email: string;
  };
}

const Offers = () => {
  const { user } = useAuth();

  const { data: offers = [], isLoading } = useQuery({
    queryKey: ['user-offers', user?.id],
    queryFn: async () => {
      console.log('Fetching offers for user:', user?.id);
      
      // First get all proposals for tasks owned by the current user
      const { data: proposalsData, error: proposalsError } = await supabase
        .from('proposals')
        .select(`
          *,
          tasks!inner (
            title,
            category,
            user_id
          )
        `)
        .eq('tasks.user_id', user?.id)
        .order('created_at', { ascending: false });

      if (proposalsError) {
        console.error('Error fetching proposals:', proposalsError);
        throw proposalsError;
      }

      if (!proposalsData || proposalsData.length === 0) {
        return [];
      }

      // Get tasker profiles for the proposals
      const taskerIds = proposalsData.map(proposal => proposal.tasker_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', taskerIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }

      // Combine proposals with profiles and tasks
      const proposalsWithProfiles = proposalsData.map(proposal => ({
        ...proposal,
        task: proposal.tasks,
        profiles: profilesData?.find(profile => profile.id === proposal.tasker_id) || null
      }));

      console.log('Fetched offers with profiles:', proposalsWithProfiles);
      return proposalsWithProfiles;
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

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const proposalDate = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - proposalDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Badge variant="default" className="bg-green-100 text-green-800">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Offers & Proposals</h1>
            <p className="text-gray-600 mt-2">Manage proposals from interested taskers</p>
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
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Offers & Proposals</h1>
          <p className="text-gray-600 mt-2">Manage proposals from interested taskers ({offers.length} total)</p>
        </div>

        {offers.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No offers yet</h3>
              <p className="text-gray-500 mb-6">
                When taskers submit proposals for your tasks, they'll appear here.
              </p>
              <Link 
                to="/post-task"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Post a Task
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {offers.map((offer) => (
              <Card key={offer.id} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">
                          {offer.profiles?.full_name || 'Anonymous Tasker'}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {offer.profiles?.email || 'No email available'}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(offer.status)}
                      <span className="text-sm text-gray-500">{getTimeAgo(offer.created_at)}</span>
                    </div>
                  </div>
                  
                  {/* Task Information */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Briefcase className="h-4 w-4" />
                      <span className="font-medium">Task:</span>
                      <span>{offer.task?.title}</span>
                      <Badge variant="outline" className="ml-2">
                        {offer.task?.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-600">${offer.amount}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{getTimelineDisplay(offer.timeline)}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Proposal Message:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">
                      {offer.message}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Link
                      to={`/browse`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Task Details →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Offers;
