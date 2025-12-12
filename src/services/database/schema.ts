import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
    version: 3,
    tables: [
        tableSchema({
            name: 'categories',
            columns: [
                { name: 'name', type: 'string' },
                { name: 'icon', type: 'string', isOptional: true },
                { name: 'color', type: 'string' },
                { name: 'type', type: 'string' }, // 'income' | 'expense'
                { name: 'allocated_percentage', type: 'number', isOptional: true }, // For smart budget
                { name: 'allocated_amount', type: 'number', isOptional: true }, // For fixed budget
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' },
            ],
        }),
        tableSchema({
            name: 'transactions',
            columns: [
                { name: 'amount', type: 'number' },
                { name: 'note', type: 'string', isOptional: true },
                { name: 'date', type: 'number' },
                { name: 'type', type: 'string' }, // 'income' | 'expense'
                { name: 'category_id', type: 'string', isIndexed: true },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' },
            ],
        }),
    ],
});
