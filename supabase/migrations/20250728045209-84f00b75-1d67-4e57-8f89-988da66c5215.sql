-- Get website IDs and insert related data
WITH website_ids AS (
  SELECT id, name FROM public.websites
)

-- Insert demo credentials
INSERT INTO public.credentials (website_id, type, host, username, password, port, notes) 
SELECT 
  w.id,
  'ftp',
  'ftp.' || lower(replace(w.name, ' ', '-')) || '.com',
  'admin_' || lower(replace(w.name, ' ', '_')),
  'SecurePass' || (floor(random() * 900 + 100))::text || '!',
  21,
  'FTP access for ' || w.name
FROM website_ids w;

-- Insert more credential types
INSERT INTO public.credentials (website_id, type, host, username, password, port, notes) 
SELECT 
  w.id,
  'smtp',
  'smtp.gmail.com',
  'noreply@' || lower(replace(w.name, ' ', '-')) || '.com',
  'EmailPass' || (floor(random() * 900 + 100))::text || '!',
  587,
  'Email service for ' || w.name
FROM website_ids w WHERE name IN ('E-commerce Store', 'Blog Platform', 'News Portal');

-- Insert database credentials  
INSERT INTO public.credentials (website_id, type, host, username, password, port, notes)
SELECT 
  w.id,
  'database',
  'db.' || lower(replace(w.name, ' ', '-')) || '.com',
  'db_' || lower(replace(w.name, ' ', '_')),
  'DBPass' || (floor(random() * 900 + 100))::text || '!',
  CASE 
    WHEN w.name IN ('E-commerce Store', 'Blog Platform') THEN 3306
    ELSE 5432
  END,
  'Database for ' || w.name
FROM website_ids w WHERE name IN ('E-commerce Store', 'Blog Platform', 'API Service', 'Community Forum');