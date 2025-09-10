-- Adicionar campo persona_id à tabela users
-- Esse campo irá armazenar o ID da persona selecionada pelo usuário (a-z)

ALTER TABLE public.users 
ADD COLUMN persona_id text;

-- Adicionar comentário para documentar o campo
COMMENT ON COLUMN public.users.persona_id IS 'ID da persona selecionada pelo usuário (a-z)';