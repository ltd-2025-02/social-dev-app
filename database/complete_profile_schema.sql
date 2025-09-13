-- Complete Profile System Database Schema
-- Creates all necessary tables starting from base user_profiles

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela base de perfis de usuário
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL,
    phone VARCHAR(50),
    occupation VARCHAR(200),
    company VARCHAR(200),
    location VARCHAR(200),
    bio TEXT,
    website VARCHAR(500),
    persona_id VARCHAR(100),
    avatar TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    resume_url TEXT,
    timezone VARCHAR(100),
    availability VARCHAR(50),
    hourly_rate DECIMAL(10,2),
    years_of_experience INTEGER DEFAULT 0,
    open_to_work BOOLEAN DEFAULT FALSE,
    preferred_work_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Redes Sociais do usuário
CREATE TABLE IF NOT EXISTS user_social_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    url TEXT NOT NULL,
    icon VARCHAR(50) DEFAULT 'link-outline',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(user_id, platform)
);

-- Experiência Profissional
CREATE TABLE IF NOT EXISTS user_experiences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    position VARCHAR(200) NOT NULL,
    company VARCHAR(200) NOT NULL,
    location VARCHAR(200),
    start_date DATE NOT NULL,
    end_date DATE,
    current BOOLEAN DEFAULT FALSE,
    description TEXT,
    achievements TEXT[],
    skills_used VARCHAR(100)[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Formação Acadêmica
CREATE TABLE IF NOT EXISTS user_education (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    degree VARCHAR(200) NOT NULL,
    field VARCHAR(200) NOT NULL,
    institution VARCHAR(200) NOT NULL,
    location VARCHAR(200),
    start_date DATE NOT NULL,
    end_date DATE,
    current BOOLEAN DEFAULT FALSE,
    gpa VARCHAR(10),
    honors VARCHAR(200),
    relevant_courses TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Projetos
CREATE TABLE IF NOT EXISTS user_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    technologies VARCHAR(100)[] NOT NULL DEFAULT '{}',
    start_date DATE NOT NULL,
    end_date DATE,
    url TEXT,
    repository TEXT,
    image_url TEXT,
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Habilidades e Competências
CREATE TABLE IF NOT EXISTS user_skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    level VARCHAR(20) NOT NULL CHECK (level IN ('Iniciante', 'Intermediário', 'Avançado', 'Expert')),
    category VARCHAR(50) DEFAULT 'Geral',
    years_of_experience INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(user_id, name)
);

-- Idiomas
CREATE TABLE IF NOT EXISTS user_languages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    language VARCHAR(100) NOT NULL,
    proficiency VARCHAR(20) NOT NULL CHECK (proficiency IN ('Básico', 'Intermediário', 'Avançado', 'Nativo')),
    certified BOOLEAN DEFAULT FALSE,
    certificate_name VARCHAR(200),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(user_id, language)
);

-- Certificações
CREATE TABLE IF NOT EXISTS user_certificates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    issuer VARCHAR(200) NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    credential_id VARCHAR(200),
    url TEXT,
    image_url TEXT,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Cursos
CREATE TABLE IF NOT EXISTS user_courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    provider VARCHAR(200) NOT NULL,
    completion_date DATE NOT NULL,
    duration VARCHAR(50),
    certificate TEXT,
    grade VARCHAR(10),
    description TEXT,
    url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Licenças Profissionais
CREATE TABLE IF NOT EXISTS user_licenses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    issuing_organization VARCHAR(200) NOT NULL,
    license_number VARCHAR(100),
    issue_date DATE NOT NULL,
    expiry_date DATE,
    url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Serviços Oferecidos
CREATE TABLE IF NOT EXISTS user_services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    price_min DECIMAL(10,2),
    price_max DECIMAL(10,2),
    price_type VARCHAR(20) DEFAULT 'fixed' CHECK (price_type IN ('fixed', 'hourly', 'project', 'negotiable')),
    duration VARCHAR(100),
    delivery_time VARCHAR(100),
    available BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Recomendações
CREATE TABLE IF NOT EXISTS user_recommendations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    recommender_name VARCHAR(200) NOT NULL,
    recommender_title VARCHAR(200),
    recommender_company VARCHAR(200),
    recommender_email VARCHAR(200),
    recommendation TEXT NOT NULL,
    relationship VARCHAR(100) NOT NULL,
    date_given DATE DEFAULT CURRENT_DATE,
    verified BOOLEAN DEFAULT FALSE,
    public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Publicações
CREATE TABLE IF NOT EXISTS user_publications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(300) NOT NULL,
    publication_name VARCHAR(200),
    publication_date DATE NOT NULL,
    url TEXT,
    description TEXT,
    authors TEXT[],
    type VARCHAR(50) DEFAULT 'article' CHECK (type IN ('article', 'book', 'chapter', 'conference', 'patent', 'report', 'thesis')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Conquistas e Premiações
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    organization VARCHAR(200),
    date_received DATE NOT NULL,
    description TEXT,
    url TEXT,
    image_url TEXT,
    type VARCHAR(50) DEFAULT 'award' CHECK (type IN ('award', 'recognition', 'competition', 'scholarship', 'grant')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Atividades Voluntárias
CREATE TABLE IF NOT EXISTS user_volunteer_work (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    organization VARCHAR(200) NOT NULL,
    role VARCHAR(200) NOT NULL,
    cause VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE,
    current BOOLEAN DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes para performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_experiences_user_id ON user_experiences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_education_user_id ON user_education(user_id);
CREATE INDEX IF NOT EXISTS idx_user_projects_user_id ON user_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_category ON user_skills(category);
CREATE INDEX IF NOT EXISTS idx_user_languages_user_id ON user_languages(user_id);
CREATE INDEX IF NOT EXISTS idx_user_certificates_user_id ON user_certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_user_courses_user_id ON user_courses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_social_links_user_id ON user_social_links(user_id);
CREATE INDEX IF NOT EXISTS idx_user_services_user_id ON user_services(user_id);
CREATE INDEX IF NOT EXISTS idx_user_services_category ON user_services(category);
CREATE INDEX IF NOT EXISTS idx_user_recommendations_user_id ON user_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_publications_user_id ON user_publications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);

-- Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_volunteer_work ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para permitir que usuários vejam e editem apenas seus próprios dados
DO $$ 
BEGIN
    -- User Profiles
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Users can manage own profiles') THEN
        CREATE POLICY "Users can manage own profiles" ON user_profiles FOR ALL USING (auth.uid() = user_id);
    END IF;
    
    -- Public can view public profiles
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Public can view profiles') THEN
        CREATE POLICY "Public can view profiles" ON user_profiles FOR SELECT USING (true);
    END IF;

    -- Social Links
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_social_links' AND policyname = 'Users can view own social links') THEN
        CREATE POLICY "Users can view own social links" ON user_social_links FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_social_links' AND policyname = 'Users can insert own social links') THEN
        CREATE POLICY "Users can insert own social links" ON user_social_links FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_social_links' AND policyname = 'Users can update own social links') THEN
        CREATE POLICY "Users can update own social links" ON user_social_links FOR UPDATE USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_social_links' AND policyname = 'Users can delete own social links') THEN
        CREATE POLICY "Users can delete own social links" ON user_social_links FOR DELETE USING (auth.uid() = user_id);
    END IF;

    -- Experiences
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_experiences' AND policyname = 'Users can manage own experiences') THEN
        CREATE POLICY "Users can manage own experiences" ON user_experiences FOR ALL USING (auth.uid() = user_id);
    END IF;

    -- Education
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_education' AND policyname = 'Users can manage own education') THEN
        CREATE POLICY "Users can manage own education" ON user_education FOR ALL USING (auth.uid() = user_id);
    END IF;

    -- Projects
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_projects' AND policyname = 'Users can manage own projects') THEN
        CREATE POLICY "Users can manage own projects" ON user_projects FOR ALL USING (auth.uid() = user_id);
    END IF;

    -- Skills
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_skills' AND policyname = 'Users can manage own skills') THEN
        CREATE POLICY "Users can manage own skills" ON user_skills FOR ALL USING (auth.uid() = user_id);
    END IF;

    -- Languages
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_languages' AND policyname = 'Users can manage own languages') THEN
        CREATE POLICY "Users can manage own languages" ON user_languages FOR ALL USING (auth.uid() = user_id);
    END IF;

    -- Certificates
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_certificates' AND policyname = 'Users can manage own certificates') THEN
        CREATE POLICY "Users can manage own certificates" ON user_certificates FOR ALL USING (auth.uid() = user_id);
    END IF;

    -- Courses
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_courses' AND policyname = 'Users can manage own courses') THEN
        CREATE POLICY "Users can manage own courses" ON user_courses FOR ALL USING (auth.uid() = user_id);
    END IF;

    -- Licenses
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_licenses' AND policyname = 'Users can manage own licenses') THEN
        CREATE POLICY "Users can manage own licenses" ON user_licenses FOR ALL USING (auth.uid() = user_id);
    END IF;

    -- Services
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_services' AND policyname = 'Users can manage own services') THEN
        CREATE POLICY "Users can manage own services" ON user_services FOR ALL USING (auth.uid() = user_id);
    END IF;
    
    -- Public can view available services
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_services' AND policyname = 'Public can view available services') THEN
        CREATE POLICY "Public can view available services" ON user_services FOR SELECT USING (available = true);
    END IF;

    -- Recommendations
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_recommendations' AND policyname = 'Users can manage own recommendations') THEN
        CREATE POLICY "Users can manage own recommendations" ON user_recommendations FOR ALL USING (auth.uid() = user_id);
    END IF;
    
    -- Public can view public recommendations
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_recommendations' AND policyname = 'Public can view public recommendations') THEN
        CREATE POLICY "Public can view public recommendations" ON user_recommendations FOR SELECT USING (public = true);
    END IF;

    -- Publications
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_publications' AND policyname = 'Users can manage own publications') THEN
        CREATE POLICY "Users can manage own publications" ON user_publications FOR ALL USING (auth.uid() = user_id);
    END IF;
    
    -- Public can view publications
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_publications' AND policyname = 'Public can view publications') THEN
        CREATE POLICY "Public can view publications" ON user_publications FOR SELECT USING (true);
    END IF;

    -- Achievements
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_achievements' AND policyname = 'Users can manage own achievements') THEN
        CREATE POLICY "Users can manage own achievements" ON user_achievements FOR ALL USING (auth.uid() = user_id);
    END IF;
    
    -- Public can view achievements
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_achievements' AND policyname = 'Public can view achievements') THEN
        CREATE POLICY "Public can view achievements" ON user_achievements FOR SELECT USING (true);
    END IF;

    -- Volunteer Work
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_volunteer_work' AND policyname = 'Users can manage own volunteer work') THEN
        CREATE POLICY "Users can manage own volunteer work" ON user_volunteer_work FOR ALL USING (auth.uid() = user_id);
    END IF;

END $$;

-- Função para atualizar timestamp automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at automaticamente
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_social_links_updated_at BEFORE UPDATE ON user_social_links FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_experiences_updated_at BEFORE UPDATE ON user_experiences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_education_updated_at BEFORE UPDATE ON user_education FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_projects_updated_at BEFORE UPDATE ON user_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_skills_updated_at BEFORE UPDATE ON user_skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_languages_updated_at BEFORE UPDATE ON user_languages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_certificates_updated_at BEFORE UPDATE ON user_certificates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_courses_updated_at BEFORE UPDATE ON user_courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_licenses_updated_at BEFORE UPDATE ON user_licenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_services_updated_at BEFORE UPDATE ON user_services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_recommendations_updated_at BEFORE UPDATE ON user_recommendations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_publications_updated_at BEFORE UPDATE ON user_publications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_achievements_updated_at BEFORE UPDATE ON user_achievements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_volunteer_work_updated_at BEFORE UPDATE ON user_volunteer_work FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Views para facilitar consultas
CREATE OR REPLACE VIEW user_profile_summary AS
SELECT 
    up.user_id,
    up.name,
    up.occupation,
    up.company,
    up.location,
    up.bio,
    up.avatar,
    up.persona_id,
    (SELECT COUNT(*) FROM user_experiences WHERE user_id = up.user_id) as experience_count,
    (SELECT COUNT(*) FROM user_education WHERE user_id = up.user_id) as education_count,
    (SELECT COUNT(*) FROM user_projects WHERE user_id = up.user_id) as project_count,
    (SELECT COUNT(*) FROM user_skills WHERE user_id = up.user_id) as skill_count,
    (SELECT COUNT(*) FROM user_certificates WHERE user_id = up.user_id) as certificate_count,
    up.updated_at
FROM user_profiles up;

-- Create storage bucket for profile images (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('profiles', 'profiles', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for profile images
DO $$
BEGIN
    -- Allow users to upload their own profile images
    IF NOT EXISTS (SELECT 1 FROM storage.policies WHERE bucket_id = 'profiles' AND name = 'Users can upload own profile images') THEN
        EXECUTE 'CREATE POLICY "Users can upload own profile images" ON storage.objects 
                 FOR INSERT WITH CHECK (bucket_id = ''profiles'' AND auth.uid()::text = (storage.foldername(name))[1])';
    END IF;
    
    -- Allow users to update their own profile images
    IF NOT EXISTS (SELECT 1 FROM storage.policies WHERE bucket_id = 'profiles' AND name = 'Users can update own profile images') THEN
        EXECUTE 'CREATE POLICY "Users can update own profile images" ON storage.objects 
                 FOR UPDATE USING (bucket_id = ''profiles'' AND auth.uid()::text = (storage.foldername(name))[1])';
    END IF;
    
    -- Allow public access to view profile images
    IF NOT EXISTS (SELECT 1 FROM storage.policies WHERE bucket_id = 'profiles' AND name = 'Public can view profile images') THEN
        EXECUTE 'CREATE POLICY "Public can view profile images" ON storage.objects 
                 FOR SELECT USING (bucket_id = ''profiles'')';
    END IF;
END $$;