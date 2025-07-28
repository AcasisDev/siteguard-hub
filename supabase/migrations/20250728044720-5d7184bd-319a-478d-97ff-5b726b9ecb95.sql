-- Insert demo websites
INSERT INTO public.websites (id, name, domain, provider, server_ip, status, user_id, notes) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'E-commerce Store', 'shop.example.com', 'AWS', '54.123.456.789', 'active', '550e8400-e29b-41d4-a716-446655440000', 'Main online store with payment integration'),
('550e8400-e29b-41d4-a716-446655440002', 'Blog Platform', 'blog.example.com', 'DigitalOcean', '159.89.123.456', 'active', '550e8400-e29b-41d4-a716-446655440000', 'Content management system for articles'),
('550e8400-e29b-41d4-a716-446655440003', 'Portfolio Site', 'portfolio.example.com', 'Netlify', '104.198.14.52', 'active', '550e8400-e29b-41d4-a716-446655440000', 'Personal portfolio showcase'),
('550e8400-e29b-41d4-a716-446655440004', 'API Service', 'api.example.com', 'Google Cloud', '35.203.129.88', 'maintenance', '550e8400-e29b-41d4-a716-446655440000', 'RESTful API for mobile app'),
('550e8400-e29b-41d4-a716-446655440005', 'Landing Page', 'landing.example.com', 'Vercel', '76.76.19.61', 'active', '550e8400-e29b-41d4-a716-446655440000', 'Marketing landing page'),
('550e8400-e29b-41d4-a716-446655440006', 'Admin Dashboard', 'admin.example.com', 'AWS', '52.91.45.123', 'inactive', '550e8400-e29b-41d4-a716-446655440000', 'Internal admin panel');

-- Insert demo credentials
INSERT INTO public.credentials (id, website_id, type, host, username, password, port, notes, user_id) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'ftp', 'ftp.shop.example.com', 'shop_admin', 'ShopFTP2024!', 21, 'Main FTP access for e-commerce', '550e8400-e29b-41d4-a716-446655440000'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'smtp', 'smtp.gmail.com', 'noreply@shop.example.com', 'EmailPass456!', 587, 'Email service for order confirmations', '550e8400-e29b-41d4-a716-446655440000'),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'database', 'db.shop.example.com', 'shop_db_user', 'DatabaseSecure789!', 3306, 'MySQL database credentials', '550e8400-e29b-41d4-a716-446655440000'),
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'ftp', 'ftp.blog.example.com', 'blog_admin', 'BlogFTP2024!', 21, 'Blog content upload access', '550e8400-e29b-41d4-a716-446655440000'),
('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'cpanel', 'cpanel.blog.example.com', 'blog_cpanel', 'CpanelBlog456!', NULL, 'Control panel for blog management', '550e8400-e29b-41d4-a716-446655440000'),
('660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440003', 'ssh', 'portfolio.example.com', 'portfolio_user', 'SSH_Portfolio789!', 22, 'SSH access for deployment', '550e8400-e29b-41d4-a716-446655440000'),
('660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440004', 'database', 'api-db.example.com', 'api_db_admin', 'APIDatabase2024!', 5432, 'PostgreSQL for API service', '550e8400-e29b-41d4-a716-446655440000'),
('660e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440005', 'ftp', 'ftp.landing.example.com', 'landing_ftp', 'LandingFTP123!', 21, 'Static file uploads', '550e8400-e29b-41d4-a716-446655440000');

-- Insert demo domains
INSERT INTO public.domains (id, website_id, domain_name, registrar, register_date, expire_date, status, nameservers, user_id, notes) VALUES
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'shop.example.com', 'GoDaddy', '2023-01-15', '2025-01-15', 'active', '{ns1.godaddy.com,ns2.godaddy.com}', '550e8400-e29b-41d4-a716-446655440000', 'Primary e-commerce domain'),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'blog.example.com', 'Namecheap', '2023-03-20', '2025-03-20', 'active', '{dns1.registrar-servers.com,dns2.registrar-servers.com}', '550e8400-e29b-41d4-a716-446655440000', 'Blog subdomain'),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'portfolio.example.com', 'Cloudflare', '2023-06-10', '2024-06-10', 'expiring', '{ns1.cloudflare.com,ns2.cloudflare.com}', '550e8400-e29b-41d4-a716-446655440000', 'Portfolio domain - needs renewal'),
('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'api.example.com', 'Google Domains', '2023-08-01', '2025-08-01', 'active', '{ns-cloud-d1.googledomains.com,ns-cloud-d2.googledomains.com}', '550e8400-e29b-41d4-a716-446655440000', 'API service domain'),
('770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 'landing.example.com', 'Hover', '2023-09-15', '2024-09-15', 'expiring', '{ns1.hover.com,ns2.hover.com}', '550e8400-e29b-41d4-a716-446655440000', 'Marketing landing page'),
('770e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440006', 'admin.example.com', 'AWS Route 53', '2023-02-28', '2025-02-28', 'suspended', '{ns-123.awsdns-12.com,ns-456.awsdns-34.net}', '550e8400-e29b-41d4-a716-446655440000', 'Admin panel - suspended for review');

-- Insert demo servers
INSERT INTO public.servers (id, website_id, provider, ip_address, status, ssh_username, ssh_password, notes, user_id) VALUES
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'AWS EC2', '54.123.456.789', 'online', 'ec2-user', 'AWS_SSH_Key_2024!', 'Production server for e-commerce store', '550e8400-e29b-41d4-a716-446655440000'),
('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'DigitalOcean Droplet', '159.89.123.456', 'online', 'root', 'DO_Root_Pass789!', 'Blog hosting server', '550e8400-e29b-41d4-a716-446655440000'),
('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Netlify CDN', '104.198.14.52', 'online', NULL, NULL, 'Static hosting for portfolio', '550e8400-e29b-41d4-a716-446655440000'),
('880e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'Google Cloud', '35.203.129.88', 'maintenance', 'gcloud-user', 'GCP_SSH_2024!', 'API service under maintenance', '550e8400-e29b-41d4-a716-446655440000'),
('880e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 'Vercel Edge', '76.76.19.61', 'online', NULL, NULL, 'Serverless hosting for landing page', '550e8400-e29b-41d4-a716-446655440000'),
('880e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440006', 'AWS EC2', '52.91.45.123', 'offline', 'admin-user', 'AdminEC2_Pass456!', 'Admin dashboard server - currently offline', '550e8400-e29b-41d4-a716-446655440000');

-- Insert demo user roles (assuming a default user)
INSERT INTO public.user_roles (id, user_id, role) VALUES
('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'admin');