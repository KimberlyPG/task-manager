import "dotenv/config";
// Inject dependencies
import "./infrastructure/adapters/adapters.di";

import app from "./infrastructure/api";

import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";

// import * as logger from "firebase-functions/logger";

setGlobalOptions({ maxInstances: 10 });

// Inicializar Firebase Admin
export const api = onRequest(app);
