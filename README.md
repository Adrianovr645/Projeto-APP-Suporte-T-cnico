# Dashboard de Suporte Técnico

Um dashboard moderno e funcional para equipes de suporte técnico, desenvolvido com Vite, Vanilla CSS e Supabase.

## 🚀 Funcionalidades

- **Painel Geral:** Visão em tempo real do status dos chamados.
- **Gerenciamento de Chamados:** Criação, visualização de detalhes e alteração de status (Pendente, Em Atendimento, Pausado, Resolvido).
- **Inventário:** Listagem de ativos técnicos.
- **Real-time:** Atualizações instantâneas via Supabase Realtime.
- **Responsividade:** Layout otimizado para desktop e mobile.

## 🛠️ Tecnologias

- [Vite](https://vitejs.dev/) - Frontend Tooling
- [Supabase](https://supabase.com/) - Backend as a Service (Database & Realtime)
- [Vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) - Estilização modular e moderna

## 📦 Instalação e Uso

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/Adrianovr645/Projeto-APP-Suporte-T-cnico.git
   cd Projeto-APP-Suporte-T-cnico
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   - Renomeie o arquivo `.env.example` para `.env`.
   - Preencha com as suas credenciais do Supabase.

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

## 🔒 Segurança

As credenciais do banco de dados são gerenciadas via variáveis de ambiente (`.env`) e o acesso ao banco é protegido por **Row Level Security (RLS)** no Supabase.

---
Desenvolvido por [Adriano](https://github.com/Adrianovr645)
