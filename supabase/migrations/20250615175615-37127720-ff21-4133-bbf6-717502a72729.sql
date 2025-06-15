
-- Create a table to store proposals/offers from taskers
CREATE TABLE public.proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  tasker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  message TEXT NOT NULL,
  timeline TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, accepted, rejected
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(task_id, tasker_id) -- One proposal per tasker per task
);

-- Add Row Level Security (RLS)
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- Policy: Task owners can view all proposals for their tasks
CREATE POLICY "Task owners can view proposals for their tasks" 
  ON public.proposals 
  FOR SELECT 
  USING (
    task_id IN (
      SELECT id FROM public.tasks WHERE user_id = auth.uid()
    )
  );

-- Policy: Taskers can view their own proposals
CREATE POLICY "Taskers can view their own proposals" 
  ON public.proposals 
  FOR SELECT 
  USING (tasker_id = auth.uid());

-- Policy: Authenticated users can create proposals
CREATE POLICY "Authenticated users can create proposals" 
  ON public.proposals 
  FOR INSERT 
  WITH CHECK (
    auth.uid() IS NOT NULL 
    AND tasker_id = auth.uid()
    AND task_id IN (
      SELECT id FROM public.tasks WHERE status = 'open' AND user_id != auth.uid()
    )
  );

-- Policy: Task owners can update proposal status (accept/reject)
CREATE POLICY "Task owners can update proposal status" 
  ON public.proposals 
  FOR UPDATE 
  USING (
    task_id IN (
      SELECT id FROM public.tasks WHERE user_id = auth.uid()
    )
  );

-- Policy: Taskers can update their own pending proposals
CREATE POLICY "Taskers can update their own pending proposals" 
  ON public.proposals 
  FOR UPDATE 
  USING (
    tasker_id = auth.uid() 
    AND status = 'pending'
  );

-- Add a trigger to update the task status when a proposal is accepted
CREATE OR REPLACE FUNCTION update_task_on_proposal_acceptance()
RETURNS TRIGGER AS $$
BEGIN
  -- If a proposal is accepted, update the task status to 'assigned'
  IF NEW.status = 'accepted' AND OLD.status != 'accepted' THEN
    UPDATE public.tasks 
    SET status = 'assigned', updated_at = now()
    WHERE id = NEW.task_id;
    
    -- Reject all other proposals for this task
    UPDATE public.proposals 
    SET status = 'rejected', updated_at = now()
    WHERE task_id = NEW.task_id AND id != NEW.id AND status = 'pending';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_proposal_status_update
  AFTER UPDATE ON public.proposals
  FOR EACH ROW
  EXECUTE FUNCTION update_task_on_proposal_acceptance();
