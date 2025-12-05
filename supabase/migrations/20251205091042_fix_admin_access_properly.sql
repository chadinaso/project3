/*
  # Fix Admin Access Without Recursion

  ## Problem
  Current policies cause recursion when checking role in the same table being queried.

  ## Solution
  1. Create a helper function with SECURITY DEFINER that bypasses RLS
  2. Use this function in policies to check if current user is admin
  3. This breaks the recursion cycle

  ## Security
  - Helper function only returns role of current user
  - Cannot be used to access other users' data
  - SELECT policy remains restrictive
*/

-- Create helper function to get current user's role
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role 
  FROM profiles 
  WHERE id = auth.uid()
  LIMIT 1;
$$;

-- Drop existing SELECT policies
DROP POLICY IF EXISTS "Users can view profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create single SELECT policy that works for both users and admins
CREATE POLICY "Users can view profiles based on role"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    id = auth.uid() 
    OR 
    get_my_role() = 'admin'
  );
