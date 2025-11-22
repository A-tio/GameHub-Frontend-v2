import firebase from 'firebase/compat/app';
import { db } from './fireBase';
import { getEntryById } from './firebaseOperations';

async function getUserDeets(userId) {
  if (!userId) {
    return null;
  }
  const docSnap = await getEntryById('users', typeof userId === 'string' ? userId : userId?.id);
  if (!docSnap) {
    return null;
  }
  const { username, handle } = docSnap;
  return { username, handle };
}

export { getUserDeets };
