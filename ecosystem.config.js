// PM2 ecosystem configuration for production deployment
module.exports = {
  apps: [
    {
      name: 'school-comm-api',
      script: 'src/server.js',
      instances: process.env.API_INSTANCES || 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 3000
      },
      // Restart configuration
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '500M',
      
      // Logging
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Monitoring
      monitoring: false,
      pmx: true,
      
      // Advanced features
      watch: false,
      ignore_watch: ['node_modules', 'logs', '.git'],
      
      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 3000,
      
      // Health check
      health_check_grace_period: 3000
    },
    {
      name: 'school-comm-message-worker',
      script: 'src/workers/messageWorker.js',
      instances: process.env.MESSAGE_WORKER_INSTANCES || 2,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        WORKER_TYPE: 'message',
        MESSAGE_WORKER_CONCURRENCY: 5
      },
      env_production: {
        NODE_ENV: 'production',
        WORKER_TYPE: 'message',
        MESSAGE_WORKER_CONCURRENCY: process.env.MESSAGE_WORKER_CONCURRENCY || 5
      },
      
      // Restart configuration
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '300M',
      
      // Logging
      log_file: './logs/message-worker.log',
      out_file: './logs/message-worker-out.log',
      error_file: './logs/message-worker-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Worker specific
      watch: false,
      kill_timeout: 10000, // Longer timeout for workers
      listen_timeout: 5000
    },
    {
      name: 'school-comm-whatsapp-worker',
      script: 'src/workers/whatsappWorker.js',
      instances: process.env.WHATSAPP_WORKER_INSTANCES || 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        WORKER_TYPE: 'whatsapp',
        WHATSAPP_WORKER_CONCURRENCY: 3
      },
      env_production: {
        NODE_ENV: 'production',
        WORKER_TYPE: 'whatsapp',
        WHATSAPP_WORKER_CONCURRENCY: process.env.WHATSAPP_WORKER_CONCURRENCY || 3
      },
      
      // Restart configuration
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '200M',
      
      // Logging
      log_file: './logs/whatsapp-worker.log',
      out_file: './logs/whatsapp-worker-out.log',
      error_file: './logs/whatsapp-worker-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Worker specific
      watch: false,
      kill_timeout: 15000, // Longer timeout for WhatsApp operations
      listen_timeout: 5000
    },
    {
      name: 'school-comm-notification-worker',
      script: 'src/workers/notificationWorker.js',
      instances: 1, // Single instance for scheduled tasks
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        WORKER_TYPE: 'notification',
        NOTIFICATION_WORKER_CONCURRENCY: 2
      },
      env_production: {
        NODE_ENV: 'production',
        WORKER_TYPE: 'notification',
        NOTIFICATION_WORKER_CONCURRENCY: process.env.NOTIFICATION_WORKER_CONCURRENCY || 2
      },
      
      // Restart configuration
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '250M',
      
      // Logging
      log_file: './logs/notification-worker.log',
      out_file: './logs/notification-worker-out.log',
      error_file: './logs/notification-worker-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Worker specific
      watch: false,
      kill_timeout: 10000,
      listen_timeout: 5000,
      
      // Cron restart to prevent memory leaks in long-running scheduled tasks
      cron_restart: '0 4 * * *' // Restart daily at 4 AM
    }
  ],

  deploy: {
    production: {
      user: 'deploy',
      host: ['your-production-server.com'],
      ref: 'origin/main',
      repo: 'https://github.com/your-username/school-comm-system.git',
      path: '/var/www/school-comm-system',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run migrate && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      'ssh_options': 'StrictHostKeyChecking=no'
    },
    staging: {
      user: 'deploy',
      host: ['your-staging-server.com'],
      ref: 'origin/develop',
      repo: 'https://github.com/your-username/school-comm-system.git',
      path: '/var/www/school-comm-system-staging',
      'post-deploy': 'npm install && npm run migrate && pm2 reload ecosystem.config.js --env staging',
      env: {
        NODE_ENV: 'staging'
      }
    }
  }
};