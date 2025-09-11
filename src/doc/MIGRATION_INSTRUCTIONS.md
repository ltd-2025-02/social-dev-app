# Instruções para Executar a Migração

## Problema
O erro `Could not find the 'persona_id' column of 'users' in the schema cache` indica que a coluna `persona_id` não existe na tabela `users` do banco de dados.

## Solução
Execute o SQL abaixo no painel do Supabase:

### 1. Acesse o painel do Supabase
- Vá para: https://supabase.com/dashboard
- Faça login e acesse seu projeto
- Vá para "SQL Editor" na barra lateral

### 2. Execute o seguinte SQL:

```sql
-- Adicionar campo persona_id à tabela users
-- Esse campo irá armazenar o ID da persona selecionada pelo usuário (a-z)

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS persona_id text;

-- Adicionar comentário para documentar o campo
COMMENT ON COLUMN public.users.persona_id IS 'ID da persona selecionada pelo usuário (a-z)';

-- Verificar se a coluna foi adicionada
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'persona_id';
```

### 3. Verificação
Após executar o SQL, você deve ver uma linha retornada com:
- column_name: persona_id
- data_type: text
- is_nullable: YES

## Após a migração
Reinicie o aplicativo para que as mudanças sejam refletidas no cache do Supabase.

## Alternativa: Script de migração
Se preferir, você pode usar o script criado em `scripts/run-migration.js`, mas precisará da service key do Supabase com permissões de administrador.