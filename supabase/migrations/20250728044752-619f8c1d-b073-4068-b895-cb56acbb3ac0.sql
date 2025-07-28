-- Insert demo websites (without user_id for now)
INSERT INTO public.websites (name, domain, provider, server_ip, status, notes, user_id) VALUES
('E-commerce Store', 'shop.example.com', 'AWS', '54.123.456.789', 'active', 'Main online store with payment integration', '00000000-0000-0000-0000-000000000000'),
('Blog Platform', 'blog.example.com', 'DigitalOcean', '159.89.123.456', 'active', 'Content management system for articles', '00000000-0000-0000-0000-000000000000'),
('Portfolio Site', 'portfolio.example.com', 'Netlify', '104.198.14.52', 'active', 'Personal portfolio showcase', '00000000-0000-0000-0000-000000000000'),
('API Service', 'api.example.com', 'Google Cloud', '35.203.129.88', 'maintenance', 'RESTful API for mobile app', '00000000-0000-0000-0000-000000000000'),
('Landing Page', 'landing.example.com', 'Vercel', '76.76.19.61', 'active', 'Marketing landing page', '00000000-0000-0000-0000-000000000000'),
('Admin Dashboard', 'admin.example.com', 'AWS', '52.91.45.123', 'inactive', 'Internal admin panel', '00000000-0000-0000-0000-000000000000'),
('News Portal', 'news.example.com', 'Cloudflare', '172.67.182.55', 'active', 'Daily news and articles', '00000000-0000-0000-0000-000000000000'),
('Community Forum', 'forum.example.com', 'Heroku', '52.5.171.23', 'active', 'User discussion platform', '00000000-0000-0000-0000-000000000000');