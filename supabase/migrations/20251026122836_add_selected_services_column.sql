/*
  # Add selected_services column to services table

  1. Changes
    - Add `selected_services` column to store array of selected service types
    - This allows tracking multiple services requested in one API call

  2. Notes
    - Uses JSONB array to store multiple service types
    - Example: ["transcription", "subtitle", "summary"]
*/

-- Add selected_services column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'selected_services'
  ) THEN
    ALTER TABLE services ADD COLUMN selected_services jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;
