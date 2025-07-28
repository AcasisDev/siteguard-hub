-- Insert demo domains with correct enum values
INSERT INTO public.domains (website_id, domain_name, registrar, register_date, expire_date, status, nameservers) 
SELECT 
  w.id,
  CASE 
    WHEN w.name = 'E-commerce Store' THEN 'shop.example.com'
    WHEN w.name = 'Blog Platform' THEN 'blog.example.com'
    WHEN w.name = 'Portfolio Site' THEN 'portfolio.example.com'
    WHEN w.name = 'API Service' THEN 'api.example.com'
    WHEN w.name = 'Landing Page' THEN 'landing.example.com'
    WHEN w.name = 'Admin Dashboard' THEN 'admin.example.com'
    WHEN w.name = 'News Portal' THEN 'news.example.com'
    WHEN w.name = 'Community Forum' THEN 'forum.example.com'
  END,
  CASE (floor(random() * 4 + 1))::int
    WHEN 1 THEN 'GoDaddy'
    WHEN 2 THEN 'Namecheap'
    WHEN 3 THEN 'Cloudflare'
    ELSE 'Google Domains'
  END,
  '2023-01-15'::date + (floor(random() * 300))::int,
  '2024-12-31'::date + (floor(random() * 365))::int,
  CASE (floor(random() * 3 + 1))::int
    WHEN 1 THEN 'active'
    WHEN 2 THEN 'expired'
    ELSE 'active'
  END::domain_status,
  '{ns1.example.com,ns2.example.com}'
FROM public.websites w;

-- Insert demo servers
INSERT INTO public.servers (website_id, provider, ip_address, status, ssh_username, ssh_password, notes)
SELECT 
  w.id,
  CASE (floor(random() * 5 + 1))::int
    WHEN 1 THEN 'AWS EC2'
    WHEN 2 THEN 'DigitalOcean'
    WHEN 3 THEN 'Google Cloud'
    WHEN 4 THEN 'Linode'
    ELSE 'Vultr'
  END,
  (floor(random() * 254) + 1)::text || '.' || 
  (floor(random() * 254) + 1)::text || '.' || 
  (floor(random() * 254) + 1)::text || '.' || 
  (floor(random() * 254) + 1)::text,
  CASE (floor(random() * 3 + 1))::int
    WHEN 1 THEN 'online'
    WHEN 2 THEN 'maintenance'
    ELSE 'online'
  END::server_status,
  CASE 
    WHEN w.name IN ('Portfolio Site', 'Landing Page') THEN NULL
    ELSE 'root'
  END,
  CASE 
    WHEN w.name IN ('Portfolio Site', 'Landing Page') THEN NULL
    ELSE 'ServerPass' || (floor(random() * 900 + 100))::text || '!'
  END,
  CASE 
    WHEN w.name IN ('Portfolio Site', 'Landing Page') THEN 'Static hosting'
    ELSE 'Production server for ' || w.name
  END
FROM public.websites w;