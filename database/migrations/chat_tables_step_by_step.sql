-- ========================================
-- MIGRAÇÃO DO SISTEMA DE CHAT - PASSO A PASSO
-- Execute cada seção separadamente se houver erros
-- ========================================

-- PASSO 1: Criar tabela de conversas
-- ========================================
CREATE TABLE IF NOT EXISTS public.conversations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_by uuid REFERENCES public.users(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- PASSO 2: Criar tabela de participantes
-- ========================================
CREATE TABLE IF NOT EXISTS public.conversation_participants (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    joined_at timestamp with time zone DEFAULT now(),
    last_read_at timestamp with time zone DEFAULT now(),
    UNIQUE(conversation_id, user_id)
);

-- PASSO 3: Criar tabela de mensagens
-- ========================================
CREATE TABLE IF NOT EXISTS public.messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    content text NOT NULL,
    message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- PASSO 4: Criar índices (execute apenas se as tabelas foram criadas)
-- ========================================
CREATE INDEX IF NOT EXISTS idx_conversations_created_by ON public.conversations(created_by);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON public.conversations(updated_at);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_conversation_id ON public.conversation_participants(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_id ON public.conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);

-- PASSO 5: Criar função para trigger (apenas se não existir)
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- PASSO 6: Verificar se triggers existem e criar se necessário
-- ========================================
-- Para conversations
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_conversations_updated_at'
        AND tgrelid = 'public.conversations'::regclass
    ) THEN
        CREATE TRIGGER update_conversations_updated_at 
            BEFORE UPDATE ON public.conversations 
            FOR EACH ROW 
            EXECUTE PROCEDURE update_updated_at_column();
    END IF;
END $$;

-- Para messages
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_messages_updated_at'
        AND tgrelid = 'public.messages'::regclass
    ) THEN
        CREATE TRIGGER update_messages_updated_at 
            BEFORE UPDATE ON public.messages 
            FOR EACH ROW 
            EXECUTE PROCEDURE update_updated_at_column();
    END IF;
END $$;

-- PASSO 7: Verificação final
-- ========================================
-- Execute esta consulta para verificar se tudo foi criado corretamente
SELECT 
    'conversations' as table_name,
    COUNT(*) as count
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'conversations'

UNION ALL

SELECT 
    'conversation_participants' as table_name,
    COUNT(*) as count
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'conversation_participants'

UNION ALL

SELECT 
    'messages' as table_name,
    COUNT(*) as count
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'messages';

-- Se a consulta acima retornar 1 para cada tabela, a migração foi bem-sucedida!