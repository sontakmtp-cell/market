-- Allow clients to delete their own active projects
-- Prevents deletion when project has moved beyond 'active' (e.g., after acceptance)

CREATE POLICY "Clients can delete their own active projects"
ON public.marketplace_projects
FOR DELETE
USING (
  auth.uid() = client_user_id AND status = 'active'
);

