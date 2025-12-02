/*
  # Create Settings Table

  1. New Tables
    - `settings`
      - `id` (uuid, primary key)
      - `key` (text, unique) - Setting identifier
      - `value` (text) - Setting value
      - `updated_at` (timestamp)
      - `updated_by` (uuid) - Reference to user who updated
  
  2. Security
    - Enable RLS on `settings` table
    - Add policy for admins to read all settings
    - Add policy for admins to insert/update settings
    - Add policy for customers to read settings (for news marquee)
  
  3. Initial Data
    - Insert default news marquee text
*/

CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES profiles(id)
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read settings
CREATE POLICY "Anyone can read settings"
  ON settings
  FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can insert settings
CREATE POLICY "Admins can insert settings"
  ON settings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Only admins can update settings
CREATE POLICY "Admins can update settings"
  ON settings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Insert default news marquee text
INSERT INTO settings (key, value)
VALUES ('news_marquee', 'مرحباً بكم في جارة القمر - منتجات عضوية طبيعية 100%')
ON CONFLICT (key) DO NOTHING;
