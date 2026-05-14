//Redis: ( Ratelimit and Auth Otps )

import { rateLimit } from "express-rate-limit";
import { PostgresStore } from "@acpr/rate-limit-postgresql";

// 5 request per min;
const loginLimiter = rateLimit({
  windowMs: 400000, //Window of request before it closes
  limit: "",
  message: {
    status: false,
    code: 429,
    message: "Too many request, please try again later",
  },
  skip: false,
  logger: {
    warn: (error, message) => {
      // TODO: do something with error and message
    },
    error: (error, message) => {
      // TODO: do something with error and message
    },
  },
});

const globalLimiter = rateLimit({
  store: new PostgresStore(
    {
      user: "postgres",
      password: "postgres",
      host: "localhost",
      database: "quich",
      port: 5432,
    },
    "aggregated_store",
  ),
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
});
