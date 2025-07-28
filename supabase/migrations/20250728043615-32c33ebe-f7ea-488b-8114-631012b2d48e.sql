-- Create enum types for better data integrity
CREATE TYPE public.website_status AS ENUM ('active', 'inactive', 'maintenance');
CREATE TYPE public.credential_type AS ENUM ('ftp', 'smtp', 'cpanel', 'database', 'ssh', 'other');
CREATE TYPE public.domain_status AS ENUM ('active', 'expired', 'pending');
CREATE TYPE public.server_status AS ENUM ('online', 'offline', 'maintenance');
CREATE TYPE public.app_role AS ENUM ('admin', 'super_admin', 'editor');

-- Create user_roles table for role-based access control
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Create websites table
CREATE TABLE public.websites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    domain TEXT NOT NULL,
    provider TEXT NOT NULL,
    server_ip TEXT NOT NULL,
    notes TEXT,
    status website_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Create credentials table
CREATE TABLE public.credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    website_id UUID REFERENCES public.websites(id) ON DELETE CASCADE NOT NULL,
    type credential_type NOT NULL,
    host TEXT NOT NULL,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    port INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Create domains table
CREATE TABLE public.domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    website_id UUID REFERENCES public.websites(id) ON DELETE CASCADE NOT NULL,
    domain_name TEXT NOT NULL,
    registrar TEXT NOT NULL,
    register_date DATE NOT NULL,
    expire_date DATE NOT NULL,
    nameservers TEXT[] DEFAULT '{}',
    status domain_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Create servers table
CREATE TABLE public.servers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    website_id UUID REFERENCES public.websites(id) ON DELETE CASCADE NOT NULL,
    provider TEXT NOT NULL,
    ip_address TEXT NOT NULL,
    ssh_username TEXT,
    ssh_password TEXT,
    notes TEXT,
    status server_status NOT NULL DEFAULT 'online',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Enable Row Level Security on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servers ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create RLS policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
    FOR SELECT USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can insert roles" ON public.user_roles
    FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can update roles" ON public.user_roles
    FOR UPDATE USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can delete roles" ON public.user_roles
    FOR DELETE USING (public.has_role(auth.uid(), 'super_admin'));

-- Create RLS policies for websites
CREATE POLICY "Users can view their own websites" ON public.websites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all websites" ON public.websites
    FOR SELECT USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can create their own websites" ON public.websites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own websites" ON public.websites
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can update all websites" ON public.websites
    FOR UPDATE USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can delete their own websites" ON public.websites
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete all websites" ON public.websites
    FOR DELETE USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Create RLS policies for credentials
CREATE POLICY "Users can view their own credentials" ON public.credentials
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all credentials" ON public.credentials
    FOR SELECT USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can create their own credentials" ON public.credentials
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own credentials" ON public.credentials
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can update all credentials" ON public.credentials
    FOR UPDATE USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can delete their own credentials" ON public.credentials
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete all credentials" ON public.credentials
    FOR DELETE USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Create RLS policies for domains
CREATE POLICY "Users can view their own domains" ON public.domains
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all domains" ON public.domains
    FOR SELECT USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can create their own domains" ON public.domains
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own domains" ON public.domains
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can update all domains" ON public.domains
    FOR UPDATE USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can delete their own domains" ON public.domains
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete all domains" ON public.domains
    FOR DELETE USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Create RLS policies for servers
CREATE POLICY "Users can view their own servers" ON public.servers
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all servers" ON public.servers
    FOR SELECT USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can create their own servers" ON public.servers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own servers" ON public.servers
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can update all servers" ON public.servers
    FOR UPDATE USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can delete their own servers" ON public.servers
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete all servers" ON public.servers
    FOR DELETE USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Create function to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_websites_updated_at
    BEFORE UPDATE ON public.websites
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_credentials_updated_at
    BEFORE UPDATE ON public.credentials
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_domains_updated_at
    BEFORE UPDATE ON public.domains
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_servers_updated_at
    BEFORE UPDATE ON public.servers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();