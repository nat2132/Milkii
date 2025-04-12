import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import { mySchema } from './schema';
import {
  User,
  Inventory,
  Sale,
  Contact,
  Debt,
  DebtItem,
  Notification,
  Analytics,
  Report,
  Setting,
} from './models';

const adapter = new SQLiteAdapter({
  schema: mySchema,
  dbName: 'app',
  jsi: true, // set to true if using Hermes engine
  onSetUpError: error => {
    console.error('WatermelonDB setup error:', error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [
    User,
    Inventory,
    Sale,
    Contact,
    Debt,
    DebtItem,
    Notification,
    Analytics,
    Report,
    Setting,
  ],
});
