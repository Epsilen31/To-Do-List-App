require('dotenv').config({
  path: require('path').join(__dirname, '../server/.env'),
});

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
