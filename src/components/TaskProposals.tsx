
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, DollarSign, MessageSquare, User } from "lucide-react";
import { toast } from "sonner";

interface Proposal {
  id: string;
  task_id: string;
  tasker_id: string;
  amount: number;
  message: string;
  timeline: string;
  status: string;
  created_at: string;
  profiles?: {
    full_name: string;
    email: string;
  };
}

interface TaskProposalsProps {
  taskId: string;
  taskTitle: string;
}

const TaskProposals: React.FC<TaskProposalsProps> = ({ taskId, taskTitle }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: proposals = [], isLoading } = useQuery({
    queryKey: ['proposals', taskId],
    queryFn: async () => {
      console.log('Fetching proposals for task:', taskId);
      
      // First get proposals
      const { data: proposalsData, error: proposalsError } = await supabase
        .from('proposals')
        .select('*')
        .eq('task_id', taskId)
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
        // Continue without profiles if there's an error
      }

      // Combine proposals with profiles
      const proposalsWithProfiles = proposalsData.map(proposal => ({
        ...proposal,
        profiles: profilesData?.find(profile => profile.id === proposal.tasker_id) || null
      }));

      console.log('Fetched proposals with profiles:', proposalsWithProfiles);
      return proposalsWithProfiles;
    },
    enabled: !!user && !!taskId
  });

  const updateProposalMutation = useMutation({
    mutationFn: async ({ proposalId, status }: { proposalId: string; status: string }) => {
      const { error } = await supabase
        .from('proposals')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', proposalId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['proposals', taskId] });
      toast.success(
        variables.status === 'accepted' 
          ? 'Proposal accepted successfully!' 
          : 'Proposal rejected successfully!'
      );
    },
    onError: (error) => {
      console.error('Error updating proposal:', error);
      toast.error('Failed to update proposal. Please try again.');
    }
  });

  const handleAcceptProposal = (proposalId: string) => {
    updateProposalMutation.mutate({ proposalId, status: 'accepted' });
  };

  const handleRejectProposal = (proposalId: string) => {
    updateProposalMutation.mutate({ proposalId, status: 'rejected' });
  };

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
    );
  }

  if (proposals.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No proposals yet</h3>
          <p className="text-gray-500">
            When taskers submit proposals for "{taskTitle}", they'll appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Proposals for "{taskTitle}" ({proposals.length})
      </h3>
      
      {proposals.map((proposal) => (
        <Card key={proposal.id} className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">
                    {proposal.profiles?.full_name || 'Anonymous Tasker'}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {proposal.profiles?.email || 'No email available'}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(proposal.status)}
                <span className="text-sm text-gray-500">{getTimeAgo(proposal.created_at)}</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-green-600">${proposal.amount}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{getTimelineDisplay(proposal.timeline)}</span>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Message:</h4>
              <p className="text-gray-700 text-sm leading-relaxed">{proposal.message}</p>
            </div>

            {proposal.status === 'pending' && (
              <div className="flex space-x-3">
                <Button
                  onClick={() => handleAcceptProposal(proposal.id)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={updateProposalMutation.isPending}
                >
                  Accept Proposal
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleRejectProposal(proposal.id)}
                  disabled={updateProposalMutation.isPending}
                >
                  Reject
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TaskProposals;
