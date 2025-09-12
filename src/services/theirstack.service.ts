import axios from 'axios';

const THEIRSTACK_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlc3RldmFtc291emFsYXVyZXRoQGdtYWlsLmNvbSIsInBlcm1pc3Npb25zIjoidXNlciIsImNyZWF0ZWRfYXQiOiIyMDI1LTA5LTExVDIxOjU4OjI1LjYzMDYxOCswMDowMCJ9.SKQDWXfibhyfsMmtlkHgTa8-nA4NNq4uu7dAZ-NWKgo';
const THEIRSTACK_BASE_URL = 'https://api.theirstack.com/v1';

export interface TheirStackJobFilters {
  search?: string;
  location?: string;
  type?: 'remote' | 'hybrid' | 'onsite' | '';
  level?: 'junior' | 'pleno' | 'senior' | 'lead' | '';
  page?: number;
  limit?: number;
  posted_at_max_age_days?: number;
  job_country_code_or?: string[];
}

export interface TheirStackJob {
  id: number;
  job_title: string;
  url: string;
  date_posted: string;
  company: string;
  location: string;
  short_location: string;
  remote: boolean;
  hybrid: boolean;
  seniority: string;
  salary_string?: string;
  min_annual_salary_usd?: number;
  max_annual_salary_usd?: number;
  description: string;
  technology_slugs: string[];
  company_object: {
    name: string;
    domain: string;
    logo?: string;
    employee_count?: number;
    industry?: string;
  };
  employment_statuses: string[];
}

class TheirStackService {
  private readonly apiKey = THEIRSTACK_API_KEY;
  private readonly baseUrl = THEIRSTACK_BASE_URL;

  async searchJobs(filters: TheirStackJobFilters = {}): Promise<TheirStackJob[]> {
    try {
      // Build search payload
      const payload = {
        page: filters.page || 0,
        limit: filters.limit || 20,
        posted_at_max_age_days: filters.posted_at_max_age_days || 30,
        blur_company_data: false,
        order_by: [{ desc: true, field: 'date_posted' }],
        job_country_code_or: filters.job_country_code_or || ['BR'],
        include_total_results: false,
        ...this.buildSearchFilters(filters)
      };

      console.log('TheirStack API Request:', payload);

      const response = await axios.post(
        `${this.baseUrl}/jobs/search`,
        payload,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          timeout: 10000
        }
      );

      console.log('TheirStack API Response:', response.status, response.data);
      
      if (response.data && response.data.data) {
        return response.data.data as TheirStackJob[];
      }

      return [];
    } catch (error: any) {
      const status = error.response?.status;
      const statusText = error.response?.statusText;
      
      console.error('TheirStack API Error:', {
        status,
        statusText,
        data: error.response?.data,
        message: error.message
      });

      // Handle specific error cases
      if (status === 402) {
        console.warn('TheirStack API: Payment Required - API quota exceeded');
        throw new Error('THEIRSTACK_QUOTA_EXCEEDED');
      } else if (status === 401) {
        console.warn('TheirStack API: Unauthorized - Invalid API key');
        throw new Error('THEIRSTACK_AUTH_FAILED');
      } else if (status >= 500) {
        console.warn('TheirStack API: Server Error');
        throw new Error('THEIRSTACK_SERVER_ERROR');
      } else if (error.code === 'ECONNABORTED' || error.code === 'ENOTFOUND') {
        console.warn('TheirStack API: Network Error');
        throw new Error('THEIRSTACK_NETWORK_ERROR');
      }
      
      throw new Error(`THEIRSTACK_UNKNOWN_ERROR: ${error.message}`);
    }
  }

  private buildSearchFilters(filters: TheirStackJobFilters) {
    const searchFilters: any = {};

    // Add search term to job title using correct field names
    if (filters.search) {
      searchFilters.job_title_pattern_or = [filters.search];
      // Note: description_pattern_or might not exist in API spec, so we removed it
    }

    // Add location filter using correct field names
    if (filters.location) {
      searchFilters.job_location_pattern_or = [filters.location];
    }

    // Add remote/hybrid/onsite filter
    if (filters.type === 'remote') {
      searchFilters.remote = true;
    } else if (filters.type === 'hybrid') {
      searchFilters.hybrid = true;
    } else if (filters.type === 'onsite') {
      searchFilters.remote = false;
      searchFilters.hybrid = false;
    }

    // Add seniority filter using correct field name
    if (filters.level) {
      const seniorityMap = {
        'junior': ['junior'],
        'pleno': ['mid_level'],
        'senior': ['senior', 'staff'],
        'lead': ['c_level']
      };
      
      searchFilters.job_seniority_or = seniorityMap[filters.level] || [];
    }

    return searchFilters;
  }

  // Transform TheirStack job to our internal Job interface
  transformToInternalJob(theirStackJob: TheirStackJob): any {
    // Determine job type
    let type: 'remote' | 'hybrid' | 'onsite' = 'onsite';
    if (theirStackJob.remote) {
      type = 'remote';
    } else if (theirStackJob.hybrid) {
      type = 'hybrid';
    }

    // Map seniority levels
    const seniorityMap: Record<string, 'junior' | 'pleno' | 'senior' | 'lead'> = {
      'junior': 'junior',
      'mid_level': 'pleno',
      'senior': 'senior',
      'staff': 'senior',
      'c_level': 'lead'
    };

    const level = seniorityMap[theirStackJob.seniority] || 'pleno';

    // Extract technologies from technology_slugs
    const technologies = theirStackJob.technology_slugs?.map(slug => 
      slug.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    ) || [];

    // Generate salary range if available
    let salary_range: string | undefined;
    if (theirStackJob.min_annual_salary_usd && theirStackJob.max_annual_salary_usd) {
      const minBRL = Math.round(theirStackJob.min_annual_salary_usd * 5.2 / 12); // Convert to BRL monthly
      const maxBRL = Math.round(theirStackJob.max_annual_salary_usd * 5.2 / 12);
      salary_range = `R$ ${minBRL.toLocaleString()} - R$ ${maxBRL.toLocaleString()}`;
    } else if (theirStackJob.salary_string) {
      salary_range = theirStackJob.salary_string;
    }

    // Extract requirements from description
    const requirements = this.extractRequirements(theirStackJob.description);

    return {
      id: `theirstack-${theirStackJob.id}`,
      title: theirStackJob.job_title,
      company: theirStackJob.company_object?.name || theirStackJob.company,
      location: theirStackJob.short_location || theirStackJob.location,
      type,
      level,
      salary_range,
      description: theirStackJob.description,
      requirements,
      technologies: technologies.slice(0, 8), // Limit to 8 technologies
      created_at: theirStackJob.date_posted + 'T00:00:00Z',
      applications_count: Math.floor(Math.random() * 100) + 20, // Simulated
      applied_by_user: false,
      is_featured: false,
      company_logo: theirStackJob.company_object?.logo,
      apply_url: theirStackJob.url,
      employment_type: theirStackJob.employment_statuses?.[0] || 'full_time',
      posted_date: theirStackJob.date_posted
    };
  }

  private extractRequirements(description: string): string[] {
    if (!description) return [];

    const requirements: string[] = [];
    
    // Common patterns for requirements in Portuguese and English
    const patterns = [
      /(?:experiência|experience)\s+(?:com|in|with)\s+([^.;,\n]{10,80})/gi,
      /(?:conhecimento|knowledge)\s+(?:em|de|in|of)\s+([^.;,\n]{10,80})/gi,
      /(?:domínio|mastery)\s+(?:de|of)\s+([^.;,\n]{10,80})/gi,
      /(?:requisitos|requirements):?\s*([^.;,\n]{10,80})/gi,
      /(?:must have|required):\s*([^.;,\n]{10,80})/gi,
      /•\s*([^.;,\n]{10,80})/g, // Bullet points
      /\n-\s*([^.;,\n]{10,80})/g, // Dash lists
    ];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(description)) !== null && requirements.length < 5) {
        const requirement = match[1].trim();
        if (requirement.length > 10 && requirement.length < 100 && 
            !requirements.some(r => r.toLowerCase().includes(requirement.toLowerCase()))) {
          requirements.push(requirement);
        }
      }
    });

    // Add some common requirements if none found
    if (requirements.length === 0) {
      requirements.push(
        'Experiência com desenvolvimento de software',
        'Conhecimento em metodologias ágeis',
        'Capacidade de trabalho em equipe'
      );
    }

    return requirements.slice(0, 5);
  }

  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await this.searchJobs({ 
        limit: 1, 
        posted_at_max_age_days: 7 
      });
      return { success: true };
    } catch (error: any) {
      console.error('TheirStack connection test failed:', error.message);
      
      // Return specific error information for handling
      return { 
        success: false, 
        error: error.message 
      };
    }
  }
}

export const theirStackService = new TheirStackService();