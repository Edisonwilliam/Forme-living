import dns from 'dns';

// Ensure DNS servers are set for Windows SRV record resolution
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore if restricted
}

import http from 'http';
import app from './app';
import { env } from './config/environment';
import { connectDatabase, disconnectDatabase } from './config/database';

async function bootstrap() {
  // Connect to database before opening server traffic
  await connectDatabase().catch((err) => {
    console.error('Initial database connection failure:', err.message);
  });

  const server = http.createServer(app);

  server.listen(env.PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🏛️  FORME Living — Commerce Engine`);
    console.log(`🚀  Server active on: http://localhost:${env.PORT}`);
    console.log(`🩺  Health check:     http://localhost:${env.PORT}/api/health`);
    console.log(`🌍  Environment:      ${env.NODE_ENV}`);
    console.log(`======================================================\n`);
  });

  // Graceful shutdown handling
  const shutdown = async (signal: string) => {
    console.log(`\nReceived ${signal}. Initiating graceful shutdown...`);
    server.close(async () => {
      console.log('HTTP Server closed.');
      await disconnectDatabase();
      process.exit(0);
    });

    // Force close after 10 seconds if hanging
    setTimeout(() => {
      console.error('Forced shutdown due to timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((err) => {
  console.error('Fatal bootstrap error:', err);
  process.exit(1);
});
