-- Insert demo credentials for each website
INSERT INTO public.credentials (website_id, type, host, username, password, port, notes) 
SELECT 
  w.id,
  'ftp',
  'ftp.' || CASE 
    WHEN w.name = 'E-commerce Store' THEN 'shop.example.com'
    WHEN w.name = 'Blog Platform' THEN 'blog.example.com'
    WHEN w.name = 'Portfolio Site' THEN 'portfolio.example.com'
    WHEN w.name = 'API Service' THEN 'api.example.com'
    WHEN w.name = 'Landing Page' THEN 'landing.example.com'
    WHEN w.name = 'Admin Dashboard' THEN 'admin.example.com'
    WHEN w.name = 'News Portal' THEN 'news.example.com'
    WHEN w.name = 'Community Forum' THEN 'forum.example.com'
  END,
  'admin_' || lower(replace(w.name, ' ', '_')),
  'SecurePass' || (floor(random() * 900 + 100))::text || '!',
  21,
  'FTP access for ' || w.name
FROM public.websites w;

-- Insert SMTP credentials for key websites
INSERT INTO public.credentials (website_id, type, host, username, password, port, notes) 
SELECT 
  w.id,
  'smtp',
  'smtp.gmail.com',
  'noreply@' || CASE 
    WHEN w.name = 'E-commerce Store' THEN 'shop.example.com'
    WHEN w.name = 'Blog Platform' THEN 'blog.example.com'
    WHEN w.name = 'News Portal' THEN 'news.example.com'
  END,
  'EmailPass' || (floor(random() * 900 + 100))::text || '!',
  587,
  'Email service for ' || w.name
FROM public.websites w 
WHERE w.name IN ('E-commerce Store', 'Blog Platform', 'News Portal');

-- Insert database credentials
INSERT INTO public.credentials (website_id, type, host, username, password, port, notes)
SELECT 
  w.id,
  'database',
  'db.' || CASE 
    WHEN w.name = 'E-commerce Store' THEN 'shop.example.com'
    WHEN w.name = 'Blog Platform' THEN 'blog.example.com'
    WHEN w.name = 'API Service' THEN 'api.example.com'
    WHEN w.name = 'Community Forum' THEN 'forum.example.com'
  END,
  'db_' || lower(replace(w.name, ' ', '_')),
  'DBPass' || (floor(random() * 900 + 100))::text || '!',
  CASE 
    WHEN w.name IN ('E-commerce Store', 'Blog Platform') THEN 3306
    ELSE 5432
  END,
  'Database for ' || w.name
FROM public.websites w 
WHERE w.name IN ('E-commerce Store', 'Blog Platform', 'API Service', 'Community Forum');