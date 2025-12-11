//import admin from  "firebase-admin";
//import { initializeApp, credential as _credential } from "firebase-admin";
//import serviceAccount from "./utils/secret.json" with {type: "json"};

//import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import admin from "firebase-admin";
import { getApp, getApps, cert } from "firebase-admin/app";

console.log(process.env.FIREBASE_FIRESTORE_EMULATOR_SOURCE);

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  //kINDA iRREVALANT
  privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
  clientId: process.env.FIREBASE_CLIENT_ID,
};

export const initFunc = function () {
  let app = getApps()?.length
    ? getApp()
    : admin.initializeApp({
        credential: cert(serviceAccount),
      });

  if (process.env.FIREBASE_FIRESTORE_EMULATOR_SOURCE === "emulator") {
    process.env["FIRESTORE_EMULATOR_HOST"] =
      process.env.FIREBASE_FIRESTORE_EMULATOR_PATH;
    process.env["FIREBASE_AUTH_EMULATOR_HOST"] =
      process.env.FIREBASE_AUTH_EMULATOR_PATH;
  }
  return app;
};
