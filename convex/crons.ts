import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Run at 6:00 AM UTC
crons.cron(
  "morning-digest",
  "0 6 * * *",
  internal.parser.rss.processDailyReports,
  { timeSlot: "06:00" }
);

// Run at 12:00 PM UTC  
crons.cron(
  "noon-digest", 
  "0 12 * * *",
  internal.parser.rss.processDailyReports,
  { timeSlot: "12:00" }
);

// Run at 6:00 PM UTC
crons.cron(
  "evening-digest",
  "0 18 * * *", 
  internal.parser.rss.processDailyReports,
  { timeSlot: "18:00" }
);

// Run at midnight UTC
crons.cron(
  "midnight-digest",
  "0 0 * * *",
  internal.parser.rss.processDailyReports,
  { timeSlot: "24:00" }
);

export default crons;