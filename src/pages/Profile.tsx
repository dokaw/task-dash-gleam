
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Star, 
  DollarSign, 
  Briefcase, 
  CheckCircle,
  Clock,
  Edit,
  Save,
  X
} from 'lucide-react';
import Navigation from '@/components/Navigation';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

interface TaskStats {
  posted_tasks: number;
  completed_tasks_as_client: number;
  completed_tasks_as_tasker: number;
  total_earned: number;
  total_spent: number;
  average_rating: number;
  active_tasks: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget_amount: number;
  status: string;
  created_at: string;
}

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<TaskStats>({
    posted_tasks: 0,
    completed_tasks_as_client: 0,
    completed_tasks_as_tasker: 0,
    total_earned: 0,
    total_spent: 0,
    average_rating: 4.8,
    active_tasks: 0
  });
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: '',
    bio: '',
    location: '',
    skills: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchUserStats();
      fetchUserTasks();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      
      setProfile(data);
      setEditForm({
        full_name: data.full_name || '',
        bio: '',
        location: '',
        skills: ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchUserStats = async () => {
    try {
      // Fetch posted tasks count
      const { count: postedCount } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);

      // Fetch active tasks count
      const { count: activeCount } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)
        .in('status', ['open', 'assigned']);

      // Fetch completed tasks as client
      const { count: completedAsClient } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)
        .eq('status', 'completed');

      // Fetch proposals for tasks completed as tasker
      const { data: acceptedProposals } = await supabase
        .from('proposals')
        .select('task_id, tasks!inner(*)')
        .eq('tasker_id', user?.id)
        .eq('status', 'accepted')
        .eq('tasks.status', 'completed');

      setStats(prev => ({
        ...prev,
        posted_tasks: postedCount || 0,
        active_tasks: activeCount || 0,
        completed_tasks_as_client: completedAsClient || 0,
        completed_tasks_as_tasker: acceptedProposals?.length || 0
      }));
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchUserTasks = async () => {
    try {
      // Fetch recent posted tasks
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentTasks(tasks || []);

      // Fetch completed tasks
      const { data: completed, error: completedError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'completed')
        .order('updated_at', { ascending: false })
        .limit(5);

      if (completedError) throw completedError;
      setCompletedTasks(completed || []);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editForm.full_name
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });

      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile.',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { color: 'bg-blue-100 text-blue-800', text: 'Open' },
      assigned: { color: 'bg-yellow-100 text-yellow-800', text: 'In Progress' },
      completed: { color: 'bg-green-100 text-green-800', text: 'Completed' },
      cancelled: { color: 'bg-gray-100 text-gray-800', text: 'Cancelled' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.open;
    
    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile?.avatar_url || ''} />
                  <AvatarFallback className="text-lg">
                    {profile?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        value={editForm.full_name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                        placeholder="Full Name"
                        className="w-64"
                      />
                    </div>
                  ) : (
                    <>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {profile?.full_name || 'Anonymous User'}
                      </h1>
                      <div className="flex items-center text-gray-600 mt-1">
                        <Mail className="h-4 w-4 mr-2" />
                        {profile?.email}
                      </div>
                      <div className="flex items-center text-gray-600 mt-1">
                        <Calendar className="h-4 w-4 mr-2" />
                        Member since {new Date(profile?.created_at || '').toLocaleDateString()}
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <Button onClick={handleUpdateProfile} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)} size="sm">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" onClick={() => setIsEditing(true)} size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Briefcase className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tasks Posted</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.posted_tasks}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed as Client</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completed_tasks_as_client}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed as Tasker</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completed_tasks_as_tasker}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.average_rating.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Tabs */}
        <Tabs defaultValue="posted" className="space-y-4">
          <TabsList>
            <TabsTrigger value="posted">Posted Tasks</TabsTrigger>
            <TabsTrigger value="completed">Completed Tasks</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="posted" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Posted Tasks</CardTitle>
                <CardDescription>Tasks you've posted on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                {recentTasks.length > 0 ? (
                  <div className="space-y-4">
                    {recentTasks.map((task) => (
                      <div key={task.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900">{task.title}</h3>
                          {getStatusBadge(task.status)}
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {task.location}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            ${task.budget_amount}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {new Date(task.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No tasks posted yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Completed Tasks</CardTitle>
                <CardDescription>Tasks you've successfully completed</CardDescription>
              </CardHeader>
              <CardContent>
                {completedTasks.length > 0 ? (
                  <div className="space-y-4">
                    {completedTasks.map((task) => (
                      <div key={task.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900">{task.title}</h3>
                          <Badge className="bg-green-100 text-green-800">Completed</Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {task.location}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            ${task.budget_amount}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No completed tasks yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reviews & Ratings</CardTitle>
                <CardDescription>Feedback from clients and taskers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Star className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Great Work!</h3>
                  <p className="text-gray-600 mb-4">You're maintaining an excellent {stats.average_rating.toFixed(1)}/5.0 rating</p>
                  <p className="text-sm text-gray-500">Reviews system coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
