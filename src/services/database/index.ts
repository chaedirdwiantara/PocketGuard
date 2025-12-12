import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import { schema } from './schema';
import Category from './models/Category';
import Transaction from './models/Transaction';

import migrations from './migrations';

const adapter = new SQLiteAdapter({
    schema,
    migrations,
    jsi: true, /* Platform.OS === 'ios' */
    onSetUpError: error => {
        // Database failed to load -- offer the user to reload the app or log out
        console.error('Database setup failed:', error);
    }
});

export const database = new Database({
    adapter,
    modelClasses: [
        Category,
        Transaction,
    ],
});
