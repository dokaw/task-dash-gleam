
-- Create notifications table for task completion alerts
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create payments table to track Stripe transactions
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tasker_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_session_id TEXT UNIQUE,
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, failed, cancelled
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Notifications policies - users can only see their own notifications
CREATE POLICY "select_own_notifications" ON public.notifications
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "insert_notifications" ON public.notifications
  FOR INSERT
  WITH CHECK (true);

-- Payments policies - users can see payments they're involved in
CREATE POLICY "select_own_payments" ON public.payments
  FOR SELECT
  USING (client_id = auth.uid() OR tasker_id = auth.uid());

CREATE POLICY "insert_payments" ON public.payments
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "update_payments" ON public.payments
  FOR UPDATE
  USING (true);

-- Function to create notification when task is completed
CREATE OR REPLACE FUNCTION public.notify_task_completion()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Only create notification when task status changes to 'completed'
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    INSERT INTO public.notifications (user_id, task_id, type, title, message)
    VALUES (
      NEW.user_id,
      NEW.id,
      'task_completed',
      'Task Completed!',
      'Your task "' || NEW.title || '" has been completed and is ready for payment.'
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create trigger for task completion notifications
CREATE TRIGGER on_task_completed
  AFTER UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_task_completion();
