const { connectDB, disconnectDB, asyncForEach } = require('./util');
const { Activity } = require('../server/api/activity/activity');
import createJobs from './mock-data/createJobs';

async function main() {
  connectDB()

  try {
    // Clear existing jobs (activities) in the database.
    await Activity.deleteMany();
    // Create new jobs and add to the database.
    const jobs = await createJobs();
    console.log(`${jobs.length} jobs were successfully added to the DB.`);
  } catch (e) {
    console.error('Error adding jobs to DB:', e);
  }

  disconnectDB()
  process.exit(0)
}

main()
