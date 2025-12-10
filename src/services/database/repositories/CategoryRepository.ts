import { database } from '../index';
import Category from '../models/Category';
import { Model } from '@nozbe/watermelondb';

const categoriesCollection = database.get<Category>('categories');

export const CategoryRepository = {
    // Get all categories (one-time fetch)
    getAll: async () => {
        return await categoriesCollection.query().fetch();
    },

    // Observe all categories (reactive)
    observeAll: () => {
        return categoriesCollection.query().observe();
    },

    // Create a new category
    create: async (name: string, type: 'income' | 'expense', color: string = '#000000', icon?: string) => {
        return await database.write(async () => {
            return await categoriesCollection.create(category => {
                category.name = name;
                category.type = type;
                category.color = color;
                category.icon = icon;
            });
        });
    },

    // Delete all categories (for testing reset)
    deleteAll: async () => {
        return await database.write(async () => {
            const all = await categoriesCollection.query().fetch();
            const batch = all.map(cat => cat.prepareDestroyPermanently());
            await database.batch(batch);
        });
    }
};
