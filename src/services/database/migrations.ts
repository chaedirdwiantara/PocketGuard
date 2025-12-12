import { schemaMigrations, addColumns } from '@nozbe/watermelondb/Schema/migrations';

export default schemaMigrations({
    migrations: [
        {
            toVersion: 3,
            steps: [
                addColumns({
                    table: 'categories',
                    columns: [
                        { name: 'allocated_percentage', type: 'number', isOptional: true },
                        { name: 'allocated_amount', type: 'number', isOptional: true },
                    ],
                }),
            ],
        },
    ],
});
