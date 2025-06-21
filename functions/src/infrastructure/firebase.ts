import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  initializeApp(); // Inicializa usando las credenciales por defecto de Cloud Functions
}

export const db = getFirestore();
