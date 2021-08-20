#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require("../app");
var debug = require("debug")("websocketserver:server");
var http = require("http");

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  console.log("Listening on " + bind);
}

/* ________________________________________ 
            WEB SOCKET SERVER*/

const io = require("socket.io")(server);
const fs = require("fs");
const fsPromises = fs.promises;
const path = require("path");

io.on("connection", async (socket) => {
  console.log("New User Connected");

  socket.on("event.interaction", async (data) => {
    let filePath = path.resolve(__dirname, "../log/interactions.txt");
    let stringedData = JSON.stringify(data);
    console.log("event.interaction: ", stringedData);

    await fsPromises.appendFile(filePath, `${stringedData}\n`);
    socket.emit("event.interactionAck", "Interaction message acknowledged");
  });

  socket.on("event.error", async (data) => {
    let filePath = path.resolve(__dirname, "../log/errors.txt");

    console.log("event.error: ", data);
    await fsPromises.appendFile(filePath, `${data}\n`);
    socket.emit("event.errorAck", "Error message acknowledged");
  });

  setInterval(() => {
    console.log("Sending life beat");
    socket.emit("lifeBeat", "You are still connected!");
  }, 180000); // Send life beat every 3 minutes
});
/* ________________________________________ */
