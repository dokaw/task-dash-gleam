
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

interface Task {
  id: string;
  title: string;
  budget_type: string;
  budget_amount: number | null;
  budget_min: number | null;
  budget_max: number | null;
}

interface MakeOfferModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (offer: any) => void;
}

const MakeOfferModal: React.FC<MakeOfferModalProps> = ({
  task,
  isOpen,
  onClose,
  onSubmit
}) => {
  const [offerAmount, setOfferAmount] = useState("");
  const [message, setMessage] = useState("");
  const [timeline, setTimeline] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  if (!task) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!offerAmount || !message || !timeline) {
      toast.error("Please fill in all required fields");
      return;
    }

    const amount = parseFloat(offerAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid offer amount");
      return;
    }

    if (!user) {
      toast.error("Please sign in to make an offer");
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Submitting offer:', { task_id: task.id, tasker_id: user.id, amount, message, timeline });
      
      const { data, error } = await supabase
        .from('proposals')
        .insert({
          task_id: task.id,
          tasker_id: user.id,
          amount: amount,
          message: message,
          timeline: timeline,
        })
        .select();

      if (error) {
        console.error('Error submitting offer:', error);
        toast.error("Failed to submit offer. Please try again.");
        return;
      }

      console.log('Offer submitted successfully:', data);

      // Invalidate queries to refresh the proposals list
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      
      // Call onSubmit callback if provided
      if (onSubmit) {
        await onSubmit({
          task_id: task.id,
          amount: amount,
          message: message,
          timeline: timeline,
        });
      }
      
      // Reset form
      setOfferAmount("");
      setMessage("");
      setTimeline("");
      
      // Close modal
      onClose();
      
      toast.success("Offer submitted successfully!");
    } catch (error) {
      console.error('Error submitting offer:', error);
      toast.error("Failed to submit offer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSuggestedAmount = () => {
    if (task.budget_type === 'fixed' && task.budget_amount) {
      return task.budget_amount.toString();
    } else if (task.budget_type === 'range' && task.budget_min && task.budget_max) {
      return Math.round((task.budget_min + task.budget_max) / 2).toString();
    } else if (task.budget_type === 'hourly' && task.budget_amount) {
      return task.budget_amount.toString();
    }
    return "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Make an Offer</DialogTitle>
          <DialogDescription>
            Submit your proposal for: <strong>{task.title}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="offer-amount">
              Your Offer Amount {task.budget_type === 'hourly' ? '(per hour)' : ''}*
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <Input
                id="offer-amount"
                type="number"
                placeholder={getSuggestedAmount() || "Enter amount"}
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                className="pl-8"
                min="1"
                step="0.01"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="timeline">Timeline*</Label>
            <Select value={timeline} onValueChange={setTimeline} required>
              <SelectTrigger>
                <SelectValue placeholder="Select timeline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asap">As soon as possible</SelectItem>
                <SelectItem value="1-3-days">1-3 days</SelectItem>
                <SelectItem value="1-week">Within 1 week</SelectItem>
                <SelectItem value="2-weeks">Within 2 weeks</SelectItem>
                <SelectItem value="1-month">Within 1 month</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message">Message*</Label>
            <Textarea
              id="message"
              placeholder="Explain why you're the right person for this task..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Offer"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MakeOfferModal;
