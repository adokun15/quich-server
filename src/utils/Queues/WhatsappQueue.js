import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL, {
  tls: {},
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

//Whatsapp
export const whatsappQueue = new Queue("whatsapp", {
  connection,
});

//Paystack

//Rate-limit
