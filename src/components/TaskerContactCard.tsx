
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, MessageCircle, Phone, Star, User } from "lucide-react";
import { toast } from "sonner";

interface TaskerContactCardProps {
  tasker: {
    full_name: string;
    email: string;
    phone?: string;
    rating?: number;
    completedTasks?: number;
  };
  isDemo?: boolean;
}

const TaskerContactCard = ({ tasker, isDemo = false }: TaskerContactCardProps) => {
  const handleContact = (method: 'email' | 'message' | 'phone') => {
    if (isDemo) {
      toast.success(`Demo: Would ${method} ${tasker.full_name}`);
      return;
    }

    switch (method) {
      case 'email':
        window.location.href = `mailto:${tasker.email}`;
        break;
      case 'phone':
        if (tasker.phone) {
          window.location.href = `tel:${tasker.phone}`;
        }
        break;
      case 'message':
        // Would open messaging system
        toast.info('Messaging system coming soon!');
        break;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Assigned Tasker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback>
              <User className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{tasker.full_name}</h3>
            <p className="text-sm text-gray-600">{tasker.email}</p>
            {tasker.rating && (
              <div className="flex items-center space-x-1 mt-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{tasker.rating}</span>
                {tasker.completedTasks && (
                  <span className="text-xs text-gray-500">({tasker.completedTasks} tasks)</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleContact('email')}
          >
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleContact('message')}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Send Message
          </Button>

          {tasker.phone && (
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleContact('phone')}
            >
              <Phone className="h-4 w-4 mr-2" />
              Call Tasker
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskerContactCard;
