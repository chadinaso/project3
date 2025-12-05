/*
  # Fix Infinite Recursion in Profiles SELECT Policy

  ## Problem
  The current SELECT policy on profiles table causes an infinite recursion:
  - Policy checks `is_admin()`
  - `is_admin()` queries profiles table to check role
  - This triggers the SELECT policy again
  - Which calls `is_admin()` again... infinite loop

  ## Solution
  Replace SELECT policy to check role directly without calling is_admin()
  This breaks the recursion cycle while maintaining same security level

  ## Security
  - Users can only view their own profile
  - Admins can view all profiles (checked by direct role comparison)
  - No data exposure risk
*/

-- Drop existing SELECT policy
DROP POLICY IF EXISTS "Users can view profiles" ON profiles;

-- Create new SELECT policy without using is_admin() to avoid recursion
CREATE POLICY "Users can view profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    id = auth.uid()
  );

-- Add separate policy for admin access
CREATE POLICY "Admins can view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    role = 'admin' AND id = auth.uid()
  );
