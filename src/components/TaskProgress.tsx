
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Clock, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface TaskProgressProps {
  taskId: string;
  currentStatus: string;
  isTasker?: boolean;
  onStatusUpdate?: (taskId: string, status: string, note?: string) => void;
}

const TaskProgress = ({ taskId, currentStatus, isTasker = false, onStatusUpdate }: TaskProgressProps) => {
  const [progressNote, setProgressNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const getProgressValue = (status: string) => {
    switch (status) {
      case 'assigned': return 25;
      case 'in_progress': return 50;
      case 'review': return 75;
      case 'completed': return 100;
      default: return 0;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'assigned':
        return <Badge variant="secondary">Assigned</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'review':
        return <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge variant="outline">Open</Badge>;
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      // In a real app, this would call the onStatusUpdate prop or make API call
      if (onStatusUpdate) {
        onStatusUpdate(taskId, newStatus, progressNote);
      }
      toast.success(`Task status updated to ${newStatus.replace('_', ' ')}`);
      setProgressNote("");
    } catch (error) {
      toast.error("Failed to update task status");
    } finally {
      setIsUpdating(false);
    }
  };

  const getAvailableActions = () => {
    if (!isTasker) return [];
    
    switch (currentStatus) {
      case 'assigned':
        return [{ status: 'in_progress', label: 'Start Working', icon: Clock }];
      case 'in_progress':
        return [{ status: 'review', label: 'Submit for Review', icon: MessageSquare }];
      case 'review':
        return []; // Only task owner can mark as completed
      default:
        return [];
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Task Progress</span>
          {getStatusBadge(currentStatus)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Progress</span>
            <span>{getProgressValue(currentStatus)}%</span>
          </div>
          <Progress value={getProgressValue(currentStatus)} className="h-2" />
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getProgressValue(currentStatus) >= 25 ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span>Task Assigned</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getProgressValue(currentStatus) >= 50 ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span>Work in Progress</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getProgressValue(currentStatus) >= 75 ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span>Under Review</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getProgressValue(currentStatus) >= 100 ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span>Completed</span>
          </div>
        </div>

        {isTasker && getAvailableActions().length > 0 && (
          <div className="space-y-3 pt-4 border-t">
            <Textarea
              placeholder="Add a progress note (optional)..."
              value={progressNote}
              onChange={(e) => setProgressNote(e.target.value)}
              className="min-h-[80px]"
            />
            <div className="space-x-2">
              {getAvailableActions().map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.status}
                    onClick={() => handleStatusUpdate(action.status)}
                    disabled={isUpdating}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {action.label}
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {!isTasker && currentStatus === 'review' && (
          <div className="pt-4 border-t">
            <Button
              onClick={() => handleStatusUpdate('completed')}
              disabled={isUpdating}
              className="bg-green-600 hover:bg-green-700 w-full"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Completed
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskProgress;
