import admin from  "firebase-admin";
//import { initializeApp, credential as _credential } from "firebase-admin";
import serviceAccount from "./utils/secret.json" with {type: "json"};

export const initFunc = function () {
  let app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  if (process.env.FIREBASE_FIRESTORE_EMULATOR_SOURCE === "emulator") {
    process.env["FIRESTORE_EMULATOR_HOST"] =
      process.env.FIREBASE_FIRESTORE_EMULATOR_PATH;
    process.env["FIREBASE_AUTH_EMULATOR_HOST"] =
      process.env.FIREBASE_AUTH_EMULATOR_PATH;
  }
  return app;
};
