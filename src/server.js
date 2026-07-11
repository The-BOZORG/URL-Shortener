import app from './index.js';
import { logger } from './utils/logger.js';
import { config } from './config/index.js';
import { connectDB, disconnectDB } from './config/database.js';

const serverStart = async () => {
  try {
    await connectDB();

    const server = app.listen(config.PORT, () => {
      logger.info(`Server is live on http://localhost:${config.PORT}`);
    });

    const serverShutdown = () => {
      server.close(async () => {
        try {
          await disconnectDB();
          logger.info('Server shutdown successfully');
          process.exit(0);
        } catch (error) {
          logger.error('Error during shutdown', error);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', serverShutdown);
    process.on('SIGINT', serverShutdown);
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

serverStart();
