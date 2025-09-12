-- =============================================================================
-- SOCIALDEV - RESUME MANAGEMENT DATABASE STRUCTURE
-- =============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- RESUME TEMPLATES TABLE
-- Store different resume templates (like Canva designs)
-- =============================================================================

CREATE TABLE public.resume_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL DEFAULT 'professional', -- professional, creative, modern, classic
    preview_image_url TEXT,
    template_data JSONB NOT NULL, -- Template structure and styling
    is_premium BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster template queries
CREATE INDEX idx_resume_templates_category ON public.resume_templates(category);
CREATE INDEX idx_resume_templates_active ON public.resume_templates(is_active);

-- =============================================================================
-- USER RESUMES TABLE
-- Store user's completed resumes
-- =============================================================================

CREATE TABLE public.user_resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    template_id UUID REFERENCES public.resume_templates(id),
    title VARCHAR(100) NOT NULL,
    
    -- Personal Information
    personal_info JSONB NOT NULL DEFAULT '{
        "fullName": "",
        "email": "",
        "phone": "",
        "address": "",
        "linkedin": "",
        "github": "",
        "website": "",
        "profileImage": ""
    }',
    
    -- Professional Summary
    summary TEXT,
    objective TEXT,
    
    -- Work Experience
    experience JSONB NOT NULL DEFAULT '[]',
    -- Format: [{"company": "", "position": "", "startDate": "", "endDate": "", "current": false, "description": "", "achievements": []}]
    
    -- Education
    education JSONB NOT NULL DEFAULT '[]',
    -- Format: [{"institution": "", "degree": "", "field": "", "startDate": "", "endDate": "", "current": false, "gpa": "", "achievements": []}]
    
    -- Skills
    technical_skills JSONB NOT NULL DEFAULT '[]',
    -- Format: [{"name": "", "level": "beginner|intermediate|advanced|expert", "category": ""}]
    
    soft_skills JSONB NOT NULL DEFAULT '[]',
    -- Format: [{"name": "", "description": ""}]
    
    -- Projects
    projects JSONB NOT NULL DEFAULT '[]',
    -- Format: [{"name": "", "description": "", "technologies": [], "url": "", "github": "", "startDate": "", "endDate": ""}]
    
    -- Certifications
    certifications JSONB NOT NULL DEFAULT '[]',
    -- Format: [{"name": "", "issuer": "", "issueDate": "", "expirationDate": "", "credentialId": "", "url": ""}]
    
    -- Languages
    languages JSONB NOT NULL DEFAULT '[]',
    -- Format: [{"language": "", "proficiency": "basic|conversational|fluent|native"}]
    
    -- Additional Sections
    awards JSONB NOT NULL DEFAULT '[]',
    publications JSONB NOT NULL DEFAULT '[]',
    volunteer_work JSONB NOT NULL DEFAULT '[]',
    interests JSONB NOT NULL DEFAULT '[]',
    
    -- Styling and Layout
    styling JSONB NOT NULL DEFAULT '{
        "colorScheme": "blue",
        "font": "Arial",
        "fontSize": 12,
        "layout": "traditional",
        "sectionOrder": ["personal", "summary", "experience", "education", "skills", "projects"]
    }',
    
    -- Metadata
    status VARCHAR(20) DEFAULT 'draft', -- draft, completed, archived
    is_public BOOLEAN DEFAULT false,
    download_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_user_resumes_user_id ON public.user_resumes(user_id);
CREATE INDEX idx_user_resumes_status ON public.user_resumes(status);
CREATE INDEX idx_user_resumes_created_at ON public.user_resumes(created_at DESC);

-- =============================================================================
-- RESUME SHARES TABLE
-- Track resume sharing and public links
-- =============================================================================

CREATE TABLE public.resume_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID NOT NULL REFERENCES public.user_resumes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    share_token UUID UNIQUE DEFAULT uuid_generate_v4(),
    share_type VARCHAR(20) NOT NULL, -- public_link, email, whatsapp, linkedin
    recipient_email VARCHAR(255),
    message TEXT,
    view_count INTEGER DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_resume_shares_resume_id ON public.resume_shares(resume_id);
CREATE INDEX idx_resume_shares_token ON public.resume_shares(share_token);
CREATE INDEX idx_resume_shares_active ON public.resume_shares(is_active);

-- =============================================================================
-- RESUME DOWNLOADS TABLE
-- Track resume downloads and formats
-- =============================================================================

CREATE TABLE public.resume_downloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID NOT NULL REFERENCES public.user_resumes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    format VARCHAR(10) NOT NULL, -- pdf, docx, png, html
    file_size INTEGER,
    download_url TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_resume_downloads_resume_id ON public.resume_downloads(resume_id);
CREATE INDEX idx_resume_downloads_user_id ON public.resume_downloads(user_id);
CREATE INDEX idx_resume_downloads_created_at ON public.resume_downloads(created_at DESC);

-- =============================================================================
-- RESUME ANALYTICS TABLE
-- Track views, interactions, and performance
-- =============================================================================

CREATE TABLE public.resume_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID NOT NULL REFERENCES public.user_resumes(id) ON DELETE CASCADE,
    share_id UUID REFERENCES public.resume_shares(id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL, -- view, download, share, copy_contact, click_link
    event_data JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    country VARCHAR(2),
    city VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_resume_analytics_resume_id ON public.resume_analytics(resume_id);
CREATE INDEX idx_resume_analytics_event_type ON public.resume_analytics(event_type);
CREATE INDEX idx_resume_analytics_created_at ON public.resume_analytics(created_at DESC);

-- =============================================================================
-- RESUME DRAFTS TABLE
-- Store work-in-progress resumes (temporary storage)
-- =============================================================================

CREATE TABLE public.resume_drafts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    conversation_state JSONB NOT NULL,
    messages JSONB NOT NULL DEFAULT '[]',
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    current_step VARCHAR(50),
    current_step_name VARCHAR(100),
    estimated_completion_time INTEGER, -- minutes
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_resume_drafts_user_id ON public.resume_drafts(user_id);
CREATE INDEX idx_resume_drafts_progress ON public.resume_drafts(progress);
CREATE INDEX idx_resume_drafts_last_active ON public.resume_drafts(last_active_at DESC);

-- Only one active draft per user
CREATE UNIQUE INDEX idx_resume_drafts_user_unique ON public.resume_drafts(user_id);

-- =============================================================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_resume_templates_updated_at 
    BEFORE UPDATE ON public.resume_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_resumes_updated_at 
    BEFORE UPDATE ON public.user_resumes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resume_drafts_updated_at 
    BEFORE UPDATE ON public.resume_drafts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.resume_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_drafts ENABLE ROW LEVEL SECURITY;

-- Resume Templates (public read access)
CREATE POLICY "Templates are viewable by everyone" ON public.resume_templates
    FOR SELECT USING (is_active = true);

-- User Resumes (users can only access their own)
CREATE POLICY "Users can view own resumes" ON public.user_resumes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own resumes" ON public.user_resumes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes" ON public.user_resumes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes" ON public.user_resumes
    FOR DELETE USING (auth.uid() = user_id);

-- Resume Shares (users can only access their own shares)
CREATE POLICY "Users can view own shares" ON public.resume_shares
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own shares" ON public.resume_shares
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own shares" ON public.resume_shares
    FOR UPDATE USING (auth.uid() = user_id);

-- Resume Downloads (users can only access their own downloads)
CREATE POLICY "Users can view own downloads" ON public.resume_downloads
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own downloads" ON public.resume_downloads
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Resume Drafts (users can only access their own drafts)
CREATE POLICY "Users can view own drafts" ON public.resume_drafts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own drafts" ON public.resume_drafts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own drafts" ON public.resume_drafts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own drafts" ON public.resume_drafts
    FOR DELETE USING (auth.uid() = user_id);

-- =============================================================================
-- SEED DATA - DEFAULT RESUME TEMPLATES
-- =============================================================================

INSERT INTO public.resume_templates (name, description, category, template_data) VALUES 
('Clássico Profissional', 'Template tradicional perfeito para áreas corporativas', 'professional', 
 '{"layout": "single-column", "colors": {"primary": "#2563eb", "secondary": "#64748b", "accent": "#f1f5f9"}, "sections": ["header", "summary", "experience", "education", "skills"], "fonts": {"primary": "Inter", "secondary": "Inter"}}'),

('Moderno Criativo', 'Design moderno com toques criativos para profissionais de design e marketing', 'creative',
 '{"layout": "two-column", "colors": {"primary": "#7c3aed", "secondary": "#a855f7", "accent": "#faf5ff"}, "sections": ["header", "summary", "skills", "experience", "education", "projects"], "fonts": {"primary": "Poppins", "secondary": "Inter"}}'),

('Minimalista Clean', 'Template minimalista focado na clareza e legibilidade', 'modern',
 '{"layout": "single-column", "colors": {"primary": "#0f172a", "secondary": "#475569", "accent": "#f8fafc"}, "sections": ["header", "objective", "experience", "education", "technical_skills", "languages"], "fonts": {"primary": "System", "secondary": "System"}}'),

('Executivo Premium', 'Design sofisticado para cargos executivos e gerenciais', 'professional',
 '{"layout": "two-column-reverse", "colors": {"primary": "#059669", "secondary": "#065f46", "accent": "#ecfdf5"}, "sections": ["header", "summary", "achievements", "experience", "education", "certifications"], "fonts": {"primary": "Times", "secondary": "Arial"}}'),

('Tech Developer', 'Template especializado para desenvolvedores e profissionais de TI', 'modern',
 '{"layout": "sidebar-left", "colors": {"primary": "#1e40af", "secondary": "#3730a3", "accent": "#eff6ff"}, "sections": ["header", "summary", "technical_skills", "projects", "experience", "education"], "fonts": {"primary": "JetBrains Mono", "secondary": "Inter"}}');

-- =============================================================================
-- VIEWS FOR ANALYTICS AND REPORTING
-- =============================================================================

-- User Resume Statistics View
CREATE VIEW user_resume_stats AS
SELECT 
    ur.user_id,
    COUNT(*) as total_resumes,
    COUNT(*) FILTER (WHERE ur.status = 'completed') as completed_resumes,
    COUNT(*) FILTER (WHERE ur.status = 'draft') as draft_resumes,
    SUM(ur.download_count) as total_downloads,
    SUM(ur.share_count) as total_shares,
    MAX(ur.updated_at) as last_updated
FROM user_resumes ur
GROUP BY ur.user_id;

-- Popular Templates View
CREATE VIEW popular_templates AS
SELECT 
    rt.*,
    COUNT(ur.id) as usage_count,
    AVG(ur.download_count) as avg_downloads
FROM resume_templates rt
LEFT JOIN user_resumes ur ON rt.id = ur.template_id
WHERE rt.is_active = true
GROUP BY rt.id
ORDER BY usage_count DESC, avg_downloads DESC;

-- =============================================================================
-- FUNCTIONS FOR BUSINESS LOGIC
-- =============================================================================

-- Function to get user's resume summary
CREATE OR REPLACE FUNCTION get_user_resume_summary(p_user_id UUID)
RETURNS TABLE(
    total_count INTEGER,
    completed_count INTEGER,
    draft_count INTEGER,
    total_downloads INTEGER,
    total_shares INTEGER,
    last_activity TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(COUNT(*)::INTEGER, 0) as total_count,
        COALESCE(COUNT(*) FILTER (WHERE status = 'completed')::INTEGER, 0) as completed_count,
        COALESCE(COUNT(*) FILTER (WHERE status = 'draft')::INTEGER, 0) as draft_count,
        COALESCE(SUM(download_count)::INTEGER, 0) as total_downloads,
        COALESCE(SUM(share_count)::INTEGER, 0) as total_shares,
        MAX(updated_at) as last_activity
    FROM user_resumes
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create a shareable link
CREATE OR REPLACE FUNCTION create_resume_share(
    p_resume_id UUID,
    p_user_id UUID,
    p_share_type VARCHAR(20),
    p_expires_in_days INTEGER DEFAULT 30
) RETURNS UUID AS $$
DECLARE
    v_share_token UUID;
BEGIN
    INSERT INTO resume_shares (resume_id, user_id, share_type, expires_at)
    VALUES (
        p_resume_id, 
        p_user_id, 
        p_share_type, 
        NOW() + (p_expires_in_days || ' days')::INTERVAL
    )
    RETURNING share_token INTO v_share_token;
    
    RETURN v_share_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================================================

COMMENT ON TABLE public.resume_templates IS 'Stores resume template designs similar to Canva templates';
COMMENT ON TABLE public.user_resumes IS 'Main table storing user-created resumes with all sections';
COMMENT ON TABLE public.resume_shares IS 'Tracks resume sharing with public links and analytics';
COMMENT ON TABLE public.resume_downloads IS 'Logs all resume download activities';
COMMENT ON TABLE public.resume_analytics IS 'Comprehensive analytics for resume performance';
COMMENT ON TABLE public.resume_drafts IS 'Temporary storage for work-in-progress resumes';

-- =============================================================================
-- GRANT PERMISSIONS
-- =============================================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant permissions on tables
GRANT SELECT ON public.resume_templates TO authenticated;
GRANT ALL ON public.user_resumes TO authenticated;
GRANT ALL ON public.resume_shares TO authenticated;
GRANT ALL ON public.resume_downloads TO authenticated;
GRANT INSERT ON public.resume_analytics TO authenticated;
GRANT ALL ON public.resume_drafts TO authenticated;

-- Grant permissions on views
GRANT SELECT ON user_resume_stats TO authenticated;
GRANT SELECT ON popular_templates TO authenticated;

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION get_user_resume_summary(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION create_resume_share(UUID, UUID, VARCHAR, INTEGER) TO authenticated;

-- =============================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- =============================================================================

-- Additional composite indexes for common queries
CREATE INDEX idx_user_resumes_user_status ON public.user_resumes(user_id, status);
CREATE INDEX idx_user_resumes_template_created ON public.user_resumes(template_id, created_at DESC);
CREATE INDEX idx_resume_shares_resume_active ON public.resume_shares(resume_id, is_active);
CREATE INDEX idx_resume_analytics_resume_event ON public.resume_analytics(resume_id, event_type, created_at DESC);

-- =============================================================================
-- END OF SCRIPT
-- =============================================================================