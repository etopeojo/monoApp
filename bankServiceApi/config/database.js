module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'mongoose',
      settings: {
        host: env('DATABASE_HOST', '134.209.30.188'),
        srv: env.bool('DATABASE_SRV', false),
        port: env.int('DATABASE_PORT', 10255),
        database: env('DATABASE_NAME', 'test-strapi'),
        username: env('DATABASE_USERNAME', 'celd'),
        password: env('DATABASE_PASSWORD', 'KMbGZzliP47WAWHJXs27Id527KEiJWhwZUuK3mLU7lcKUWFK46HdMRpuObZoojOrZWeCpGtRcWL9mJnz2GN8tQ=='),
      },
      options: {
        authenticationDatabase: env('AUTHENTICATION_DATABASE', 'admin'),
        ssl: env.bool('DATABASE_SSL', false),
      },
    },
  },
});
