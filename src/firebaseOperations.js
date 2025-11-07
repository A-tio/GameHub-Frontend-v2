import { addMockLog, ensureCollection, generateMockId, notifyCollectionListeners } from './mockData';

const clone = (entry) => ({ ...entry });

const laraveLOG = async (message) => {
  addMockLog(message);
  return true;
};

const addEntry = async (collectionName, data) => {
  const bucket = ensureCollection(collectionName);
  const id = data?.id ?? generateMockId();
  const entry = { ...data, id };
  bucket.push(entry);
  notifyCollectionListeners(collectionName);
  return id;
};

const addEntryWithId = async (collectionName, docId, data) => {
  const bucket = ensureCollection(collectionName);
  const existingIndex = bucket.findIndex((doc) => doc.id === docId);
  const entry = { ...data, id: docId };
  if (existingIndex >= 0) {
    bucket.splice(existingIndex, 1, entry);
  } else {
    bucket.push(entry);
  }
  notifyCollectionListeners(collectionName);
  return docId;
};

const searchEntry = async (collectionName, fieldName, operator, value) => {
  if (operator !== '==') {
    throw new Error(`Unsupported operator ${operator} in mock searchEntry`);
  }
  return ensureCollection(collectionName)
    .filter((entry) => entry[fieldName] === value)
    .map(clone);
};

const fetchAllEntries = async (collectionName, orderParam) => {
  const snapshot = ensureCollection(collectionName).map(clone);
  if (!orderParam) {
    return snapshot;
  }
  return snapshot.sort((a, b) => {
    const lhs = a[orderParam];
    const rhs = b[orderParam];
    if (lhs instanceof Date && rhs instanceof Date) {
      return rhs.getTime() - lhs.getTime();
    }
    if (typeof lhs === 'number' && typeof rhs === 'number') {
      return rhs - lhs;
    }
    if (typeof lhs === 'string' && typeof rhs === 'string') {
      return rhs.localeCompare(lhs);
    }
    return 0;
  });
};

const getEntryById = async (collectionName, docId) => {
  const entry = ensureCollection(collectionName).find((doc) => doc.id === docId);
  return entry ? clone(entry) : null;
};

const deleteEntry = async (collectionName, docId) => {
  const bucket = ensureCollection(collectionName);
  const index = bucket.findIndex((doc) => doc.id === docId);
  if (index === -1) {
    return null;
  }
  bucket.splice(index, 1);
  notifyCollectionListeners(collectionName);
  return docId;
};

const updateEntry = async (collectionName, docId, updatedData) => {
  const bucket = ensureCollection(collectionName);
  const index = bucket.findIndex((doc) => doc.id === docId);
  if (index === -1) {
    return null;
  }
  const merged = { ...bucket[index], ...updatedData };
  bucket.splice(index, 1, merged);
  notifyCollectionListeners(collectionName);
  return docId;
};

export {
  laraveLOG,
  addEntry,
  addEntryWithId,
  getEntryById,
  searchEntry,
  deleteEntry,
  updateEntry,
  fetchAllEntries,
};
