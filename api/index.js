const path = require('path');

// Vercel injects env vars. Load server/.env only for local serverless testing.
try {
  require(path.join(__dirname, '../server/node_modules/dotenv')).config({
    path: path.join(__dirname, '../server/.env'),
  });
} catch {
  // Host provides env (Vercel) or dotenv already loaded by server entry.
}

const { createApp } = require('../server/src/app');
const { connectDatabase } = require('../server/src/config/db');
const { seedIfEmpty } = require('../server/src/utils/seed');

let appPromise;

async function getApp() {
  if (!appPromise) {
    appPromise = (async () => {
      await connectDatabase(process.env.MONGODB_URI);
      await seedIfEmpty();
      return createApp();
    })().catch((error) => {
      appPromise = null;
      throw error;
    });
  }
  return appPromise;
}

module.exports = async (req, res) => {
  const app = await getApp();
  return app(req, res);
};
