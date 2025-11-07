import { firebaseConfig } from "./mockData";

const app = { name: 'mock-app', config: firebaseConfig };
const db = { name: 'mock-db' };
const auth = { currentUser: null };
const storage = { type: 'mock-storage' };

export { db, auth, app, storage, firebaseConfig };