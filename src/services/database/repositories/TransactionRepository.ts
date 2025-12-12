import { database } from '../index';
import Transaction from '../models/Transaction';
import { Q } from '@nozbe/watermelondb';

const transactionsCollection = database.get<Transaction>('transactions');

export const TransactionRepository = {
    // Get all transactions
    getAll: async () => {
        return await transactionsCollection.query(Q.sortBy('date', Q.desc)).fetch();
    },

    // Observe all transactions
    observeAll: () => {
        return transactionsCollection.query(Q.sortBy('date', Q.desc)).observe();
    },

    // Create a new transaction
    create: async (
        amount: number,
        type: 'income' | 'expense',
        categoryId: string,
        date: Date = new Date(),
        note?: string
    ) => {
        return await database.write(async () => {
            return await transactionsCollection.create(tx => {
                tx.amount = amount;
                tx.type = type;
                tx.category.id = categoryId;
                tx.date = date;
                tx.note = note;
            });
        });
    },

    // Update a transaction
    update: async (
        id: string,
        updates: {
            amount?: number;
            type?: 'income' | 'expense';
            categoryId?: string;
            date?: Date;
            note?: string;
        }
    ) => {
        return await database.write(async () => {
            const tx = await transactionsCollection.find(id);
            await tx.update(t => {
                if (updates.amount !== undefined) t.amount = updates.amount;
                if (updates.type !== undefined) t.type = updates.type;
                if (updates.categoryId !== undefined) t.category.id = updates.categoryId;
                if (updates.date !== undefined) t.date = updates.date;
                if (updates.note !== undefined) t.note = updates.note;
            });
        });
    },

    // Delete a transaction
    delete: async (id: string) => {
        return await database.write(async () => {
            const tx = await transactionsCollection.find(id);
            await tx.markAsDeleted(); // Syncable delete
            await tx.destroyPermanently(); // Or destroy permanently if no sync
        });
    },

    // Delete all 
    deleteAll: async () => {
        return await database.write(async () => {
            const all = await transactionsCollection.query().fetch();
            const batch = all.map(tx => tx.prepareDestroyPermanently());
            await database.batch(batch);
        });
    }
};
