const path = require("path");
const fs = require("fs");

const envPath = path.resolve(__dirname, ".env");
const envVars = {};

if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx > 0) {
        envVars[trimmed.substring(0, idx)] = trimmed.substring(idx + 1);
      }
    }
  }
}

module.exports = {
  apps: [
    {
      name: "asiamax",
      script: "./artifacts/api-server/dist/index.mjs",
      node_args: "--enable-source-maps",
      env: {
        NODE_ENV: "production",
        PORT: 6000,
        SERVE_STATIC: "true",
        ...envVars,
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
