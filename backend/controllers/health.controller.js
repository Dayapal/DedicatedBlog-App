import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HTTP_STATUS } from "../constants/statusCodes.js";

export const getHealthStatus = asyncHandler(async (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  const isHealthy = dbState === 1;

  res.status(isHealthy ? HTTP_STATUS.OK : HTTP_STATUS.SERVICE_UNAVAILABLE).json({
    success: isHealthy,
    status: isHealthy ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: {
      status: dbStatusMap[dbState] || "unknown",
      readyState: dbState,
    },
    system: {
      nodeVersion: process.version,
      memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    },
  });
});
