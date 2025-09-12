import { supabase } from '../lib/supabase';

export interface UserProgress {
  id: string;
  user_id: string;
  track_id: string;
  module_id: string;
  lesson_id?: string;
  exercise_id?: string;
  completion_percentage: number;
  time_spent: number;
  completed_at?: string;
  current_level: number;
  experience_points: number;
}

export interface ExerciseSubmission {
  exercise_id: string;
  user_id: string;
  code: string;
  complexity_analysis: string;
  explanation: string;
  score: number;
  ai_feedback: string;
  attempts: number;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon?: string; // Legacy emoji support
  image_path?: string; // Path to custom badge image
  criteria: string;
  track_id?: string;
  module_id?: string;
  color?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

class ProgressService {
  async getUserProgress(userId: string, trackId?: string): Promise<UserProgress[]> {
    try {
      let query = supabase
        .from('user_progress')
        .select(`
          *,
          learning_tracks(name, description),
          modules(name, description),
          lessons(title, content)
        `)
        .eq('user_id', userId);

      if (trackId) {
        query = query.eq('track_id', trackId);
      }

      const { data, error } = await query.order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user progress:', error);
      throw error;
    }
  }

  async updateLessonProgress(
    userId: string,
    trackId: string,
    moduleId: string,
    lessonId: string,
    completionPercentage: number,
    timeSpent: number
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          track_id: trackId,
          module_id: moduleId,
          lesson_id: lessonId,
          completion_percentage: completionPercentage,
          time_spent: timeSpent,
          completed_at: completionPercentage === 100 ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,track_id,module_id,lesson_id'
        });

      if (error) throw error;

      // Check if module is completed and award badge
      if (completionPercentage === 100) {
        await this.checkModuleCompletion(userId, trackId, moduleId);
      }
    } catch (error) {
      console.error('Error updating lesson progress:', error);
      throw error;
    }
  }

  async submitExercise(submission: Omit<ExerciseSubmission, 'id'>): Promise<ExerciseSubmission> {
    try {
      const { data, error } = await supabase
        .from('exercise_submissions')
        .insert([{
          exercise_id: submission.exercise_id,
          user_id: submission.user_id,
          code: submission.code,
          complexity_analysis: submission.complexity_analysis,
          explanation: submission.explanation,
          score: submission.score,
          ai_feedback: submission.ai_feedback,
          attempts: submission.attempts
        }])
        .select()
        .single();

      if (error) throw error;

      // Update user experience points based on score
      await this.updateUserExperience(submission.user_id, Math.round(submission.score * 10));

      return data;
    } catch (error) {
      console.error('Error submitting exercise:', error);
      throw error;
    }
  }

  async getUserBadges(userId: string): Promise<(UserBadge & { badge: Badge })[]> {
    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select(`
          *,
          badge:badges(
            id,
            name,
            description,
            icon,
            image_path,
            color,
            rarity,
            criteria
          )
        `)
        .eq('user_id', userId)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user badges:', error);
      throw error;
    }
  }

  async getAllBadges(): Promise<Badge[]> {
    try {
      const { data, error } = await supabase
        .from('badges')
        .select(`
          id,
          name,
          description,
          icon,
          image_path,
          color,
          rarity,
          criteria,
          track_id,
          module_id
        `)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching badges:', error);
      throw error;
    }
  }

  async awardBadge(userId: string, badgeId: string): Promise<void> {
    try {
      // Check if user already has this badge
      const { data: existingBadge } = await supabase
        .from('user_badges')
        .select('id')
        .eq('user_id', userId)
        .eq('badge_id', badgeId)
        .single();

      if (existingBadge) {
        console.log('User already has this badge');
        return;
      }

      const { error } = await supabase
        .from('user_badges')
        .insert([{
          user_id: userId,
          badge_id: badgeId
        }]);

      if (error) throw error;
      console.log('Badge awarded successfully');
    } catch (error) {
      console.error('Error awarding badge:', error);
      throw error;
    }
  }

  async getUserStats(userId: string): Promise<{
    totalExperience: number;
    currentLevel: number;
    badgesEarned: number;
    exercisesCompleted: number;
    averageScore: number;
    totalTimeSpent: number;
  }> {
    try {
      // Get user statistics
      const [experienceResult, badgesResult, exercisesResult, progressResult] = await Promise.all([
        supabase.from('user_experience').select('experience_points, level').eq('user_id', userId).single(),
        supabase.from('user_badges').select('id').eq('user_id', userId),
        supabase.from('exercise_submissions').select('score').eq('user_id', userId),
        supabase.from('user_progress').select('time_spent').eq('user_id', userId)
      ]);

      const totalExperience = experienceResult.data?.experience_points || 0;
      const currentLevel = experienceResult.data?.level || 1;
      const badgesEarned = badgesResult.data?.length || 0;
      const exercisesCompleted = exercisesResult.data?.length || 0;
      const averageScore = exercisesResult.data?.length ? 
        exercisesResult.data.reduce((sum, ex) => sum + ex.score, 0) / exercisesResult.data.length : 0;
      const totalTimeSpent = progressResult.data?.reduce((sum, prog) => sum + (prog.time_spent || 0), 0) || 0;

      return {
        totalExperience,
        currentLevel,
        badgesEarned,
        exercisesCompleted,
        averageScore: Math.round(averageScore * 100) / 100,
        totalTimeSpent
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  }

  private async checkModuleCompletion(userId: string, trackId: string, moduleId: string): Promise<void> {
    try {
      // Get all lessons in this module
      const { data: lessons } = await supabase
        .from('lessons')
        .select('id')
        .eq('module_id', moduleId);

      if (!lessons || lessons.length === 0) return;

      // Check if all lessons are completed
      const { data: completedLessons } = await supabase
        .from('user_progress')
        .select('lesson_id')
        .eq('user_id', userId)
        .eq('module_id', moduleId)
        .eq('completion_percentage', 100);

      const completedLessonIds = new Set(completedLessons?.map(l => l.lesson_id) || []);
      const allLessonsCompleted = lessons.every(lesson => completedLessonIds.has(lesson.id));

      if (allLessonsCompleted) {
        // Award module completion badge
        const { data: badge } = await supabase
          .from('badges')
          .select('id')
          .eq('module_id', moduleId)
          .single();

        if (badge) {
          await this.awardBadge(userId, badge.id);
        }

        // Award bonus experience for module completion
        await this.updateUserExperience(userId, 100);
      }
    } catch (error) {
      console.error('Error checking module completion:', error);
    }
  }

  private async updateUserExperience(userId: string, experienceGain: number): Promise<void> {
    try {
      const { data: currentExp } = await supabase
        .from('user_experience')
        .select('experience_points, level')
        .eq('user_id', userId)
        .single();

      const newExperience = (currentExp?.experience_points || 0) + experienceGain;
      const newLevel = Math.floor(newExperience / 1000) + 1; // 1000 XP per level

      await supabase
        .from('user_experience')
        .upsert({
          user_id: userId,
          experience_points: newExperience,
          level: newLevel,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      // Check for level-up badges
      if (newLevel > (currentExp?.level || 1)) {
        const { data: levelBadge } = await supabase
          .from('badges')
          .select('id')
          .eq('criteria', `level_${newLevel}`)
          .single();

        if (levelBadge) {
          await this.awardBadge(userId, levelBadge.id);
        }
      }
    } catch (error) {
      console.error('Error updating user experience:', error);
    }
  }
}

export const progressService = new ProgressService();