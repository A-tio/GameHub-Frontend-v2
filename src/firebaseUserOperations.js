import firebase from 'firebase/compat/app';
import { db} from './fireBase';
import { collection, addDoc, doc, getDoc, deleteDoc, setDoc, query, where, getDocs } from 'firebase/firestore';
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
