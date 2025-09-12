
-- =============================================
-- SocialDev - Career Learning System Database Schema
-- PostgreSQL 12+ Required
-- Includes: Career Tracks, Skills, Assessments, Analytics
-- =============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Alternative UUID functions for older PostgreSQL versions
-- If gen_random_uuid() fails, replace with uuid_generate_v4()

CREATE TABLE learning_tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(7) NOT NULL, -- hex color
    icon VARCHAR(50),
    level VARCHAR(50) NOT NULL, -- e.g., "Básico → Avançado"
    total_hours INTEGER NOT NULL DEFAULT 0,
    difficulty_level INTEGER NOT NULL DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
    is_active BOOLEAN DEFAULT TRUE,
    order_index INTEGER NOT NULL DEFAULT 0,
    prerequisites TEXT[], -- Array of prerequisite track IDs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Modules within each track (e.g., "Análise de Complexidade", "Estruturas de Dados")
CREATE TABLE learning_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    track_id UUID NOT NULL REFERENCES learning_tracks(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    estimated_hours INTEGER NOT NULL DEFAULT 1,
    order_index INTEGER NOT NULL DEFAULT 0,
    difficulty_level INTEGER NOT NULL DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
    prerequisites UUID[], -- Array of prerequisite module IDs
    learning_objectives TEXT[], -- Array of learning objectives
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Individual lessons within modules
CREATE TABLE learning_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES learning_modules(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL DEFAULT 30,
    difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    order_index INTEGER NOT NULL DEFAULT 0,
    
    
    theory_content TEXT, -- Rich text/markdown content
    key_points TEXT[], -- Array of key learning points
    
    
    has_visualization BOOLEAN DEFAULT FALSE,
    has_animation BOOLEAN DEFAULT FALSE,
    has_interactive_examples BOOLEAN DEFAULT FALSE,
    
    
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Code examples within lessons
CREATE TABLE lesson_code_examples (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES learning_lessons(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    language VARCHAR(20) NOT NULL DEFAULT 'javascript',
    code TEXT NOT NULL,
    explanation TEXT,
    complexity_analysis TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    
    
    is_runnable BOOLEAN DEFAULT FALSE,
    expected_output TEXT,
    execution_time_ms INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


CREATE TABLE exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID REFERENCES learning_lessons(id) ON DELETE CASCADE,
    module_id UUID REFERENCES learning_modules(id) ON DELETE CASCADE,
    
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard')),
    exercise_type VARCHAR(30) CHECK (exercise_type IN ('complexity-analysis', 'algorithm-implementation', 'data-structure', 'optimization', 'multiple-choice', 'coding')),
    
    
    problem_statement TEXT NOT NULL,
    code_template TEXT,
    starter_code TEXT,
    expected_complexity VARCHAR(20), -- e.g., "O(n)", "O(log n)"
    expected_space_complexity VARCHAR(20),
    
    
    hints JSONB DEFAULT '[]', -- Array of hint objects with text and penalty
    solution_code TEXT,
    solution_explanation TEXT,
    
    
    test_cases JSONB DEFAULT '[]', -- Array of test case objects
    custom_judge_code TEXT, -- Custom validation logic if needed
    
    
    base_points INTEGER NOT NULL DEFAULT 100,
    time_limit_seconds INTEGER DEFAULT 300,
    memory_limit_mb INTEGER DEFAULT 256,
    
    
    
    
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


CREATE TABLE exercise_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    
    
    submitted_code TEXT NOT NULL,
    submitted_complexity VARCHAR(50),
    submitted_space_complexity VARCHAR(50),
    user_explanation TEXT,
    language VARCHAR(20) NOT NULL DEFAULT 'javascript',
    
    
    ai_score INTEGER CHECK (ai_score BETWEEN 0 AND 100),
    correctness_score INTEGER CHECK (correctness_score BETWEEN 0 AND 100),
    complexity_score INTEGER CHECK (complexity_score BETWEEN 0 AND 100),
    code_quality_score INTEGER CHECK (code_quality_score BETWEEN 0 AND 100),
    
    
    ai_feedback JSONB DEFAULT '{}', -- Structured feedback from AI
    ai_suggestions TEXT[],
    detected_complexity VARCHAR(50), -- AI-detected complexity
    detected_patterns TEXT[], -- Detected algorithmic patterns
    
    
    test_results JSONB DEFAULT '{}', -- Results of test case execution
    execution_time_ms INTEGER,
    memory_used_mb DECIMAL(8,2),
    compilation_errors TEXT,
    runtime_errors TEXT,
    
    
    attempt_number INTEGER NOT NULL DEFAULT 1,
    is_correct BOOLEAN DEFAULT FALSE,
    final_score INTEGER DEFAULT 0,
    hints_used INTEGER DEFAULT 0,
    time_spent_seconds INTEGER DEFAULT 0,
    
    
    status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('submitted', 'analyzing', 'analyzed', 'error')),
    
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    analyzed_at TIMESTAMP WITH TIME ZONE,
    
    UNIQUE(user_id, exercise_id, attempt_number)
);


CREATE TABLE user_track_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    track_id UUID NOT NULL REFERENCES learning_tracks(id) ON DELETE CASCADE,
    
    
    status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'paused')),
    completion_percentage DECIMAL(5,2) DEFAULT 0.0 CHECK (completion_percentage BETWEEN 0 AND 100),
    
    -- Time tracking
    total_time_spent_minutes INTEGER DEFAULT 0,
    estimated_time_remaining_minutes INTEGER,
    
    -- Performance metrics
    average_score DECIMAL(5,2) DEFAULT 0.0,
    total_exercises_attempted INTEGER DEFAULT 0,
    total_exercises_completed INTEGER DEFAULT 0,
    correct_first_attempts INTEGER DEFAULT 0,
    
    
    current_skill_level INTEGER DEFAULT 1 CHECK (current_skill_level BETWEEN 1 AND 10),
    skill_areas JSONB DEFAULT '{}', -- Skills breakdown by area
    
    -- Milestones
    modules_completed INTEGER DEFAULT 0,
    lessons_completed INTEGER DEFAULT 0,
    badges_earned INTEGER DEFAULT 0,
    
    -- Timestamps
    started_at TIMESTAMP WITH TIME ZONE,
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, track_id)
);

-- Track user progress through individual modules
CREATE TABLE user_module_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES learning_modules(id) ON DELETE CASCADE,
    track_progress_id UUID NOT NULL REFERENCES user_track_progress(id) ON DELETE CASCADE,
    
    -- Progress status
    status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'review_needed')),
    completion_percentage DECIMAL(5,2) DEFAULT 0.0 CHECK (completion_percentage BETWEEN 0 AND 100),
    
    -- Performance metrics
    module_score DECIMAL(5,2) DEFAULT 0.0,
    lessons_completed INTEGER DEFAULT 0,
    total_lessons INTEGER NOT NULL DEFAULT 0,
    exercises_completed INTEGER DEFAULT 0,
    total_exercises INTEGER NOT NULL DEFAULT 0,
    
    -- Time tracking
    time_spent_minutes INTEGER DEFAULT 0,
    estimated_completion_time INTEGER,
    
    -- Skill progression
    pre_assessment_score INTEGER, -- Score before starting module
    post_assessment_score INTEGER, -- Score after completing module
    skill_improvement DECIMAL(5,2) DEFAULT 0.0,
    
    
    learning_velocity DECIMAL(5,2), -- Concepts learned per hour
    difficulty_areas TEXT[], -- Topics user struggles with
    strength_areas TEXT[], -- Topics user excels at
    recommended_review_topics TEXT[],
    
    -- Timestamps
    started_at TIMESTAMP WITH TIME ZONE,
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, module_id)
);

-- Track user progress through individual lessons
CREATE TABLE user_lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES learning_lessons(id) ON DELETE CASCADE,
    module_progress_id UUID NOT NULL REFERENCES user_module_progress(id) ON DELETE CASCADE,
    
    -- Progress status
    status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'reading', 'completed', 'review')),
    completion_percentage DECIMAL(5,2) DEFAULT 0.0,
    
    -- Engagement metrics
    time_spent_minutes INTEGER DEFAULT 0,
    times_visited INTEGER DEFAULT 0,
    scroll_percentage DECIMAL(5,2) DEFAULT 0.0, -- How much user scrolled through content
    
    -- Learning metrics
    comprehension_score DECIMAL(5,2), -- Based on quiz/exercise performance
    engagement_score DECIMAL(5,2), -- Based on time spent, interactions
    
    -- Content interaction
    code_examples_run INTEGER DEFAULT 0,
    visualizations_viewed INTEGER DEFAULT 0,
    notes_taken INTEGER DEFAULT 0,
    bookmarked BOOLEAN DEFAULT FALSE,
    
    -- Assessment
    quiz_attempts INTEGER DEFAULT 0,
    best_quiz_score DECIMAL(5,2) DEFAULT 0.0,
    concepts_mastered TEXT[],
    concepts_struggling TEXT[],
    
    -- Timestamps
    first_accessed_at TIMESTAMP WITH TIME ZONE,
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, lesson_id)
);

-- ====================================
-- BADGES & ACHIEVEMENTS SYSTEM
-- ====================================

-- Available badges in the system
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    
    -- Visual design
    icon VARCHAR(100), -- Legacy icon name or emoji
    image_path VARCHAR(255), -- Path to custom badge image in assets/badges/
    color VARCHAR(7) NOT NULL, -- Hex color for badge
    background_color VARCHAR(7), -- Background color if needed
    gradient_colors TEXT[], -- Array of colors for gradient
    rarity VARCHAR(20) DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
    
    -- Badge criteria
    badge_type VARCHAR(30) NOT NULL CHECK (badge_type IN ('completion', 'performance', 'streak', 'challenge', 'skill', 'special')),
    category VARCHAR(50) NOT NULL, -- e.g., 'algorithms', 'data-structures', 'general'
    
    -- Unlock criteria (stored as JSON for flexibility)
    unlock_criteria JSONB NOT NULL, -- Contains rules for earning the badge
    
    -- Examples of unlock criteria:
    -- {"type": "complete_module", "module_id": "uuid", "min_score": 85}
    -- {"type": "complete_track", "track_id": "uuid", "time_limit_hours": 40}
    -- {"type": "exercise_streak", "exercise_count": 10, "consecutive": true}
    -- {"type": "performance", "metric": "avg_complexity_score", "min_value": 90, "exercise_count": 20}
    
    -- Metadata
    points_reward INTEGER DEFAULT 0, -- Points awarded when badge is earned
    is_active BOOLEAN DEFAULT TRUE,
    is_hidden BOOLEAN DEFAULT FALSE, -- Hidden until earned
    order_index INTEGER DEFAULT 0,
    
    -- Statistics
    times_earned INTEGER DEFAULT 0,
    first_earned_by UUID REFERENCES users(id),
    first_earned_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User-earned badges
CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    
    -- How the badge was earned
    earned_context JSONB, -- Context about how badge was earned
    progress_snapshot JSONB, -- User's progress when badge was earned
    
    -- Badge metadata when earned
    badge_name VARCHAR(100) NOT NULL, -- Snapshot in case badge is modified later
    badge_description TEXT NOT NULL,
    badge_rarity VARCHAR(20) NOT NULL,
    points_earned INTEGER DEFAULT 0,
    
    -- Display settings
    is_featured BOOLEAN DEFAULT FALSE, -- Show prominently on profile
    display_order INTEGER DEFAULT 0,
    
    -- Sharing
    is_public BOOLEAN DEFAULT TRUE,
    shared_at TIMESTAMP WITH TIME ZONE,
    
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, badge_id) -- User can only earn each badge once
);

-- ====================================
-- USER SKILL ASSESSMENT & LEVELS
-- ====================================

-- Track user's overall skill progression
CREATE TABLE user_skill_levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Overall skill metrics
    overall_level INTEGER DEFAULT 1 CHECK (overall_level BETWEEN 1 AND 100),
    total_xp INTEGER DEFAULT 0,
    xp_to_next_level INTEGER DEFAULT 100,
    
    -- Skill categories with individual levels
    algorithm_analysis_level INTEGER DEFAULT 1,
    algorithm_analysis_xp INTEGER DEFAULT 0,
    
    data_structures_level INTEGER DEFAULT 1,
    data_structures_xp INTEGER DEFAULT 0,
    
    complexity_analysis_level INTEGER DEFAULT 1,
    complexity_analysis_xp INTEGER DEFAULT 0,
    
    problem_solving_level INTEGER DEFAULT 1,
    problem_solving_xp INTEGER DEFAULT 0,
    
    code_optimization_level INTEGER DEFAULT 1,
    code_optimization_xp INTEGER DEFAULT 0,
    
    -- Detailed skill breakdown
    skills_breakdown JSONB DEFAULT '{}', -- Detailed breakdown of specific skills
    
    -- Learning characteristics (AI-analyzed)
    learning_style VARCHAR(50), -- visual, auditory, kinesthetic, reading
    preferred_difficulty VARCHAR(20), -- gradual, challenging, mixed
    learning_pace VARCHAR(20), -- slow, medium, fast
    strong_areas TEXT[],
    improvement_areas TEXT[],
    
    -- Recommendations
    next_recommended_topics TEXT[],
    suggested_learning_path TEXT[],
    personalized_challenges TEXT[],
    
    -- Statistics
    total_exercises_completed INTEGER DEFAULT 0,
    total_time_invested_hours INTEGER DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0.0,
    best_streak INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    
    last_skill_assessment_at TIMESTAMP WITH TIME ZONE,
    last_level_up_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- Detailed skill assessments and evaluations
CREATE TABLE skill_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    assessment_type VARCHAR(30) NOT NULL CHECK (assessment_type IN ('initial', 'module_completion', 'periodic', 'challenge')),
    track_id UUID REFERENCES learning_tracks(id),
    module_id UUID REFERENCES learning_modules(id),
    
    -- Assessment results
    overall_score DECIMAL(5,2) NOT NULL CHECK (overall_score BETWEEN 0 AND 100),
    skill_scores JSONB NOT NULL, -- Breakdown by skill area
    
    -- Detailed analysis
    strengths TEXT[],
    weaknesses TEXT[],
    recommendations TEXT[],
    
    -- Performance indicators
    problem_solving_score DECIMAL(5,2),
    algorithm_design_score DECIMAL(5,2),
    complexity_analysis_score DECIMAL(5,2),
    code_quality_score DECIMAL(5,2),
    debugging_score DECIMAL(5,2),
    
    -- AI insights
    learning_velocity DECIMAL(5,2), -- Progress rate
    retention_score DECIMAL(5,2), -- How well user retains knowledge
    application_score DECIMAL(5,2), -- Ability to apply concepts
    
    -- Comparison metrics
    percentile_rank DECIMAL(5,2), -- User's rank compared to others
    improvement_since_last DECIMAL(5,2), -- Improvement percentage
    
    assessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, assessment_type, track_id, module_id, assessed_at)
);

-- ====================================
-- ANALYTICS & INSIGHTS
-- ====================================

-- Learning session tracking for analytics
CREATE TABLE learning_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    track_id UUID REFERENCES learning_tracks(id),
    module_id UUID REFERENCES learning_modules(id),
    lesson_id UUID REFERENCES learning_lessons(id),
    
    -- Session details
    session_type VARCHAR(30) CHECK (session_type IN ('reading', 'exercises', 'review', 'assessment')),
    device_type VARCHAR(20), -- mobile, tablet, desktop
    platform VARCHAR(20), -- ios, android, web
    
    -- Engagement metrics
    duration_minutes INTEGER NOT NULL,
    pages_viewed INTEGER DEFAULT 0,
    exercises_attempted INTEGER DEFAULT 0,
    exercises_completed INTEGER DEFAULT 0,
    interactions_count INTEGER DEFAULT 0, -- clicks, taps, scrolls
    
    -- Learning effectiveness
    concepts_learned INTEGER DEFAULT 0,
    retention_score DECIMAL(5,2),
    focus_score DECIMAL(5,2), -- Based on engagement patterns
    
    -- Technical metrics
    load_time_ms INTEGER,
    error_count INTEGER DEFAULT 0,
    crash_count INTEGER DEFAULT 0,
    
    session_start TIMESTAMP WITH TIME ZONE NOT NULL,
    session_end TIMESTAMP WITH TIME ZONE NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- PREDEFINED BADGES FOR ALGORITHMS TRACK
-- ====================================

-- Insert algorithm-specific badges
INSERT INTO badges (name, description, icon, image_path, color, gradient_colors, rarity, badge_type, category, unlock_criteria, points_reward) VALUES

-- Completion badges
('Primeiro Passo', 'Complete sua primeira lição de algoritmos', 'star', 'badge_first_lesson.png', '#3b82f6', '["#3b82f6", "#1d4ed8"]', 'common', 'completion', 'algorithms', '{"type": "complete_first_lesson"}', 50),

('Mestre da Complexidade', 'Domine a análise de complexidade Big O', 'analytics', 'badge_big_o_master.png', '#3b82f6', '["#3b82f6", "#1d4ed8"]', 'common', 'completion', 'algorithms', '{"type": "complete_module", "module_name": "Análise de Complexidade e Big O", "min_score": 70}', 100),

('Explorador de Estruturas', 'Experimente todas as estruturas de dados interativas', 'library', 'badge_data_structure_explorer.png', '#10b981', '["#10b981", "#047857"]', 'uncommon', 'completion', 'algorithms', '{"type": "complete_module", "module_name": "Estruturas de Dados Fundamentais", "min_score": 75}', 150),

('Mestre dos Algoritmos', 'Complete todo o módulo de técnicas avançadas', 'construct', 'badge_algorithm_master.png', '#8b5cf6', '["#8b5cf6", "#6d28d9"]', 'rare', 'completion', 'algorithms', '{"type": "complete_module", "module_name": "Técnicas Avançadas de Algoritmos", "min_score": 80}', 200),

('Guru da Complexidade', 'Conquiste maestria em toda a trilha de Algoritmos', 'trophy', 'badge_complexity_guru.png', '#f59e0b', '["#f59e0b", "#d97706"]', 'epic', 'completion', 'algorithms', '{"type": "complete_track", "track_name": "Algoritmos e Estruturas de Dados", "min_score": 85}', 500),

-- Performance badges
('Velocista do Código', 'Resolva um exercício em menos de 5 minutos', 'flash', 'badge_speed_coder.png', '#ef4444', '["#ef4444", "#dc2626"]', 'rare', 'performance', 'algorithms', '{"type": "speed_exercise", "max_time_minutes": 5}', 300),

('Perfeccionista', 'Obtenha 100% de pontuação em 5 exercícios seguidos', 'checkmark-circle', 'badge_perfectionist.png', '#10b981', '["#10b981", "#059669"]', 'rare', 'performance', 'algorithms', '{"type": "perfect_streak", "exercise_count": 5, "score": 100}', 250),

('Guru da Recursão', 'Resolva 10 problemas recursivos consecutivos', 'git-network', 'badge_recursion_guru.png', '#8b5cf6', '["#8b5cf6", "#7c3aed"]', 'rare', 'challenge', 'algorithms', '{"type": "topic_mastery", "topic": "recursion", "exercise_count": 10, "min_score": 80}', 300),

-- Streak badges  
('Maratonista', 'Estude por mais de 2 horas seguidas', 'time', 'badge_marathon_learner.png', '#f59e0b', '["#f59e0b", "#d97706"]', 'uncommon', 'streak', 'general', '{"type": "study_session", "min_hours": 2}', 200),

('Especialista em Arrays', 'Complete todos os exercícios de arrays', 'grid', 'badge_array_expert.png', '#10b981', '["#10b981", "#047857"]', 'uncommon', 'completion', 'algorithms', '{"type": "topic_mastery", "topic": "arrays", "completion_rate": 100}', 250),

-- Challenge badges
('Optimization Wizard', 'Improved algorithm complexity in 20 exercises', 'trending-up', '#10b981', '["#10b981", "#059669"]', 'uncommon', 'challenge', 'algorithms', '{"type": "optimization_count", "count": 20}', 250),

('Recursion Master', 'Solved 25 recursive problems correctly', 'git-network', '#8b5cf6', '["#8b5cf6", "#7c3aed"]', 'rare', 'challenge', 'algorithms', '{"type": "topic_mastery", "topic": "recursion", "exercise_count": 25, "min_score": 80}', 300),

('Dynamic Programming Guru', 'Mastered 15 dynamic programming challenges', 'layers', '#3b82f6', '["#3b82f6", "#2563eb"]', 'epic', 'challenge', 'algorithms', '{"type": "topic_mastery", "topic": "dynamic-programming", "exercise_count": 15, "min_score": 85}', 400),

-- Skill badges
('Big O Analyst', 'Correctly analyzed complexity for 50 different algorithms', 'analytics', '#6366f1', '["#6366f1", "#4f46e5"]', 'uncommon', 'skill', 'algorithms', '{"type": "complexity_analysis", "correct_count": 50}', 200),

('Tree Traverser', 'Implemented all major tree traversal algorithms', 'git-branch', '#10b981', '["#10b981", "#047857"]', 'rare', 'skill', 'algorithms', '{"type": "concept_completion", "concepts": ["preorder", "inorder", "postorder", "levelorder"]}', 250),

('Sorting Specialist', 'Implemented and analyzed 8 different sorting algorithms', 'swap-vertical', '#f59e0b', '["#f59e0b", "#d97706"]', 'epic', 'skill', 'algorithms', '{"type": "sorting_mastery", "algorithm_count": 8, "min_score": 80}', 350),

-- Special badges
('First Steps', 'Completed your first algorithm exercise', 'footsteps', '#10b981', '["#10b981", "#059669"]', 'common', 'special', 'algorithms', '{"type": "first_exercise", "category": "algorithms"}', 50),

('Night Owl', 'Completed 10 exercises between 10 PM and 2 AM', 'moon', '#6366f1', '["#6366f1", "#4f46e5"]', 'uncommon', 'special', 'general', '{"type": "time_pattern", "time_range": ["22:00", "02:00"], "exercise_count": 10}', 150),

('Early Bird', 'Completed 10 exercises between 5 AM and 8 AM', 'sunny', '#f59e0b', '["#f59e0b", "#d97706"]', 'uncommon', 'special', 'general', '{"type": "time_pattern", "time_range": ["05:00", "08:00"], "exercise_count": 10}', 150),

('Code Reviewer', 'Provided helpful explanations in 20 exercise submissions', 'chatbubble-ellipses', '#8b5cf6', '["#8b5cf6", "#7c3aed"]', 'rare', 'special', 'general', '{"type": "explanation_quality", "count": 20, "min_rating": 4.0}', 200);

-- ====================================
-- INDEXES FOR PERFORMANCE
-- ====================================

-- Learning content indexes
CREATE INDEX idx_learning_modules_track_id ON learning_modules(track_id);
CREATE INDEX idx_learning_lessons_module_id ON learning_lessons(module_id);
CREATE INDEX idx_lesson_code_examples_lesson_id ON lesson_code_examples(lesson_id);
CREATE INDEX idx_exercises_lesson_id ON exercises(lesson_id);
CREATE INDEX idx_exercises_module_id ON exercises(module_id);
CREATE INDEX idx_exercises_difficulty ON exercises(difficulty);

-- Progress tracking indexes
CREATE INDEX idx_user_track_progress_user_id ON user_track_progress(user_id);
CREATE INDEX idx_user_track_progress_track_id ON user_track_progress(track_id);
CREATE INDEX idx_user_module_progress_user_id ON user_module_progress(user_id);
CREATE INDEX idx_user_module_progress_module_id ON user_module_progress(module_id);
CREATE INDEX idx_user_lesson_progress_user_id ON user_lesson_progress(user_id);
CREATE INDEX idx_user_lesson_progress_lesson_id ON user_lesson_progress(lesson_id);

-- Exercise submissions indexes
CREATE INDEX idx_exercise_submissions_user_id ON exercise_submissions(user_id);
CREATE INDEX idx_exercise_submissions_exercise_id ON exercise_submissions(exercise_id);
CREATE INDEX idx_exercise_submissions_submitted_at ON exercise_submissions(submitted_at);
CREATE INDEX idx_exercise_submissions_score ON exercise_submissions(final_score);

-- Badges indexes
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX idx_user_badges_badge_id ON user_badges(badge_id);
CREATE INDEX idx_user_badges_earned_at ON user_badges(earned_at);
CREATE INDEX idx_badges_category ON badges(category);
CREATE INDEX idx_badges_rarity ON badges(rarity);

-- Analytics indexes
CREATE INDEX idx_learning_sessions_user_id ON learning_sessions(user_id);
CREATE INDEX idx_learning_sessions_session_start ON learning_sessions(session_start);
CREATE INDEX idx_skill_assessments_user_id ON skill_assessments(user_id);

-- ====================================
-- FUNCTIONS AND TRIGGERS
-- ====================================

-- Function to update user progress when exercise is completed
CREATE OR REPLACE FUNCTION update_user_progress_on_submission()
RETURNS TRIGGER AS $$
BEGIN
    -- Update lesson progress if this was the user's first correct submission
    IF NEW.is_correct = TRUE AND (OLD IS NULL OR OLD.is_correct = FALSE) THEN
        -- Update lesson progress
        UPDATE user_lesson_progress 
        SET 
            comprehension_score = COALESCE(comprehension_score, 0) + (NEW.final_score / 100.0 * 20),
            status = CASE WHEN status = 'not_started' THEN 'completed' ELSE status END,
            completion_percentage = 100,
            completed_at = COALESCE(completed_at, NOW())
        WHERE user_id = NEW.user_id 
          AND lesson_id = (SELECT lesson_id FROM exercises WHERE id = NEW.exercise_id);
        
        -- Update module progress
        UPDATE user_module_progress 
        SET 
            exercises_completed = exercises_completed + 1,
            module_score = (
                SELECT AVG(final_score) 
                FROM exercise_submissions es
                JOIN exercises e ON es.exercise_id = e.id
                WHERE es.user_id = NEW.user_id 
                  AND e.module_id = (SELECT module_id FROM exercises WHERE id = NEW.exercise_id)
                  AND es.is_correct = TRUE
            ),
            completion_percentage = CASE 
                WHEN total_exercises > 0 THEN 
                    LEAST(100, (exercises_completed + 1) * 100.0 / total_exercises)
                ELSE 100
            END,
            last_accessed_at = NOW()
        WHERE user_id = NEW.user_id 
          AND module_id = (SELECT module_id FROM exercises WHERE id = NEW.exercise_id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for automatic progress updates
CREATE TRIGGER trigger_update_progress_on_submission
    AFTER INSERT OR UPDATE ON exercise_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_user_progress_on_submission();

-- Function to check and award badges
CREATE OR REPLACE FUNCTION check_and_award_badges(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    badge_record RECORD;
    badges_awarded INTEGER := 0;
    user_stats RECORD;
BEGIN
    -- Get user statistics
    SELECT 
        COUNT(CASE WHEN es.is_correct THEN 1 END) as total_correct_exercises,
        COUNT(*) as total_exercises,
        AVG(es.final_score) as avg_score,
        MAX(es.submitted_at) as last_submission
    INTO user_stats
    FROM exercise_submissions es
    WHERE es.user_id = p_user_id;
    
    -- Check each badge criteria
    FOR badge_record IN 
        SELECT * FROM badges 
        WHERE is_active = TRUE 
          AND id NOT IN (SELECT badge_id FROM user_badges WHERE user_id = p_user_id)
    LOOP
        -- This is a simplified version - in practice, you'd implement
        -- more sophisticated criteria checking based on badge_record.unlock_criteria
        
        -- Example: First exercise badge
        IF badge_record.name = 'First Steps' AND user_stats.total_exercises >= 1 THEN
            INSERT INTO user_badges (user_id, badge_id, badge_name, badge_description, badge_rarity, points_earned)
            VALUES (p_user_id, badge_record.id, badge_record.name, badge_record.description, badge_record.rarity, badge_record.points_reward);
            badges_awarded := badges_awarded + 1;
        END IF;
        
        -- Add more badge criteria checking here...
        
    END LOOP;
    
    RETURN badges_awarded;
END;
$$ LANGUAGE plpgsql;

-- ====================================
-- SAMPLE DATA INSERTION
-- ====================================

-- Insert the algorithms track
INSERT INTO learning_tracks (id, name, description, color, icon, level, total_hours, difficulty_level)
VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Algoritmos e Estruturas de Dados',
    'Domine complexidade de algoritmos, notação Big O, estruturas de dados avançadas e técnicas de programação eficiente.',
    '#8b5cf6',
    'git-network-outline',
    'Intermediário → Avançado',
    200,
    4
);

-- Insert modules for algorithms track
INSERT INTO learning_modules (id, track_id, title, description, icon, estimated_hours, order_index, difficulty_level)
VALUES 
    ('m1-complexity', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Análise de Complexidade e Big O', 'Fundamentos de análise assintótica e notação Big O', 'analytics-outline', 40, 1, 3),
    ('m2-data-structures', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Estruturas de Dados Fundamentais', 'Arrays, listas ligadas, pilhas, filas e suas implementações', 'library-outline', 45, 2, 3),
    ('m3-advanced-structures', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Estruturas de Dados Avançadas', 'Árvores, grafos, hash tables e estruturas especializadas', 'git-network-outline', 60, 3, 4),
    ('m4-algorithm-techniques', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Técnicas Avançadas de Algoritmos', 'Recursão, programação dinâmica, dividir e conquistar', 'compass-outline', 55, 4, 5);

-- Sample lessons for the first module
INSERT INTO learning_lessons (id, module_id, title, description, duration_minutes, difficulty, order_index, theory_content, key_points, complexity_topics, tags)
VALUES 
    ('l1-big-o-intro', 'm1-complexity', 'Introdução à Análise de Complexidade', 'O que é complexidade computacional e por que importa', 60, 'intermediate', 1, 'A análise de complexidade é fundamental para escrever código eficiente...', '["Big O descreve como o algoritmo escala", "O(1) é ideal, O(n²) deve ser evitado"]', '["O(1)", "O(n)", "O(n²)"]', '["complexity", "big-o", "analysis"]'),
    ('l2-big-o-notation', 'm1-complexity', 'Notação Big O Completa', 'Todos os tipos de complexidade: O(1), O(log n), O(n), O(n log n), O(n²), O(n³), O(2^n), O(n!)', 90, 'intermediate', 2, 'A notação Big O classifica algoritmos baseado em como seu tempo de execução cresce...', '["O(1) e O(log n) são excelentes", "O(2^n) e O(n!) são impraticáveis"]', '["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)", "O(2^n)", "O(n!)"]', '["complexity", "big-o", "analysis", "time-complexity"]');

-- ====================================
-- VIEWS FOR COMMON QUERIES
-- ====================================

-- View for user progress overview
CREATE VIEW user_progress_overview AS
SELECT 
    utp.user_id,
    utp.track_id,
    lt.name as track_name,
    utp.status,
    utp.completion_percentage,
    utp.total_time_spent_minutes,
    utp.average_score,
    utp.current_skill_level,
    utp.modules_completed,
    utp.lessons_completed,
    utp.badges_earned,
    COUNT(ub.id) as total_badges_earned,
    utp.started_at,
    utp.last_accessed_at,
    utp.completed_at
FROM user_track_progress utp
JOIN learning_tracks lt ON utp.track_id = lt.id
LEFT JOIN user_badges ub ON ub.user_id = utp.user_id
GROUP BY utp.user_id, utp.track_id, lt.name, utp.status, utp.completion_percentage, 
         utp.total_time_spent_minutes, utp.average_score, utp.current_skill_level,
         utp.modules_completed, utp.lessons_completed, utp.badges_earned,
         utp.started_at, utp.last_accessed_at, utp.completed_at;

-- View for leaderboard
CREATE VIEW algorithms_leaderboard AS
SELECT 
    u.id as user_id,
    u.name,
    u.email,
    usl.overall_level,
    usl.total_xp,
    (SELECT utp.completion_percentage FROM user_track_progress utp WHERE utp.user_id = u.id) as completion_percentage,
    (SELECT utp.average_score FROM user_track_progress utp WHERE utp.user_id = u.id) as average_score,
    COUNT(ub.id) as badges_count,
    RANK() OVER (ORDER BY usl.overall_level DESC, usl.total_xp DESC) as rank
FROM users u
JOIN user_skill_levels usl ON u.id = usl.user_id
LEFT JOIN user_badges ub ON u.id = ub.user_id
GROUP BY u.id, u.name, u.email, usl.overall_level, usl.total_xp
ORDER BY rank;

-- ====================================
-- PERFORMANCE MONITORING
-- ====================================

-- Create view for analytics (simplified for compatibility)
CREATE VIEW learning_analytics AS
SELECT 
    CAST(ls.session_start AS DATE) as analytics_date,
    COUNT(DISTINCT ls.user_id) as active_users,
    COALESCE(SUM(ls.duration_minutes), 0) as total_learning_time,
    COALESCE(AVG(ls.duration_minutes), 0) as avg_session_duration,
    COUNT(DISTINCT es.id) as exercises_submitted,
    COALESCE(AVG(es.final_score), 0) as avg_exercise_score,
    COUNT(DISTINCT ub.id) as badges_earned
FROM learning_sessions ls
LEFT JOIN exercise_submissions es ON CAST(es.submitted_at AS DATE) = CAST(ls.session_start AS DATE)
LEFT JOIN user_badges ub ON CAST(ub.earned_at AS DATE) = CAST(ls.session_start AS DATE)
WHERE ls.session_start >= CURRENT_DATE - INTERVAL '90 day'
GROUP BY CAST(ls.session_start AS DATE)
ORDER BY analytics_date DESC;

-- Note: Indexes cannot be created on regular views
-- If this needs to be a materialized view for performance, 
-- change CREATE VIEW to CREATE MATERIALIZED VIEW and uncomment the index below
-- CREATE UNIQUE INDEX idx_learning_analytics_date ON learning_analytics(analytics_date);

-- Refresh the materialized view daily
-- (This would typically be set up as a scheduled job)

COMMENT ON TABLE learning_tracks IS 'Main learning tracks/paths like Algorithms, JavaScript, etc.';
COMMENT ON TABLE learning_modules IS 'Modules within each track, e.g., Big O Analysis, Data Structures';
COMMENT ON TABLE learning_lessons IS 'Individual lessons within modules with rich content';
COMMENT ON TABLE exercises IS 'Interactive exercises and challenges for hands-on learning';
COMMENT ON TABLE exercise_submissions IS 'User submissions with AI analysis and feedback';
COMMENT ON TABLE user_track_progress IS 'Overall progress tracking for each user in each track';
COMMENT ON TABLE badges IS 'Available badges that users can earn through various achievements';
COMMENT ON TABLE user_badges IS 'Badges earned by users with context and metadata';
COMMENT ON TABLE user_skill_levels IS 'Comprehensive skill assessment and level tracking';
COMMENT ON TABLE learning_sessions IS 'Detailed session analytics for learning behavior analysis';