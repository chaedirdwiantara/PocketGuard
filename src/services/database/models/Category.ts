import { Model } from '@nozbe/watermelondb';
import { field, text, date, readonly } from '@nozbe/watermelondb/decorators';

export default class Category extends Model {
    static table = 'categories';

    @text('name') name!: string;
    @text('icon') icon?: string;
    @text('color') color!: string;
    @text('type') type!: 'income' | 'expense';

    @field('allocated_percentage') allocatedPercentage?: number;
    @field('allocated_amount') allocatedAmount?: number;

    @readonly @date('created_at') createdAt!: Date;
    @readonly @date('updated_at') updatedAt!: Date;
}
