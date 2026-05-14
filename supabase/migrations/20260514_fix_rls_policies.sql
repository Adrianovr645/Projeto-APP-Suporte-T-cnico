-- Remove a política antiga restritiva (que só permitia o criador ou responsável editar)
DROP POLICY IF EXISTS "Assigned users or creators can update tickets" ON public.tickets;

-- Cria uma nova política permitindo que qualquer usuário logado no sistema (Técnico/Admin) possa atualizar os chamados
CREATE POLICY "Authenticated users can update tickets" 
ON public.tickets 
FOR UPDATE 
USING (auth.role() = 'authenticated');
