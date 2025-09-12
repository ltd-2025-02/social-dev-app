// User-related type definitions

export interface UserSearchResult {
  id: string;
  name: string | null;
  email: string | null;
  avatar: string | null;
  occupation: string | null;
  company: string | null;
  bio: string | null;
  location: string | null;
  headline: string | null;
  profile_visibility: 'public' | 'connections' | 'private';
  distance?: number;
}

export interface UserSearchFilters {
  query?: string;
  location?: string;
  occupation?: string;
  company?: string;
  skills?: string[];
  maxDistance?: number; // em km
  userLatitude?: number;
  userLongitude?: number;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  occupation: string | null;
  company: string | null;
  bio: string | null;
  location: string | null;
  headline: string | null;
  profile_visibility: 'public' | 'connections' | 'private';
  profile_completion_percentage: number;
  github_username: string | null;
  linkedin_url: string | null;
  website_url: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  totalPosts: number;
  totalConnections: number;
  totalLikes: number;
  totalComments: number;
  profileViews: number;
}

export interface UserConnection {
  id: string;
  user_id: string;
  connected_user_id: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  updated_at: string;
  user: UserProfile;
  connected_user: UserProfile;
}

export interface UserSkill {
  id: string;
  user_id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  years_of_experience: number;
  is_primary: boolean;
  created_at: string;
}

export interface UserExperience {
  id: string;
  user_id: string;
  company: string;
  position: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  location: string | null;
  created_at: string;
}

export interface UserEducation {
  id: string;
  user_id: string;
  institution: string;
  degree: string;
  field_of_study: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  created_at: string;
}

export interface UserProject {
  id: string;
  user_id: string;
  title: string;
  description: string;
  technologies: string[];
  project_url: string | null;
  github_url: string | null;
  image_url: string | null;
  start_date: string;
  end_date: string | null;
  is_ongoing: boolean;
  created_at: string;
}