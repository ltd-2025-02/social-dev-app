import { jobsService } from '../services/jobs.service';
import { theirStackService } from '../services/theirstack.service';

export async function testJobsIntegration() {
  console.log('🧪 Testing Jobs API Integration...\n');

  try {
    // Test API connections
    console.log('1️⃣ Testing API connections...');
    const apiStatus = await jobsService.testAPI();
    console.log(`   • TheirStack API: ${apiStatus.theirStack ? '✅ Connected' : '❌ Failed'}`);
    console.log(`   • SerpAPI: ${apiStatus.serpAPI ? '✅ Connected' : '❌ Failed'}\n`);

    // Test TheirStack service directly
    console.log('2️⃣ Testing TheirStack service directly...');
    try {
      const theirStackJobs = await theirStackService.searchJobs({
        limit: 3,
        posted_at_max_age_days: 7,
        job_country_code_or: ['BR']
      });
      console.log(`   • Found ${theirStackJobs.length} jobs from TheirStack`);
      if (theirStackJobs.length > 0) {
        console.log(`   • Sample job: ${theirStackJobs[0].job_title} at ${theirStackJobs[0].company}`);
      }
    } catch (error) {
      console.log(`   • TheirStack direct test failed: ${error}`);
    }

    // Test main jobs service
    console.log('\n3️⃣ Testing main jobs service...');
    const jobs = await jobsService.searchJobs({ search: 'desenvolvedor' });
    console.log(`   • Found ${jobs.length} jobs total`);
    
    if (jobs.length > 0) {
      const theirStackCount = jobs.filter(job => job.id.startsWith('theirstack-')).length;
      const mockCount = jobs.filter(job => job.id.startsWith('mock-')).length;
      const serpCount = jobs.length - theirStackCount - mockCount;
      
      console.log(`   • TheirStack jobs: ${theirStackCount}`);
      console.log(`   • SerpAPI jobs: ${serpCount}`);
      console.log(`   • Mock jobs: ${mockCount}`);
      
      console.log(`   • Sample job: ${jobs[0].title} at ${jobs[0].company}`);
      console.log(`   • Job type: ${jobs[0].type}, Level: ${jobs[0].level}`);
      if (jobs[0].technologies.length > 0) {
        console.log(`   • Technologies: ${jobs[0].technologies.slice(0, 3).join(', ')}`);
      }
    }

    // Test featured jobs
    console.log('\n4️⃣ Testing featured jobs...');
    const featuredJobs = await jobsService.getFeaturedJobs();
    console.log(`   • Found ${featuredJobs.length} featured jobs`);
    if (featuredJobs.length > 0) {
      console.log(`   • Sample featured job: ${featuredJobs[0].title} at ${featuredJobs[0].company}`);
    }

    console.log('\n✅ Jobs API integration test completed successfully!');
    return {
      success: true,
      apiStatus,
      jobsCount: jobs.length,
      featuredJobsCount: featuredJobs.length
    };

  } catch (error) {
    console.error('\n❌ Jobs API integration test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}