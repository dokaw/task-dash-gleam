
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, User, Calendar } from "lucide-react";

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

interface TaskDetailsModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onMakeOffer: (taskId: string) => void;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  task,
  isOpen,
  onClose,
  onMakeOffer
}) => {
  if (!task) return null;

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

  const formatRequiredDate = (dateString: string | null) => {
    if (!dateString) return 'No specific date required';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">{task.title}</DialogTitle>
            {task.urgent && <Badge variant="destructive">Urgent</Badge>}
          </div>
          <DialogDescription className="text-base mt-2">
            {task.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Budget */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Budget</h3>
            <p className="text-2xl font-bold text-green-600">{formatBudget(task)}</p>
            <p className="text-sm text-green-700 capitalize">
              {task.budget_type} {task.budget_type === 'hourly' ? 'rate' : 'payment'}
            </p>
          </div>

          {/* Task Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-gray-600">{task.location}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium">Posted</p>
                <p className="text-gray-600">{getTimeAgo(task.created_at)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium">Required Date</p>
                <p className="text-gray-600">{formatRequiredDate(task.required_date)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium">Flexibility</p>
                <p className="text-gray-600">
                  {task.time_flexible ? 'Time flexible' : 'Fixed schedule'}
                </p>
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <p className="font-medium mb-2">Category</p>
            <Badge variant="secondary" className="capitalize">
              {task.category}
            </Badge>
          </div>

          {/* Skills */}
          {task.skills && task.skills.length > 0 && (
            <div>
              <p className="font-medium mb-2">Required Skills</p>
              <div className="flex flex-wrap gap-2">
                {task.skills.map((skill, index) => (
                  <Badge key={index} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button 
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => onMakeOffer(task.id)}
            >
              Make an Offer
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsModal;
