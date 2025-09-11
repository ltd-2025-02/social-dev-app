import { supabase } from '../lib/supabase';
import { UserProfile } from './profile.service';

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

class UsersService {
  async searchUsers(filters: UserSearchFilters = {}): Promise<UserSearchResult[]> {
    try {
      let query = supabase
        .from('users')
        .select(`
          id,
          name,
          email,
          avatar,
          occupation,
          company,
          bio,
          location,
          headline,
          profile_visibility
        `)
        .eq('profile_visibility', 'public');

      // Filtro por texto (nome, ocupação, empresa)
      if (filters.query) {
        query = query.or(`name.ilike.%${filters.query}%,occupation.ilike.%${filters.query}%,company.ilike.%${filters.query}%,bio.ilike.%${filters.query}%`);
      }

      // Filtro por localização
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      // Filtro por ocupação
      if (filters.occupation) {
        query = query.ilike('occupation', `%${filters.occupation}%`);
      }

      // Filtro por empresa
      if (filters.company) {
        query = query.ilike('company', `%${filters.company}%`);
      }

      const { data: users, error } = await query.limit(50);

      if (error) throw error;

      let results: UserSearchResult[] = users || [];

      // Se temos coordenadas do usuário e um raio máximo, calcular distâncias
      if (filters.userLatitude && filters.userLongitude && filters.maxDistance) {
        results = this.filterByDistance(
          results,
          filters.userLatitude,
          filters.userLongitude,
          filters.maxDistance
        );
      }

      // Filtro por skills (se especificado)
      if (filters.skills && filters.skills.length > 0) {
        results = await this.filterBySkills(results, filters.skills);
      }

      return results;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  async getUsersByLocation(
    latitude: number,
    longitude: number,
    radiusKm: number = 50
  ): Promise<UserSearchResult[]> {
    try {
      // Para esta implementação, vamos usar uma busca básica por cidade/estado
      // Em uma implementação real, você usaria uma busca geoespacial no banco
      const { data: users, error } = await supabase
        .from('users')
        .select(`
          id,
          name,
          email,
          avatar,
          occupation,
          company,
          bio,
          location,
          headline,
          profile_visibility
        `)
        .eq('profile_visibility', 'public')
        .not('location', 'is', null)
        .limit(50);

      if (error) throw error;

      // Simular cálculo de distância (em uma implementação real, isso seria feito no banco)
      const usersWithDistance = (users || []).map(user => ({
        ...user,
        distance: this.calculateDistance(latitude, longitude, user.location)
      })).filter(user => user.distance <= radiusKm)
        .sort((a, b) => a.distance - b.distance);

      return usersWithDistance;
    } catch (error) {
      console.error('Error getting users by location:', error);
      throw error;
    }
  }

  async getPopularUsers(limit: number = 20): Promise<UserSearchResult[]> {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select(`
          id,
          name,
          email,
          avatar,
          occupation,
          company,
          bio,
          location,
          headline,
          profile_visibility
        `)
        .eq('profile_visibility', 'public')
        .order('profile_completion_percentage', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return users || [];
    } catch (error) {
      console.error('Error getting popular users:', error);
      throw error;
    }
  }

  async getSuggestedUsers(userId: string, limit: number = 10): Promise<UserSearchResult[]> {
    try {
      // Buscar usuários com ocupações similares ou localização similar
      const currentUser = await supabase
        .from('users')
        .select('occupation, location')
        .eq('id', userId)
        .single();

      if (!currentUser.data) return [];

      let query = supabase
        .from('users')
        .select(`
          id,
          name,
          email,
          avatar,
          occupation,
          company,
          bio,
          location,
          headline,
          profile_visibility
        `)
        .eq('profile_visibility', 'public')
        .neq('id', userId);

      // Priorizar usuários com mesma ocupação ou localização
      if (currentUser.data.occupation || currentUser.data.location) {
        let conditions = [];
        if (currentUser.data.occupation) {
          conditions.push(`occupation.ilike.%${currentUser.data.occupation}%`);
        }
        if (currentUser.data.location) {
          conditions.push(`location.ilike.%${currentUser.data.location}%`);
        }
        
        if (conditions.length > 0) {
          query = query.or(conditions.join(','));
        }
      }

      const { data: users, error } = await query.limit(limit);

      if (error) throw error;

      return users || [];
    } catch (error) {
      console.error('Error getting suggested users:', error);
      throw error;
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      return user;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  // Métodos auxiliares privados
  private filterByDistance(
    users: UserSearchResult[],
    userLat: number,
    userLng: number,
    maxDistance: number
  ): UserSearchResult[] {
    return users
      .map(user => ({
        ...user,
        distance: this.calculateDistance(userLat, userLng, user.location)
      }))
      .filter(user => user.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance);
  }

  private async filterBySkills(users: UserSearchResult[], skills: string[]): Promise<UserSearchResult[]> {
    try {
      const userIds = users.map(user => user.id);
      
      const { data: userSkills, error } = await supabase
        .from('profile_skills')
        .select('user_id, name')
        .in('user_id', userIds)
        .in('name', skills);

      if (error) throw error;

      // Criar um map de usuários que têm as skills procuradas
      const usersWithSkills = new Set();
      userSkills?.forEach(skill => {
        usersWithSkills.add(skill.user_id);
      });

      return users.filter(user => usersWithSkills.has(user.id));
    } catch (error) {
      console.error('Error filtering by skills:', error);
      return users;
    }
  }

  private calculateDistance(lat1: number, lng1: number, location: string | null): number {
    if (!location) return 999999; // Distância muito alta para localizações não definidas

    // Em uma implementação real, você converteria a string de localização em coordenadas
    // e calcularia a distância real usando a fórmula de Haversine
    // Por enquanto, retornamos uma distância simulada
    const simulatedDistance = Math.random() * 100;
    return Math.round(simulatedDistance * 10) / 10;
  }

  private haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Raio da Terra em km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

export const usersService = new UsersService();