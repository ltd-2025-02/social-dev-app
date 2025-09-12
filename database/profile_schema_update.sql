-- ===============================================
-- SCHEMA ATUALIZAÇÃO PARA PERFIL COMPLETO
-- ===============================================
-- Este arquivo contém as tabelas necessárias para implementar 
-- todas as funcionalidades solicitadas do perfil estilo LinkedIn

-- 1. ATUALIZAR TABELA USERS (adicionar novos campos)
-- ===============================================
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS persona_id text,
ADD COLUMN IF NOT EXISTS resume_url text,
ADD COLUMN IF NOT EXISTS github_url text,
ADD COLUMN IF NOT EXISTS linkedin_url text,
ADD COLUMN IF NOT EXISTS indeed_url text,
ADD COLUMN IF NOT EXISTS twitter_url text,
ADD COLUMN IF NOT EXISTS instagram_url text,
ADD COLUMN IF NOT EXISTS facebook_url text,
ADD COLUMN IF NOT EXISTS youtube_url text,
ADD COLUMN IF NOT EXISTS portfolio_url text,
ADD COLUMN IF NOT EXISTS description text; -- Descrição principal do perfil igual ao LinkedIn

-- 2. TABELA DE EXPERIÊNCIAS PROFISSIONAIS
-- ===============================================
CREATE TABLE IF NOT EXISTS public.profile_experiences (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  position text NOT NULL,
  company text NOT NULL,
  employment_type text DEFAULT 'full_time' CHECK (employment_type IN ('full_time', 'part_time', 'contract', 'freelance', 'internship', 'volunteer')),
  location text,
  start_date date NOT NULL,
  end_date date,
  is_current boolean DEFAULT false,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profile_experiences_pkey PRIMARY KEY (id),
  CONSTRAINT profile_experiences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- 3. TABELA DE EDUCAÇÃO
-- ===============================================
CREATE TABLE IF NOT EXISTS public.profile_education (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  institution text NOT NULL,
  degree text NOT NULL,
  field_of_study text,
  start_date date NOT NULL,
  end_date date,
  is_current boolean DEFAULT false,
  grade text,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profile_education_pkey PRIMARY KEY (id),
  CONSTRAINT profile_education_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- 4. TABELA DE PROJETOS
-- ===============================================
CREATE TABLE IF NOT EXISTS public.profile_projects (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  start_date date NOT NULL,
  end_date date,
  is_current boolean DEFAULT false,
  project_url text,
  github_url text,
  demo_url text,
  image_url text,
  technologies text[], -- Array de tecnologias usadas
  associated_with text, -- Empresa/organização associada
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profile_projects_pkey PRIMARY KEY (id),
  CONSTRAINT profile_projects_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- 5. TABELA DE LICENÇAS E CERTIFICADOS
-- ===============================================
CREATE TABLE IF NOT EXISTS public.profile_certifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  issuing_organization text NOT NULL,
  issue_date date NOT NULL,
  expiration_date date,
  credential_id text,
  credential_url text,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profile_certifications_pkey PRIMARY KEY (id),
  CONSTRAINT profile_certifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- 6. TABELA DE CURSOS
-- ===============================================
CREATE TABLE IF NOT EXISTS public.profile_courses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  institution text NOT NULL,
  completion_date date,
  certificate_url text,
  duration_hours integer,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profile_courses_pkey PRIMARY KEY (id),
  CONSTRAINT profile_courses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- 7. TABELA DE IDIOMAS
-- ===============================================
CREATE TABLE IF NOT EXISTS public.profile_languages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  language text NOT NULL,
  proficiency text DEFAULT 'intermediate' CHECK (proficiency IN ('elementary', 'limited_working', 'professional_working', 'full_professional', 'native')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profile_languages_pkey PRIMARY KEY (id),
  CONSTRAINT profile_languages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- 8. TABELA DE ORGANIZAÇÕES
-- ===============================================
CREATE TABLE IF NOT EXISTS public.profile_organizations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  position text,
  start_date date,
  end_date date,
  is_current boolean DEFAULT false,
  description text,
  organization_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profile_organizations_pkey PRIMARY KEY (id),
  CONSTRAINT profile_organizations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- 9. TABELA DE SERVIÇOS OFERECIDOS
-- ===============================================
CREATE TABLE IF NOT EXISTS public.profile_services (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  price decimal(10,2),
  currency text DEFAULT 'BRL',
  duration_hours integer,
  category text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profile_services_pkey PRIMARY KEY (id),
  CONSTRAINT profile_services_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- 10. TABELA DE INTERESSES (Pessoas famosas, Tecnologias, Empresas, Governos)
-- ===============================================
CREATE TABLE IF NOT EXISTS public.profile_interests (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('person', 'technology', 'company', 'government', 'topic', 'other')),
  description text,
  url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profile_interests_pkey PRIMARY KEY (id),
  CONSTRAINT profile_interests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- 11. TABELA DE RECOMENDAÇÕES (RECEBIDAS)
-- ===============================================
CREATE TABLE IF NOT EXISTS public.profile_recommendations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  recommended_user_id uuid NOT NULL, -- Pessoa que recebe a recomendação
  recommender_user_id uuid NOT NULL, -- Pessoa que fez a recomendação
  relationship text, -- Ex: "Colega de trabalho", "Chefe", etc.
  recommendation_text text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profile_recommendations_pkey PRIMARY KEY (id),
  CONSTRAINT profile_recommendations_recommended_user_fkey FOREIGN KEY (recommended_user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT profile_recommendations_recommender_user_fkey FOREIGN KEY (recommender_user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT profile_recommendations_unique UNIQUE (recommended_user_id, recommender_user_id)
);

-- 12. TABELA DE COMPETÊNCIAS/HABILIDADES (Expandir a existente)
-- ===============================================
-- A tabela profile_skills já existe, mas vamos adicionar campos para os ícones
ALTER TABLE public.profile_skills 
ADD COLUMN IF NOT EXISTS icon_name text, -- Nome do ícone da tecnologia
ADD COLUMN IF NOT EXISTS color text,     -- Cor personalizada para a skill
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false; -- Destacar skill no perfil

-- 13. ÍNDICES PARA PERFORMANCE
-- ===============================================
CREATE INDEX IF NOT EXISTS idx_profile_experiences_user_id ON public.profile_experiences(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_education_user_id ON public.profile_education(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_projects_user_id ON public.profile_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_certifications_user_id ON public.profile_certifications(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_courses_user_id ON public.profile_courses(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_languages_user_id ON public.profile_languages(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_organizations_user_id ON public.profile_organizations(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_services_user_id ON public.profile_services(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_interests_user_id ON public.profile_interests(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_recommendations_recommended ON public.profile_recommendations(recommended_user_id);
CREATE INDEX IF NOT EXISTS idx_profile_recommendations_recommender ON public.profile_recommendations(recommender_user_id);

-- 14. POLÍTICAS RLS (Row Level Security)
-- ===============================================
-- Habilitar RLS para todas as tabelas de perfil
ALTER TABLE public.profile_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_recommendations ENABLE ROW LEVEL SECURITY;

-- Políticas para permitir que usuários vejam e editem apenas seus próprios dados
-- Experiências
CREATE POLICY "Users can view own experiences" ON public.profile_experiences
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own experiences" ON public.profile_experiences
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own experiences" ON public.profile_experiences
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own experiences" ON public.profile_experiences
  FOR DELETE USING (auth.uid() = user_id);

-- Educação (mesmo padrão para todas as outras tabelas)
CREATE POLICY "Users can view own education" ON public.profile_education
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own education" ON public.profile_education
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own education" ON public.profile_education
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own education" ON public.profile_education
  FOR DELETE USING (auth.uid() = user_id);

-- Projetos
CREATE POLICY "Users can view own projects" ON public.profile_projects
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own projects" ON public.profile_projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON public.profile_projects
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON public.profile_projects
  FOR DELETE USING (auth.uid() = user_id);

-- Certificações
CREATE POLICY "Users can view own certifications" ON public.profile_certifications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own certifications" ON public.profile_certifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own certifications" ON public.profile_certifications
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own certifications" ON public.profile_certifications
  FOR DELETE USING (auth.uid() = user_id);

-- Cursos
CREATE POLICY "Users can view own courses" ON public.profile_courses
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own courses" ON public.profile_courses
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own courses" ON public.profile_courses
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own courses" ON public.profile_courses
  FOR DELETE USING (auth.uid() = user_id);

-- Idiomas
CREATE POLICY "Users can view own languages" ON public.profile_languages
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own languages" ON public.profile_languages
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own languages" ON public.profile_languages
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own languages" ON public.profile_languages
  FOR DELETE USING (auth.uid() = user_id);

-- Organizações
CREATE POLICY "Users can view own organizations" ON public.profile_organizations
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own organizations" ON public.profile_organizations
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own organizations" ON public.profile_organizations
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own organizations" ON public.profile_organizations
  FOR DELETE USING (auth.uid() = user_id);

-- Serviços
CREATE POLICY "Users can view own services" ON public.profile_services
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own services" ON public.profile_services
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own services" ON public.profile_services
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own services" ON public.profile_services
  FOR DELETE USING (auth.uid() = user_id);

-- Interesses
CREATE POLICY "Users can view own interests" ON public.profile_interests
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own interests" ON public.profile_interests
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own interests" ON public.profile_interests
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own interests" ON public.profile_interests
  FOR DELETE USING (auth.uid() = user_id);

-- Recomendações (política especial: usuário pode ver recomendações que recebeu)
CREATE POLICY "Users can view recommendations they received" ON public.profile_recommendations
  FOR SELECT USING (auth.uid() = recommended_user_id);
CREATE POLICY "Users can insert recommendations for others" ON public.profile_recommendations
  FOR INSERT WITH CHECK (auth.uid() = recommender_user_id);
CREATE POLICY "Users can update own recommendations" ON public.profile_recommendations
  FOR UPDATE USING (auth.uid() = recommender_user_id);
CREATE POLICY "Users can delete own recommendations" ON public.profile_recommendations
  FOR DELETE USING (auth.uid() = recommender_user_id);

-- 15. COMENTÁRIOS PARA DOCUMENTAÇÃO
-- ===============================================
COMMENT ON TABLE public.profile_experiences IS 'Experiências profissionais dos usuários';
COMMENT ON TABLE public.profile_education IS 'Formação educacional dos usuários';
COMMENT ON TABLE public.profile_projects IS 'Projetos desenvolvidos pelos usuários';
COMMENT ON TABLE public.profile_certifications IS 'Licenças e certificados dos usuários';
COMMENT ON TABLE public.profile_courses IS 'Cursos realizados pelos usuários';
COMMENT ON TABLE public.profile_languages IS 'Idiomas falados pelos usuários';
COMMENT ON TABLE public.profile_organizations IS 'Organizações que o usuário participa';
COMMENT ON TABLE public.profile_services IS 'Serviços oferecidos pelos usuários';
COMMENT ON TABLE public.profile_interests IS 'Interesses dos usuários (pessoas, tecnologias, empresas, etc)';
COMMENT ON TABLE public.profile_recommendations IS 'Recomendações entre usuários';