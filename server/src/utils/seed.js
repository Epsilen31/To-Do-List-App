require('dotenv').config();

const { connectDatabase } = require('../config/db');
const { Task } = require('../models/Task');
const { TASK_STATUS, TASK_PRIORITY } = require('../constants');
const { buildDateFromParts } = require('./weekHelpers');

function atHour(baseDate, hour, minute = 0) {
  const yyyy = baseDate.getFullYear();
  const mm = String(baseDate.getMonth() + 1).padStart(2, '0');
  const dd = String(baseDate.getDate()).padStart(2, '0');
  const hh = String(hour).padStart(2, '0');
  const min = String(minute).padStart(2, '0');
  return buildDateFromParts(`${yyyy}-${mm}-${dd}`, `${hh}:${min}`);
}

function getSampleTasks() {
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  return [
    {
      title: 'Finishing Wireframe',
      description: 'Complete remaining mobile wireframes for the home flow.',
      scheduledAt: atHour(today, 9, 0),
      endTime: '10:30',
      priority: TASK_PRIORITY.HIGH,
      status: TASK_STATUS.IN_PROGRESS,
    },
    {
      title: 'Meeting with team',
      description: 'Sprint sync and blockers review.',
      scheduledAt: atHour(today, 11, 0),
      endTime: '12:00',
      priority: TASK_PRIORITY.MEDIUM,
      status: TASK_STATUS.IN_PROGRESS,
    },
    {
      title: 'Buy a cat food',
      description: 'Pick up wet food and treats.',
      scheduledAt: atHour(today, 16, 30),
      endTime: '17:00',
      priority: TASK_PRIORITY.LOW,
      status: TASK_STATUS.COMPLETED,
    },
    {
      title: 'Review pull requests',
      description: 'Code review for MERN task module.',
      scheduledAt: atHour(new Date(today.getTime() + 86400000), 14, 0),
      endTime: '15:30',
      priority: TASK_PRIORITY.MEDIUM,
      status: TASK_STATUS.IN_PROGRESS,
    },
  ];
}

async function seedIfEmpty() {
  const count = await Task.countDocuments();
  if (count > 0) return;

  try {
    const samples = getSampleTasks();
    await Task.insertMany(samples);
    console.log(`Seeded ${samples.length} sample tasks`);
  } catch (error) {
    // Concurrent serverless cold starts can race past the empty check.
    const existing = await Task.countDocuments();
    if (existing === 0) throw error;
  }
}

async function seed() {
  await connectDatabase(process.env.MONGODB_URI);
  await Task.deleteMany({});
  const samples = getSampleTasks();
  await Task.insertMany(samples);
  console.log(`Seeded ${samples.length} tasks`);
  process.exit(0);
}

if (require.main === module) {
  seed().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { seedIfEmpty };
