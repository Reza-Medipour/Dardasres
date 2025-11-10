/*
  # Initial Database Schema for DarDastras AI Service Platform

  ## Overview
  This migration creates the complete database structure for a Persian AI service platform
  that provides voice/video transcription, summarization, subtitle generation, and AI content creation.

  ## New Tables

  ### 1. profiles
  - `id` (uuid, primary key, references auth.users)
  - `full_name` (text)
  - `avatar_url` (text, nullable)
  - `subscription_type` (text, default: 'free') - 'free' or 'premium'
  - `subscription_expires_at` (timestamptz, nullable)
  - `total_usage_mb` (numeric, default: 0) - Total file upload usage in MB
  - `created_at` (timestamptz, default: now())
  - `updated_at` (timestamptz, default: now())

  ### 2. services
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `service_type` (text) - 'transcription', 'subtitle', 'summary', 'title', 'image', 'video'
  - `input_type` (text) - 'audio', 'video', 'link', 'text'
  - `input_url` (text, nullable)
  - `input_language` (text) - 'fa', 'en', 'ar', etc.
  - `output_language` (text, nullable)
  - `file_size_mb` (numeric, default: 0)
  - `status` (text, default: 'pending') - 'pending', 'processing', 'completed', 'failed'
  - `progress` (integer, default: 0) - 0-100
  - `result_data` (jsonb, nullable) - Stores output results
  - `error_message` (text, nullable)
  - `created_at` (timestamptz, default: now())
  - `completed_at` (timestamptz, nullable)

  ### 3. usage_history
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `service_id` (uuid, references services)
  - `service_type` (text)
  - `file_size_mb` (numeric)
  - `cost_credits` (numeric, default: 1) - Cost in credits
  - `created_at` (timestamptz, default: now())

  ### 4. subscription_plans
  - `id` (uuid, primary key)
  - `name` (text) - 'Free', 'Premium Monthly', 'Premium Yearly'
  - `name_fa` (text) - Persian name
  - `price` (numeric) - Price in Toman
  - `duration_days` (integer) - Duration in days
  - `max_file_size_mb` (integer) - Max file size limit
  - `monthly_quota_mb` (integer) - Monthly upload quota
  - `features` (jsonb) - List of features
  - `is_active` (boolean, default: true)
  - `created_at` (timestamptz, default: now())

  ## Security
  - Enable RLS on all tables
  - Add policies for authenticated users to manage their own data
  - Add policies for viewing public subscription plans

  ## Notes
  - File size limit: 1GB (1024 MB) maximum for uploads
  - All timestamps use UTC timezone
  - JSONB fields store structured data for flexibility
  - Premium users get higher quotas and additional features
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  avatar_url text,
  subscription_type text NOT NULL DEFAULT 'free' CHECK (subscription_type IN ('free', 'premium')),
  subscription_expires_at timestamptz,
  total_usage_mb numeric NOT NULL DEFAULT 0 CHECK (total_usage_mb >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  service_type text NOT NULL CHECK (service_type IN ('transcription', 'subtitle', 'summary', 'title', 'image', 'video')),
  input_type text NOT NULL CHECK (input_type IN ('audio', 'video', 'link', 'text')),
  input_url text,
  input_language text NOT NULL DEFAULT 'fa',
  output_language text,
  file_size_mb numeric NOT NULL DEFAULT 0 CHECK (file_size_mb >= 0 AND file_size_mb <= 1024),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  progress integer NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  result_data jsonb,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

-- Create usage_history table
CREATE TABLE IF NOT EXISTS usage_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  service_type text NOT NULL,
  file_size_mb numeric NOT NULL DEFAULT 0,
  cost_credits numeric NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  name_fa text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  duration_days integer NOT NULL DEFAULT 0,
  max_file_size_mb integer NOT NULL DEFAULT 100,
  monthly_quota_mb integer NOT NULL DEFAULT 1000,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

-- Policies for profiles table
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policies for services table
CREATE POLICY "Users can view own services"
  ON services FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own services"
  ON services FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own services"
  ON services FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own services"
  ON services FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for usage_history table
CREATE POLICY "Users can view own usage history"
  ON usage_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own usage history"
  ON usage_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for subscription_plans table (public read)
CREATE POLICY "Anyone can view active subscription plans"
  ON subscription_plans FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Insert default subscription plans
INSERT INTO subscription_plans (name, name_fa, price, duration_days, max_file_size_mb, monthly_quota_mb, features)
VALUES
  ('Free', 'رایگان', 0, 0, 100, 500, '["تبدیل متن", "خلاصه‌سازی پایه", "محدودیت 100MB برای هر فایل"]'::jsonb),
  ('Premium Monthly', 'پرمیوم ماهانه', 299000, 30, 1024, 10000, '["تبدیل متن نامحدود", "زیرنویس", "خلاصه‌سازی پیشرفته", "تولید عنوان", "تولید تصویر", "تولید ویدئو", "محدودیت 1GB برای هر فایل", "پشتیبانی اختصاصی"]'::jsonb),
  ('Premium Yearly', 'پرمیوم سالانه', 2990000, 365, 1024, 120000, '["تمام امکانات پرمیوم ماهانه", "تخفیف 17 درصد", "اولویت پردازش", "ذخیره‌سازی نامحدود"]'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_services_user_id ON services(user_id);
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
CREATE INDEX IF NOT EXISTS idx_services_created_at ON services(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_history_user_id ON usage_history(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_history_created_at ON usage_history(created_at DESC);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();