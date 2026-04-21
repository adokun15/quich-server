import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL);

//Whatsapp
export const whatsappQueue = new Queue("whatsapp", {
  connection,
});

//Paystack

//Rate-limit
