/*
  # Add Address Fields to Profiles Table

  ## Changes
  1. Add new columns to profiles table:
    - `area` (text) - The customer's area/region from predefined list
    - `custom_area` (text, nullable) - Custom area if not in predefined list
    - `detailed_address` (text) - Detailed address information
  
  ## Notes
  - All fields are required except custom_area
  - Existing users will need to update their profiles
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'area'
  ) THEN
    ALTER TABLE profiles ADD COLUMN area text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'custom_area'
  ) THEN
    ALTER TABLE profiles ADD COLUMN custom_area text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'detailed_address'
  ) THEN
    ALTER TABLE profiles ADD COLUMN detailed_address text;
  END IF;
END $$;