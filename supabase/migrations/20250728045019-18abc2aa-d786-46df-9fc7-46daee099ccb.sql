-- Temporarily make user_id nullable to allow demo data
ALTER TABLE public.websites ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.credentials ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.domains ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.servers ALTER COLUMN user_id DROP NOT NULL;

-- Insert demo websites
INSERT INTO public.websites (name, domain, provider, server_ip, status, notes) VALUES
('E-commerce Store', 'shop.example.com', 'AWS', '54.123.456.789', 'active', 'Main online store with payment integration'),
('Blog Platform', 'blog.example.com', 'DigitalOcean', '159.89.123.456', 'active', 'Content management system for articles'),
('Portfolio Site', 'portfolio.example.com', 'Netlify', '104.198.14.52', 'active', 'Personal portfolio showcase'),
('API Service', 'api.example.com', 'Google Cloud', '35.203.129.88', 'maintenance', 'RESTful API for mobile app'),
('Landing Page', 'landing.example.com', 'Vercel', '76.76.19.61', 'active', 'Marketing landing page'),
('Admin Dashboard', 'admin.example.com', 'AWS', '52.91.45.123', 'inactive', 'Internal admin panel'),
('News Portal', 'news.example.com', 'Cloudflare', '172.67.182.55', 'active', 'Daily news and articles'),
('Community Forum', 'forum.example.com', 'Heroku', '52.5.171.23', 'active', 'User discussion platform');