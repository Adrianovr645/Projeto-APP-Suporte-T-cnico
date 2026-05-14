-- Migration para adicionar as colunas observacoes e historico na tabela tickets
ALTER TABLE public.tickets 
ADD COLUMN IF NOT EXISTS observacoes text,
ADD COLUMN IF NOT EXISTS historico jsonb DEFAULT '[]'::jsonb;
