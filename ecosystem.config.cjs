module.exports = {
  apps: [
    {
      name: "asiamax",
      script: "./artifacts/api-server/dist/index.mjs",
      node_args: "--enable-source-maps",
      cwd: "/var/www/asiamax.store",
      env: {
        NODE_ENV: "production",
        PORT: 6000,
        SERVE_STATIC: "true",
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "/var/www/asiamax.store/logs/error.log",
      out_file: "/var/www/asiamax.store/logs/out.log",
      merge_logs: true,
    },
  ],
};
