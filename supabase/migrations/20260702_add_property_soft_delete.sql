ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_properties_is_deleted ON properties (is_deleted);
