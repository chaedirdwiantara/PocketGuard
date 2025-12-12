import { database } from '../index';
import Category from '@database/models/Category';

// Standard Categories Definition
const DEFAULT_CATEGORIES = [
    // NEEDS (Kebutuhan Pokok) - Red/Orange Theme
    { name: 'Food & Beverage', type: 'expense', color: '#EF4444', icon: 'food' }, // Red-500
    { name: 'Transportation', type: 'expense', color: '#F97316', icon: 'bus' },   // Orange-500
    { name: 'Housing', type: 'expense', color: '#EA580C', icon: 'home' },         // Orange-600
    { name: 'Utilities', type: 'expense', color: '#F59E0B', icon: 'flash' },      // Amber-500
    { name: 'Groceries', type: 'expense', color: '#D97706', icon: 'cart' },       // Amber-600
    { name: 'Healthcare', type: 'expense', color: '#DC2626', icon: 'medical' },   // Red-600

    // WANTS (Hiburan/Keinginan) - Purple/Pink Theme
    { name: 'Entertainment', type: 'expense', color: '#8B5CF6', icon: 'movie' },  // Violet-500
    { name: 'Shopping', type: 'expense', color: '#EC4899', icon: 'shopping' },    // Pink-500
    { name: 'Dining Out', type: 'expense', color: '#D946EF', icon: 'restaurant' },// Fuchsia-500
    { name: 'Hobbies', type: 'expense', color: '#A855F7', icon: 'game' },         // Purple-500
    { name: 'Travel', type: 'expense', color: '#6366F1', icon: 'airplane' },      // Indigo-500

    // SAVINGS & FINANCIAL (Tabungan) - Blue/Cyan Theme
    { name: 'Savings', type: 'expense', color: '#3B82F6', icon: 'piggy' },        // Blue-500
    { name: 'Investments', type: 'expense', color: '#0EA5E9', icon: 'chart' },    // Sky-500
    { name: 'Emergency Fund', type: 'expense', color: '#2563EB', icon: 'shield' },// Blue-600

    // GIVING (Infak/Sedekah) - Green Theme
    { name: 'Zakat', type: 'expense', color: '#10B981', icon: 'hand' },           // Emerald-500
    { name: 'Infaq/Sedekah', type: 'expense', color: '#059669', icon: 'heart' },  // Emerald-600
    { name: 'Gifts', type: 'expense', color: '#84CC16', icon: 'gift' },           // Lime-500

    // INCOME - Teal/Green Theme
    { name: 'Salary', type: 'income', color: '#14B8A6', icon: 'wallet' },         // Teal-500
    { name: 'Business', type: 'income', color: '#0D9488', icon: 'briefcase' },    // Teal-600
    { name: 'Freelance', type: 'income', color: '#0F766E', icon: 'laptop' },      // Teal-700
    { name: 'Investment Return', type: 'income', color: '#115E59', icon: 'cash' },// Teal-800
] as const;

export const CategorySeeder = {
    seedWithBudget: async (allocations: { id: string, name: string, defaultPct: number, color: string }[], income: number) => {
        try {
            await database.write(async () => {
                // Clear existing categories first (optional, but cleaner for onboarding reuse)
                // const all = await database.get('categories').query().fetch();
                // await database.batch(all.map(c => c.prepareDestroyPermanently())); 

                const batch = [];

                allocations.forEach(alloc => {
                    const amount = (income * alloc.defaultPct) / 100;
                    const newCat = database.get<Category>('categories').prepareCreate(record => {
                        const category = record as Category;
                        category.name = alloc.name;
                        category.type = 'expense'; // Default to expense for allocations
                        category.color = alloc.color;
                        category.allocatedPercentage = alloc.defaultPct;
                        category.allocatedAmount = amount;
                        category.icon = 'chart'; // Generic icon for now
                    });
                    batch.push(newCat);
                });

                // Add Income Category separately if needed
                const incomeCat = database.get<Category>('categories').prepareCreate(record => {
                    const category = record as Category;
                    category.name = 'Pemasukan';
                    category.type = 'income';
                    category.color = '#10B981';
                    category.icon = 'wallet';
                });
                batch.push(incomeCat);

                await database.batch(batch);
            });
            console.log('Budget seeded successfully');
        } catch (error) {
            console.error('Failed to seed budget:', error);
            throw error;
        }
    },

    seed: async () => {
        // Legacy or default seed if needed
        try {
            const existingCount = await database.get('categories').query().fetchCount();
            if (existingCount > 0) return;

            await database.write(async () => {
                const batch = DEFAULT_CATEGORIES.map(cat => {
                    return database.get<Category>('categories').prepareCreate(record => {
                        const category = record as Category;
                        category.name = cat.name;
                        category.type = cat.type;
                        category.color = cat.color;
                        category.icon = cat.icon;
                    });
                });
                await database.batch(batch);
            });
            console.log('Default categories seeded.');
        } catch (error) {
            console.error('Failed to seed default categories:', error);
        }
    }
};
