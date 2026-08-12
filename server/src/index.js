require('dotenv').config();

const { createApp } = require('./app');
const { connectDatabase } = require('./config/db');
const { seedIfEmpty } = require('./utils/seed');
const { SERVER } = require('./constants');

const PORT = process.env.PORT || SERVER.DEFAULT_PORT;

async function bootstrap() {
  try {
    await connectDatabase(process.env.MONGODB_URI);
    await seedIfEmpty();

    const app = createApp();
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

bootstrap();
