import { initializeApp, applicationDefault, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

if (!getApps().length) {
  initializeApp({
    credential: applicationDefault(),
  });
}

const db = getFirestore();

// const isEmulator = process.env.FUNCTIONS_EMULATOR === "true";
// if (isEmulator) {
//   db.settings({
//     host: "localhost:8085",
//     ssl: false,
//   });
// }

export { db };
