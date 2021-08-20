const serverPath = "./bin/www.js";

module.exports = {
  apps: [
    {
      name: "webSocketApp-app",
      exec_mode: "fork",
      script: serverPath,
      watch: false,
      log_date_format: "YYYY-MM-DD HH:mm Z",
    },
  ],
};
