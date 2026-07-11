import app from './index.js';
import { config } from './config/index.js';
import { connectDB, disconnectDB } from './config/database.js';

const serverStart = async () => {
  try {
    await connectDB();

    const server = app.listen(config.PORT, () => {
      console.log(`Server is live on http://localhost:${config.PORT}`);
    });

    const serverShutdown = () => {
      server.close(async () => {
        try {
          await disconnectDB();
          console.log('Server shutdown successfully');
          process.exit(0);
        } catch (error) {
          console.error('Error during shutdown', error);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', serverShutdown);
    process.on('SIGINT', serverShutdown);
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

serverStart();
