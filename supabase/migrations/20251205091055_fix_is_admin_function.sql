/*
  # Fix is_admin Function to Prevent Recursion

  ## Problem
  The is_admin() function queries profiles table, which triggers RLS policies,
  which may call is_admin() again, causing recursion.

  ## Solution
  Recreate is_admin() function with SECURITY DEFINER to bypass RLS
  and use the helper get_my_role() function instead

  ## Security
  - Function only checks current user's role
  - SECURITY DEFINER is safe here as it only returns boolean
  - No data exposure risk
*/

-- Drop and recreate is_admin to use get_my_role helper
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT get_my_role() = 'admin';
$$;
