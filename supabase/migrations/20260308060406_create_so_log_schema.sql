/*
  # SO: Log Dream Journal Schema
  
  ## Overview
  Creates the database structure for SO: Log, a dream journaling system integrating 
  Eastern and Western mysticism with physiological data tracking.
  
  ## New Tables
  
  ### `profiles`
  Stores user personalization data including:
  - `id` (uuid, primary key) - Links to auth.users
  - `name` (text) - User's name for BaZi calculations
  - `birthday` (date) - For Chinese zodiac and BaZi analysis
  - `zodiac_sign` (text) - Western astrological sign
  - `blood_type` (text) - Blood type (A, B, O, AB)
  - `mbti_type` (text) - Myers-Briggs personality type
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### `dream_entries`
  Stores dream journal entries and analysis:
  - `id` (uuid, primary key) - Unique entry identifier
  - `user_id` (uuid, foreign key) - References profiles.id
  - `dream_content` (text) - The dream narrative
  - `stress_level` (int) - Scale 1-10
  - `energy_level` (int) - Scale 1-10
  - `stimulants` (text array) - List of consumed stimulants
  - `hexagram` (text) - I Ching hexagram result
  - `tarot_card` (text) - Tarot card drawn
  - `analysis` (text) - AI-generated deep analysis
  - `entry_date` (date) - Date of dream entry
  - `created_at` (timestamptz) - Record creation timestamp
  
  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
  - Authenticated users required for all operations
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  birthday date,
  zodiac_sign text,
  blood_type text,
  mbti_type text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create dream_entries table
CREATE TABLE IF NOT EXISTS dream_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  dream_content text NOT NULL,
  stress_level int CHECK (stress_level >= 1 AND stress_level <= 10),
  energy_level int CHECK (energy_level >= 1 AND energy_level <= 10),
  stimulants text[] DEFAULT '{}',
  hexagram text,
  tarot_card text,
  analysis text,
  entry_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE dream_entries ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Dream entries policies
CREATE POLICY "Users can view own dream entries"
  ON dream_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own dream entries"
  ON dream_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own dream entries"
  ON dream_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own dream entries"
  ON dream_entries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
