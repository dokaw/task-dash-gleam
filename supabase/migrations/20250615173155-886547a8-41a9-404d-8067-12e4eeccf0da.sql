
-- Drop the existing policy
DROP POLICY IF EXISTS "Anyone can view open tasks" ON public.tasks;

-- Create a new policy that allows everyone to view open tasks
CREATE POLICY "Public can view open tasks" ON public.tasks
  FOR SELECT USING (status = 'open');

-- Create a separate policy for task owners to view their own tasks regardless of status
CREATE POLICY "Users can view their own tasks" ON public.tasks
  FOR SELECT USING (auth.uid() = user_id);
