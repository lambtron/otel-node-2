require("./telemetry"); // Load OpenTelemetry setup
const express = require("express");
const winston = require("winston");
const logDir = "/var/log/otel-node";

// Create log directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Setup Winston to output to `logDir`.
const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} ${level}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.File({ filename: `${logDir}/node-express-app.log` }),
    ],
});

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    logger.info("Received request at /");
    res.send("Hello, OpenTelemetry with Loki!");
});

app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
});
