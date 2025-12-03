import Dexie, { type Table } from 'dexie';
import type { StoredUser, FormSubmission } from '../types';

// Make sure global Dexie is available
const DexieGlobal = (window as any).Dexie;

if (!DexieGlobal) {
    throw new Error("Dexie library not found. Make sure it's included in your index.html");
}

export class CorreiosDB extends DexieGlobal {
  users!: Table<StoredUser>;
  submissions!: Table<FormSubmission>;

  constructor() {
    super('correiosDB');
    this.version(1).stores({
      users: '++id, &matricula, nome, senhaHash', // Primary key and indexed props
      submissions: 'id, timestamp, cepColeta, carteiro', // Primary key and indexed props
    });
  }
}

export const db = new CorreiosDB();