-- Add lat/lng columns to properties table for Leaflet map integration
ALTER TABLE properties ADD COLUMN IF NOT EXISTS lat NUMERIC;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS lng NUMERIC;

UPDATE properties SET lat = 34.0736, lng = -118.4004 WHERE slug = 'the-glass-pavilion';
UPDATE properties SET lat = 49.2827, lng = -123.1207 WHERE slug = 'azure-heights-penthouse';
UPDATE properties SET lat = 47.6097, lng = -122.3331 WHERE slug = 'modern-family-home';
UPDATE properties SET lat = 45.5152, lng = -122.6784 WHERE slug = 'urban-loft';
UPDATE properties SET lat = 44.0582, lng = -121.3153 WHERE slug = 'highland-retreat';
UPDATE properties SET lat = 25.7617, lng = -80.1918 WHERE slug = 'sea-view-penthouse';
UPDATE properties SET lat = 41.8819, lng = -87.6278 WHERE slug = 'central-studio';
UPDATE properties SET lat = 30.2672, lng = -97.7431 WHERE slug = 'garden-villa';
UPDATE properties SET lat = 39.0968, lng = -120.0324 WHERE slug = 'lakeside-manor';
UPDATE properties SET lat = 40.7411, lng = -73.9897 WHERE slug = 'skyline-tower-apartment';
UPDATE properties SET lat = 33.4942, lng = -111.9261 WHERE slug = 'desert-oasis-villa';
UPDATE properties SET lat = 37.7749, lng = -122.4194 WHERE slug = 'harbor-view-penthouse';
UPDATE properties SET lat = 35.5951, lng = -82.5515 WHERE slug = 'cozy-cottage';
UPDATE properties SET lat = 36.1627, lng = -86.7816 WHERE slug = 'riverside-loft';
UPDATE properties SET lat = 34.0259, lng = -118.7798 WHERE slug = 'mediterranean-estate';
UPDATE properties SET lat = 39.7392, lng = -104.9903 WHERE slug = 'downtown-micro-studio';
UPDATE properties SET lat = 32.7765, lng = -79.9311 WHERE slug = 'colonial-family-home';
UPDATE properties SET lat = 40.7681, lng = -73.9819 WHERE slug = 'luxury-sky-penthouse';
