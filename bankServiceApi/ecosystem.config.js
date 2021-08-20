const serverPath = "./startServer.js";

module.exports = {
  apps: [
    {
      name: "bankService-app",
      exec_mode: "fork",
      script: serverPath,
      watch: false,
      log_date_format: "YYYY-MM-DD HH:mm Z",
    },
  ],
};
