-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  full_name text,
  role text,
  avatar_url text,
  updated_at timestamp with time zone DEFAULT now()
);

-- Create tickets table
CREATE TABLE IF NOT EXISTS public.tickets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now(),
  title text NOT NULL,
  description text,
  status text DEFAULT 'Pendente',
  priority text DEFAULT 'Média',
  category text,
  created_by uuid REFERENCES public.profiles(id),
  assigned_to uuid REFERENCES public.profiles(id)
);

-- Create inventory table
CREATE TABLE IF NOT EXISTS public.inventory (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  status text,
  location text,
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE CONTROLLED ACCESS;
ALTER TABLE public.tickets ENABLE CONTROLLED ACCESS;
ALTER TABLE public.inventory ENABLE CONTROLLED ACCESS;

-- Basic Policies (Allow all for now to make it work easily)
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Tickets are viewable by everyone" ON public.tickets FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create tickets" ON public.tickets FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Assigned users or creators can update tickets" ON public.tickets FOR UPDATE USING (auth.uid() = created_by OR auth.uid() = assigned_to);

CREATE POLICY "Inventory viewable by everyone" ON public.inventory FOR SELECT USING (true);

-- Insert example data
-- Note: Profiles need a valid auth.user id, so I'll insert dummy data for now or skip until I have users.
-- Actually, for demo purposes, I'll insert tickets with NULL users.

INSERT INTO public.tickets (title, description, status, priority, category)
VALUES 
('Reparo de Ar Condicionado', 'Unidade condensadora do servidor principal apresentando falha.', 'Pendente', 'Crítica', 'Elétrica'),
('Falha de Conexão VPN', 'Usuários da filial norte não conseguem autenticar na VPN corporativa.', 'Em Atendimento', 'Alta', 'TI'),
('Câmera Externa Offline', 'Câmera de segurança do portão principal perdeu sinal.', 'Pendente', 'Média', 'Segurança');

INSERT INTO public.inventory (name, status, location)
VALUES
('Servidor Dell PowerEdge R740', 'Ativo', 'Data Center A'),
('Switch Cisco 2960', 'Ativo', 'Rack 02'),
('Nobreak APC 3000VA', 'Manutenção', 'Sala Técnica');
