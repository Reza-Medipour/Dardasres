/*
  # Update services table to include 'cancelled' status

  1. Changes
    - Update status CHECK constraint to include 'cancelled' value
    - This allows users to cancel processing jobs

  2. Security
    - No RLS changes needed (existing policies still apply)
*/

-- Drop the old constraint
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'services_status_check'
    AND conrelid = 'services'::regclass
  ) THEN
    ALTER TABLE services DROP CONSTRAINT services_status_check;
  END IF;
END $$;

-- Add the new constraint with 'cancelled' status
ALTER TABLE services 
ADD CONSTRAINT services_status_check 
CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled'));
