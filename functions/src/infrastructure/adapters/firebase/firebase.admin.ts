import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const firestore = admin.firestore();
if (process.env.NODE_ENV === "development") {
  firestore.settings({
    host: "localhost:8080",
    ssl: false,
  });
}

export { firestore };
