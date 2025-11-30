/*
  # Add selected_outputs column to services table

  1. Changes
    - Add `selected_outputs` column to store output configuration
    - Stores the exact outputs object sent to the API
    - Example: {"summary": true, "headline": true, "transcript": false}

  2. Notes
    - Uses JSONB to store the outputs configuration
    - Allows flexible tracking of which outputs were requested
    - This mirrors the API request structure
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'selected_outputs'
  ) THEN
    ALTER TABLE services ADD COLUMN selected_outputs jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;
