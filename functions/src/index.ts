import "dotenv/config";

import app from "./infrastructure/api"; // <--- Importá la app de Express

import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";

// import * as logger from "firebase-functions/logger";

setGlobalOptions({ maxInstances: 10 });

import { initializeApp, applicationDefault } from "firebase-admin/app";

// Inicializar Firebase Admin
initializeApp({
  credential: applicationDefault(),
});

export const api = onRequest(app);
