-- Add slug and images array to properties table
ALTER TABLE properties ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

ALTER TABLE properties ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Populate slugs from titles for existing rows (run once)
UPDATE properties
SET slug = lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL;
