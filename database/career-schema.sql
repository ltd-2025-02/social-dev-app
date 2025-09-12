-- =====================================================
-- CAREER TRACKING SYSTEM DATABASE SCHEMA
-- Comprehensive schema for advanced career development
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- SKILLS AND COMPETENCIES
-- =====================================================

CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')),
  importance INTEGER CHECK (importance >= 1 AND importance <= 5),
  market_demand INTEGER CHECK (market_demand >= 1 AND market_demand <= 5),
  average_salary_impact DECIMAL(5,2),
  related_skills JSONB DEFAULT '[]',
  tags JSONB DEFAULT '[]',
  icon VARCHAR(50),
  color VARCHAR(7),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- LEARNING RESOURCES
-- =====================================================

CREATE TABLE learning_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  type VARCHAR(20) CHECK (type IN ('course', 'book', 'tutorial', 'project', 'certification', 'bootcamp')),
  url VARCHAR(500),
  provider VARCHAR(100),
  duration INTEGER, -- in hours
  price DECIMAL(10,2),
  rating DECIMAL(3,2),
  difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  is_premium BOOLEAN DEFAULT FALSE,
  skills JSONB DEFAULT '[]',
  description TEXT,
  thumbnail_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CERTIFICATIONS
-- =====================================================

CREATE TABLE certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  provider VARCHAR(100) NOT NULL,
  description TEXT,
  validity_period INTEGER, -- in months
  cost DECIMAL(10,2),
  difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  market_value INTEGER CHECK (market_value >= 1 AND market_value <= 5),
  prerequisites JSONB DEFAULT '[]',
  skills JSONB DEFAULT '[]',
  exam_format VARCHAR(50),
  pass_rate DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CAREER PATHS
-- =====================================================

CREATE TABLE career_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50) CHECK (category IN ('development', 'design', 'data', 'devops', 'management', 'product')),
  experience_level VARCHAR(20) CHECK (experience_level IN ('entry', 'junior', 'mid', 'senior', 'lead', 'principal')),
  average_salary_min DECIMAL(12,2),
  average_salary_max DECIMAL(12,2),
  salary_currency VARCHAR(3) DEFAULT 'BRL',
  salary_location VARCHAR(100),
  market_demand INTEGER CHECK (market_demand >= 1 AND market_demand <= 5),
  growth_projection DECIMAL(5,2),
  job_titles JSONB DEFAULT '[]',
  companies JSONB DEFAULT '[]',
  work_style VARCHAR(20) CHECK (work_style IN ('remote', 'hybrid', 'onsite', 'flexible')),
  icon VARCHAR(50),
  color JSONB DEFAULT '[]',
  tags JSONB DEFAULT '[]',
  is_trending BOOLEAN DEFAULT FALSE,
  difficulty_rating INTEGER CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
  time_to_proficiency INTEGER, -- in months
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SKILL REQUIREMENTS FOR CAREER PATHS
-- =====================================================

CREATE TABLE career_skill_requirements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  career_path_id UUID REFERENCES career_paths(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  level VARCHAR(20) CHECK (level IN ('basic', 'intermediate', 'advanced', 'expert')),
  importance INTEGER CHECK (importance >= 1 AND importance <= 5),
  time_to_learn INTEGER, -- in months
  is_optional BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(career_path_id, skill_id)
);

-- =====================================================
-- CAREER MILESTONES
-- =====================================================

CREATE TABLE career_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  career_path_id UUID REFERENCES career_paths(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  estimated_time INTEGER, -- in months
  required_skills JSONB DEFAULT '[]',
  outcomes JSONB DEFAULT '[]',
  resources JSONB DEFAULT '[]',
  salary_range_min DECIMAL(12,2),
  salary_range_max DECIMAL(12,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PROJECT SUGGESTIONS
-- =====================================================

CREATE TABLE project_suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  milestone_id UUID REFERENCES career_milestones(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  estimated_time INTEGER, -- in hours
  technologies JSONB DEFAULT '[]',
  skills JSONB DEFAULT '[]',
  github_url VARCHAR(500),
  live_url VARCHAR(500),
  tutorial_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- USER CAREER PROFILES
-- =====================================================

CREATE TABLE user_career_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  current_path_id UUID REFERENCES career_paths(id),
  target_path_id UUID REFERENCES career_paths(id),
  experience_level VARCHAR(20) CHECK (experience_level IN ('entry', 'junior', 'mid', 'senior', 'lead')),
  years_of_experience INTEGER DEFAULT 0,
  current_role VARCHAR(100),
  completed_milestones JSONB DEFAULT '[]',
  location VARCHAR(100),
  remote_preference VARCHAR(20) CHECK (remote_preference IN ('full-remote', 'hybrid', 'office', 'no-preference')),
  company_size_preference VARCHAR(20) CHECK (company_size_preference IN ('startup', 'medium', 'enterprise', 'no-preference')),
  industry_preferences JSONB DEFAULT '[]',
  salary_expectation_min DECIMAL(12,2),
  salary_expectation_max DECIMAL(12,2),
  benefits_preferences JSONB DEFAULT '[]',
  learning_style VARCHAR(20) CHECK (learning_style IN ('visual', 'auditory', 'kinesthetic', 'mixed')),
  time_availability INTEGER DEFAULT 0, -- hours per week
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- USER SKILLS
-- =====================================================

CREATE TABLE user_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  level VARCHAR(20) CHECK (level IN ('basic', 'intermediate', 'advanced', 'expert')),
  confidence INTEGER CHECK (confidence >= 1 AND confidence <= 5),
  experience INTEGER DEFAULT 0, -- in months
  last_used DATE,
  verified BOOLEAN DEFAULT FALSE,
  certifications JSONB DEFAULT '[]',
  projects JSONB DEFAULT '[]',
  endorsements INTEGER DEFAULT 0,
  learning_goal_target_level VARCHAR(20),
  learning_goal_deadline DATE,
  learning_goal_resources JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

-- =====================================================
-- CAREER GOALS
-- =====================================================

CREATE TABLE career_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  type VARCHAR(20) CHECK (type IN ('skill', 'role', 'salary', 'certification', 'project')),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  target_value TEXT,
  deadline DATE,
  priority VARCHAR(10) CHECK (priority IN ('low', 'medium', 'high')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- GOAL MILESTONES
-- =====================================================

CREATE TABLE goal_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  goal_id UUID REFERENCES career_goals(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- MARKET INSIGHTS
-- =====================================================

CREATE TABLE market_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(20) CHECK (type IN ('skill-demand', 'salary-trend', 'job-openings', 'market-forecast')),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  data JSONB,
  source VARCHAR(100),
  published_at DATE,
  relevant_paths JSONB DEFAULT '[]',
  relevant_skills JSONB DEFAULT '[]',
  impact VARCHAR(10) CHECK (impact IN ('low', 'medium', 'high')),
  region VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- JOB MARKET DATA
-- =====================================================

CREATE TABLE job_market_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  path_id UUID REFERENCES career_paths(id),
  location VARCHAR(100) NOT NULL,
  open_positions INTEGER DEFAULT 0,
  average_salary DECIMAL(12,2),
  salary_growth DECIMAL(5,2), -- yearly percentage
  demand_trend VARCHAR(20) CHECK (demand_trend IN ('increasing', 'stable', 'decreasing')),
  top_employers JSONB DEFAULT '[]',
  required_skills JSONB DEFAULT '[]',
  emerging_requirements JSONB DEFAULT '[]',
  data_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(path_id, location, data_date)
);

-- =====================================================
-- MENTORSHIP OPPORTUNITIES
-- =====================================================

CREATE TABLE mentorship_opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID NOT NULL,
  mentor_name VARCHAR(200) NOT NULL,
  mentor_role VARCHAR(100),
  mentor_company VARCHAR(100),
  expertise JSONB DEFAULT '[]',
  experience INTEGER, -- years
  rating DECIMAL(3,2),
  availability VARCHAR(20) CHECK (availability IN ('full', 'limited', 'waitlist')),
  price DECIMAL(8,2), -- per hour
  languages JSONB DEFAULT '[]',
  timezone VARCHAR(50),
  focus_areas JSONB DEFAULT '[]',
  success_stories INTEGER DEFAULT 0,
  bio TEXT,
  linkedin_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CAREER RECOMMENDATIONS
-- =====================================================

CREATE TABLE career_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  type VARCHAR(20) CHECK (type IN ('skill', 'role', 'path', 'resource', 'certification', 'project')),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  reasoning TEXT,
  priority VARCHAR(10) CHECK (priority IN ('low', 'medium', 'high')),
  impact VARCHAR(10) CHECK (impact IN ('low', 'medium', 'high')),
  effort VARCHAR(10) CHECK (effort IN ('low', 'medium', 'high')),
  timeline INTEGER, -- in months
  actionable BOOLEAN DEFAULT TRUE,
  resources JSONB DEFAULT '[]',
  success_metrics JSONB DEFAULT '[]',
  accepted BOOLEAN,
  dismissed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SKILL GROWTH TRACKING
-- =====================================================

CREATE TABLE skill_growth_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  skill_id UUID REFERENCES skills(id),
  level_value INTEGER, -- numeric representation of level
  confidence INTEGER,
  date DATE DEFAULT CURRENT_DATE,
  source VARCHAR(50), -- 'self-assessment', 'certification', 'project', etc.
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, skill_id, date)
);

-- =====================================================
-- LEARNING ACTIVITIES
-- =====================================================

CREATE TABLE learning_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  resource_id UUID REFERENCES learning_resources(id),
  skill_id UUID REFERENCES skills(id),
  activity_type VARCHAR(50), -- 'started', 'completed', 'paused', 'resumed'
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  time_spent INTEGER DEFAULT 0, -- in minutes
  notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_skills_difficulty ON skills(difficulty);
CREATE INDEX idx_career_paths_category ON career_paths(category);
CREATE INDEX idx_career_paths_experience_level ON career_paths(experience_level);
CREATE INDEX idx_user_career_profiles_user_id ON user_career_profiles(user_id);
CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX idx_career_goals_user_id ON career_goals(user_id);
CREATE INDEX idx_market_insights_type ON market_insights(type);
CREATE INDEX idx_job_market_data_path_id ON job_market_data(path_id);
CREATE INDEX idx_skill_growth_history_user_skill ON skill_growth_history(user_id, skill_id);
CREATE INDEX idx_learning_activities_user_id ON learning_activities(user_id);

-- =====================================================
-- FUNCTIONS FOR AUTOMATIC UPDATES
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update trigger to relevant tables
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_career_paths_updated_at BEFORE UPDATE ON career_paths
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_user_career_profiles_updated_at BEFORE UPDATE ON user_career_profiles
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_user_skills_updated_at BEFORE UPDATE ON user_skills
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_career_goals_updated_at BEFORE UPDATE ON career_goals
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- =====================================================
-- SAMPLE DATA INSERTS (High-Quality Content)
-- =====================================================

-- Skills Data
INSERT INTO skills (name, category, description, difficulty, importance, market_demand, average_salary_impact, related_skills, tags, icon, color) VALUES
('JavaScript', 'Frontend', 'Linguagem de programação essencial para desenvolvimento web moderno', 'beginner', 5, 5, 25.5, '["TypeScript", "React", "Node.js"]', '["web", "frontend", "programming"]', 'logo-javascript', '#f7df1e'),
('React', 'Frontend', 'Biblioteca JavaScript para construção de interfaces de usuário', 'intermediate', 5, 5, 30.0, '["JavaScript", "Redux", "Next.js"]', '["web", "frontend", "ui"]', 'logo-react', '#61dafb'),
('Python', 'Backend', 'Linguagem versátil para backend, data science e automação', 'beginner', 5, 5, 28.0, '["Django", "Flask", "Pandas"]', '["backend", "data", "ai"]', 'logo-python', '#3776ab'),
('TypeScript', 'Frontend', 'Superset do JavaScript com tipagem estática', 'intermediate', 4, 4, 20.0, '["JavaScript", "React", "Angular"]', '["web", "frontend", "types"]', 'logo-typescript', '#3178c6'),
('Docker', 'DevOps', 'Plataforma de containerização para aplicações', 'intermediate', 4, 4, 22.0, '["Kubernetes", "AWS", "Linux"]', '["devops", "containers", "deployment"]', 'logo-docker', '#2496ed');

-- Career Paths Data
INSERT INTO career_paths (title, description, category, experience_level, average_salary_min, average_salary_max, market_demand, growth_projection, job_titles, work_style, icon, color, tags) VALUES
('Frontend Developer', 'Especialista em desenvolvimento de interfaces de usuário modernas e responsivas', 'development', 'junior', 4000.00, 12000.00, 5, 15.5, '["Desenvolvedor Frontend", "UI Developer", "React Developer"]', 'remote', 'desktop-outline', '["#3b82f6", "#1d4ed8"]', '["javascript", "react", "css"]'),
('Backend Developer', 'Desenvolvedor focado em APIs, bancos de dados e arquitetura de servidor', 'development', 'junior', 5000.00, 15000.00, 5, 18.0, '["Desenvolvedor Backend", "API Developer", "Server Engineer"]', 'remote', 'server-outline', '["#10b981", "#059669"]', '["python", "node", "databases"]'),
('Full Stack Developer', 'Desenvolvedor com conhecimento completo do stack de desenvolvimento web', 'development', 'mid', 6000.00, 18000.00, 5, 20.0, '["Desenvolvedor Full Stack", "Web Developer", "Software Engineer"]', 'remote', 'layers-outline', '["#8b5cf6", "#7c3aed"]', '["frontend", "backend", "databases"]');